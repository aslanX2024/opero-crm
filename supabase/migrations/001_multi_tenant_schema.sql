-- =============================================================================
-- EMLAK CRM - MULTI-TENANT DATABASE SCHEMA
-- Supabase SQL Migration
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- WORKSPACES - Ana tenant tablosu
-- =============================================================================

CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'solo' CHECK (plan_type IN ('solo', 'office')),
    billing_mode TEXT NOT NULL DEFAULT 'self' CHECK (billing_mode IN ('self', 'broker')),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    max_members INTEGER NOT NULL DEFAULT 1,
    logo_url TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- WORKSPACE MEMBERS - Üyelik tablosu
-- =============================================================================

CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'danisman' CHECK (role IN ('broker', 'danisman')),
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    invited_by UUID REFERENCES auth.users(id),
    UNIQUE(workspace_id, user_id)
);

-- =============================================================================
-- WORKSPACE INVITES - Davet linkleri
-- =============================================================================

CREATE TABLE IF NOT EXISTS workspace_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email TEXT,
    invite_code TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'danisman' CHECK (role IN ('broker', 'danisman')),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- PROFILES - Kullanıcı profilleri (workspace bağlantısı ile)
-- =============================================================================

-- Mevcut profiles tablosuna workspace_id ekle
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- =============================================================================
-- PROPERTIES - Mülkler (workspace filtresi ile)
-- =============================================================================

ALTER TABLE properties 
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- =============================================================================
-- CUSTOMERS - Müşteriler (workspace filtresi ile)
-- =============================================================================

ALTER TABLE customers 
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- =============================================================================
-- DEALS - Pipeline fırsatları (workspace filtresi ile)
-- =============================================================================

ALTER TABLE deals 
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- =============================================================================
-- APPOINTMENTS - Randevular (workspace filtresi ile)
-- =============================================================================

ALTER TABLE appointments 
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_workspace ON profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_properties_workspace ON properties(workspace_id);
CREATE INDEX IF NOT EXISTS idx_customers_workspace ON customers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_workspace ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_appointments_workspace ON appointments(workspace_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspace_owner_policy ON workspaces
    FOR ALL USING (owner_id = auth.uid());

CREATE POLICY workspace_member_read_policy ON workspaces
    FOR SELECT USING (
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Workspace Members
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY member_workspace_policy ON workspace_members
    FOR ALL USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
            UNION
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- Profiles
CREATE POLICY profile_workspace_policy ON profiles
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Properties
CREATE POLICY property_workspace_policy ON properties
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Customers
CREATE POLICY customer_workspace_policy ON customers
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Deals
CREATE POLICY deal_workspace_policy ON deals
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Appointments
CREATE POLICY appointment_workspace_policy ON appointments
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Yeni kullanıcı için otomatik workspace oluşturma
CREATE OR REPLACE FUNCTION create_workspace_for_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo workspace oluştur
    INSERT INTO workspaces (name, slug, plan_type, owner_id)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Workspace'),
        NEW.id::text,
        'solo',
        NEW.id
    );
    
    -- Kullanıcıyı workspace'e üye olarak ekle
    INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
    SELECT id, NEW.id, 
           CASE WHEN NEW.raw_user_meta_data->>'role' = 'broker' THEN 'broker' ELSE 'danisman' END,
           NOW()
    FROM workspaces WHERE owner_id = NEW.id;
    
    -- Profili güncelle
    UPDATE profiles 
    SET workspace_id = (SELECT id FROM workspaces WHERE owner_id = NEW.id)
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_workspace_for_user();

-- =============================================================================
-- DAVET LİNKİ OLUŞTURMA FONKSİYONU
-- =============================================================================

CREATE OR REPLACE FUNCTION create_invite_link(
    p_workspace_id UUID,
    p_email TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'danisman',
    p_expires_days INTEGER DEFAULT 7
)
RETURNS TEXT AS $$
DECLARE
    v_invite_code TEXT;
BEGIN
    -- Rastgele kod oluştur
    v_invite_code := encode(gen_random_bytes(16), 'hex');
    
    -- Daveti kaydet
    INSERT INTO workspace_invites (workspace_id, email, invite_code, role, expires_at, created_by)
    VALUES (
        p_workspace_id,
        p_email,
        v_invite_code,
        p_role,
        NOW() + (p_expires_days || ' days')::interval,
        auth.uid()
    );
    
    RETURN v_invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
