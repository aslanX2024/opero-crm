-- =============================================================================
-- ACIL DÜZELTME: Workspace RLS ve Profile workspace_id
-- Supabase Dashboard → SQL Editor'de çalıştırın
-- =============================================================================

-- 1. Workspaces tablosu için RLS politikaları
-- Önce mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view their workspace" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can update" ON workspaces;
DROP POLICY IF EXISTS "workspace_read_policy" ON workspaces;

-- Herkes kendi workspace'ini görebilir (owner veya member)
CREATE POLICY "workspace_read_policy" ON workspaces
    FOR SELECT USING (
        owner_id = auth.uid() OR
        id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    );

-- Owner güncelleyebilir
CREATE POLICY "workspace_update_policy" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());

-- 2. Profillerdeki workspace_id'yi güncelle
-- Her kullanıcının kendi workspace'ini profile'a bağla
UPDATE profiles p
SET workspace_id = w.id
FROM workspaces w
WHERE w.owner_id = p.id
AND p.workspace_id IS NULL;

-- 3. Kontrol et - bu sorgu workspace'leri göstermeli
-- SELECT * FROM workspaces WHERE owner_id = auth.uid();
