-- =============================================================================
-- OPERO CRM - COMPLETE DATABASE SCHEMA
-- Bu dosya tüm tabloları sıfırdan oluşturur (temiz kurulum için)
-- =============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROFILES - Kullanıcı Profilleri
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'danisman' CHECK (role IN ('danisman', 'broker', 'admin')),
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN xp < 100 THEN 1
            WHEN xp < 300 THEN 2
            WHEN xp < 600 THEN 3
            WHEN xp < 1000 THEN 4
            WHEN xp < 1500 THEN 5
            WHEN xp < 2100 THEN 6
            WHEN xp < 2800 THEN 7
            WHEN xp < 3600 THEN 8
            WHEN xp < 4500 THEN 9
            ELSE 10
        END
    ) STORED,
    avatar_url TEXT,
    workspace_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- WORKSPACES - Ofis/Şirket (Multi-Tenant)
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles'a workspace referansı ekle
ALTER TABLE profiles 
    ADD CONSTRAINT fk_profiles_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL;

-- =============================================================================
-- WORKSPACE MEMBERS - Ofis Üyeleri
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
-- WORKSPACE INVITES - Davet Linkleri
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
-- SUBSCRIPTIONS - Abonelikler (PayTR entegrasyonu için)
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plan bilgileri
    plan_type TEXT NOT NULL CHECK (plan_type IN ('solo', 'office')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'past_due')),
    
    -- Fiyatlandırma
    base_price DECIMAL(10,2) NOT NULL,
    per_member_price DECIMAL(10,2) DEFAULT 0,
    member_count INTEGER DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    
    -- Dönemsel bilgiler
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_end TIMESTAMPTZ,
    
    -- PayTR bilgileri
    paytr_merchant_oid TEXT,
    paytr_token TEXT,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

-- =============================================================================
-- PAYMENT_HISTORY - Ödeme Geçmişi
-- =============================================================================

CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Ödeme bilgileri
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- PayTR bilgileri
    paytr_merchant_oid TEXT,
    paytr_hash TEXT,
    payment_type TEXT, -- credit_card, bank_transfer, etc.
    
    -- Fatura bilgileri
    invoice_number TEXT,
    invoice_url TEXT,
    
    -- Meta
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    error_message TEXT
);

-- =============================================================================
-- PROPERTIES - Mülkler
-- =============================================================================

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Temel bilgiler
    title TEXT NOT NULL,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('satilik', 'kiralik')),
    property_type TEXT NOT NULL CHECK (property_type IN ('daire', 'villa', 'arsa', 'isyeri', 'mustakil', 'residence')),
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'satildi', 'kiralandi', 'pasif')),
    
    -- Fiyat
    price DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 2,
    
    -- Konum
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    neighborhood TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Özellikler
    gross_area INTEGER,
    net_area INTEGER,
    room_count TEXT,
    floor INTEGER,
    total_floors INTEGER,
    building_age INTEGER,
    heating_type TEXT,
    
    -- Boolean özellikler
    has_elevator BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    has_balcony BOOLEAN DEFAULT FALSE,
    is_in_complex BOOLEAN DEFAULT FALSE,
    is_furnished BOOLEAN DEFAULT FALSE,
    is_credit_eligible BOOLEAN DEFAULT FALSE,
    is_exchange_eligible BOOLEAN DEFAULT FALSE,
    
    -- Görseller
    images TEXT[] DEFAULT '{}',
    main_image_index INTEGER DEFAULT 0,
    video_url TEXT,
    
    -- Mal sahibi
    owner_name TEXT,
    owner_phone TEXT,
    authorization_start DATE,
    authorization_end DATE,
    owner_notes TEXT,
    
    -- Açıklama
    description TEXT,
    portal_ids JSONB DEFAULT '{}',
    
    -- İstatistikler
    views INTEGER DEFAULT 0,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- CUSTOMERS - Müşteriler
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Temel bilgiler
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    customer_type TEXT NOT NULL CHECK (customer_type IN ('alici', 'satici', 'kiraci', 'yatirimci')),
    status TEXT NOT NULL DEFAULT 'yeni' CHECK (status IN ('yeni', 'iletisimde', 'aktif', 'donusmus', 'pasif')),
    lead_source TEXT CHECK (lead_source IN ('sahibinden', 'hepsiemlak', 'website', 'referans', 'walkin', 'telefon', 'sosyal_medya')),
    lead_score INTEGER DEFAULT 0,
    
    -- Tercihler
    preferred_regions TEXT[] DEFAULT '{}',
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    preferred_property_types TEXT[] DEFAULT '{}',
    preferred_room_counts TEXT[] DEFAULT '{}',
    
    -- İletişim takibi
    last_contact_date DATE,
    next_follow_up DATE,
    total_showings INTEGER DEFAULT 0,
    total_offers INTEGER DEFAULT 0,
    
    -- Notlar
    notes TEXT,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- DEALS - Pipeline Fırsatları
-- =============================================================================

CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Bağlantılar
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Deal bilgileri
    title TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'yeni_lead' CHECK (stage IN (
        'yeni_lead', 'iletisim_kuruldu', 'kalifikasyon', 
        'gosterim_planlandi', 'gosterim_yapildi', 
        'teklif', 'muzakere', 'sozlesme', 'kapanis', 'tamamlandi'
    )),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expected_value DECIMAL(15,2),
    probability INTEGER DEFAULT 10,
    
    -- Tarihler
    stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Takip
    next_action TEXT,
    notes TEXT,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- APPOINTMENTS - Randevular
-- =============================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Bağlantılar
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    
    -- Randevu bilgileri
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('gosterim', 'toplanti', 'degerleme', 'imza')),
    status TEXT NOT NULL DEFAULT 'planlanmis' CHECK (status IN ('planlanmis', 'tamamlandi', 'iptal', 'noshow')),
    
    -- Tarih/saat
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Ek bilgiler
    location TEXT,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- COMMISSION_TRANSACTIONS - Komisyon İşlemleri
-- =============================================================================

CREATE TABLE IF NOT EXISTS commission_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Danışman
    agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    co_broker_id UUID REFERENCES auth.users(id),
    
    -- Satış bilgileri
    sale_price DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    total_commission DECIMAL(15,2) NOT NULL,
    vat DECIMAL(15,2) NOT NULL,
    gross_commission DECIMAL(15,2) NOT NULL,
    
    -- Paylaşım
    agent_share INTEGER NOT NULL, -- Yüzde
    agent_amount DECIMAL(15,2) NOT NULL,
    office_amount DECIMAL(15,2) NOT NULL,
    co_broker_amount DECIMAL(15,2),
    
    -- Durum
    status TEXT NOT NULL DEFAULT 'bekleyen' CHECK (status IN ('bekleyen', 'onaylandi', 'tahsil_edildi', 'iptal')),
    collected_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Tarihler
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    collected_date DATE,
    
    -- Meta
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- GAMIFICATION - Rozetler ve Başarılar
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_code TEXT NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_code)
);

CREATE TABLE IF NOT EXISTS xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    related_entity_type TEXT, -- 'deal', 'property', 'customer', 'appointment'
    related_entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- NOTIFICATIONS - Bildirimler
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Workspaces
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);

-- Workspace Members
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Payment History
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_workspace ON payment_history(workspace_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_workspace ON profiles(workspace_id);

-- Properties  
CREATE INDEX IF NOT EXISTS idx_properties_workspace ON properties(workspace_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_workspace ON customers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_workspace ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_property ON deals(property_id);
CREATE INDEX IF NOT EXISTS idx_deals_customer ON deals(customer_id);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_workspace ON appointments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_appointments_assigned ON appointments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Commission Transactions
CREATE INDEX IF NOT EXISTS idx_commission_workspace ON commission_transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_commission_agent ON commission_transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commission_status ON commission_transactions(status);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_self_policy ON profiles
    FOR ALL USING (id = auth.uid());

CREATE POLICY profile_workspace_read_policy ON profiles
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

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

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_workspace_policy ON subscriptions
    FOR ALL USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        ) OR user_id = auth.uid()
    );

-- Payment History
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY payment_workspace_policy ON payment_history
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        ) OR user_id = auth.uid()
    );

-- Properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY property_workspace_policy ON properties
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_workspace_policy ON customers
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY deal_workspace_policy ON deals
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointment_workspace_policy ON appointments
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- Commission Transactions
ALTER TABLE commission_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY commission_workspace_policy ON commission_transactions
    FOR ALL USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- User Badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY badge_self_policy ON user_badges
    FOR ALL USING (user_id = auth.uid());

-- XP History
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY xp_self_policy ON xp_history
    FOR ALL USING (user_id = auth.uid());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notification_self_policy ON notifications
    FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_updated_at BEFORE UPDATE ON commission_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- YENI KULLANICI KAYIT TRIGGER'I
-- =============================================================================

-- Yeni kullanıcı için profil ve workspace oluşturma
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_workspace_id UUID;
BEGIN
    -- Profil oluştur
    INSERT INTO profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'danisman')
    );
    
    -- Solo workspace oluştur
    INSERT INTO workspaces (name, slug, plan_type, owner_id)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Workspace'),
        NEW.id::text,
        'solo',
        NEW.id
    )
    RETURNING id INTO new_workspace_id;
    
    -- Kullanıcıyı workspace'e ekle
    INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
    VALUES (new_workspace_id, NEW.id, 'danisman', NOW());
    
    -- Profili güncelle
    UPDATE profiles SET workspace_id = new_workspace_id WHERE id = NEW.id;
    
    -- 14 günlük deneme aboneliği oluştur
    INSERT INTO subscriptions (
        workspace_id, user_id, plan_type, status,
        base_price, total_price, billing_cycle,
        current_period_start, current_period_end, trial_end
    )
    VALUES (
        new_workspace_id, NEW.id, 'solo', 'active',
        199, 199, 'monthly',
        NOW(), NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- INVITE LINK FUNCTION
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

-- =============================================================================
-- XP EKLEME FONKSİYONU
-- =============================================================================

CREATE OR REPLACE FUNCTION add_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    new_xp INTEGER;
BEGIN
    -- XP'yi profil'e ekle
    UPDATE profiles 
    SET xp = xp + p_amount 
    WHERE id = p_user_id
    RETURNING xp INTO new_xp;
    
    -- XP geçmişine kaydet
    INSERT INTO xp_history (user_id, amount, reason, related_entity_type, related_entity_id)
    VALUES (p_user_id, p_amount, p_reason, p_entity_type, p_entity_id);
    
    RETURN new_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
