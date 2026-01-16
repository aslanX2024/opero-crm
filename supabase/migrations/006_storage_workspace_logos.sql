-- =============================================================================
-- Supabase Storage Bucket - Workspace Logoları
-- Supabase Dashboard → Storage → "workspace-logos" bucket'ını oluşturun
-- =============================================================================

-- NOT: Bu SQL komutları Supabase Dashboard'dan çalıştırılmalıdır.
-- Veya Supabase Dashboard → Storage bölümünden "workspace-logos" adlı
-- public bir bucket oluşturun.

-- Storage bucket oluştur (Dashboard'dan yapılabilir)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('workspace-logos', 'workspace-logos', true);

-- Storage RLS politikaları
-- Herkes okuyabilir (public bucket)
CREATE POLICY "Public read access for workspace logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'workspace-logos');

-- Sadece workspace owner'ları yükleyebilir
CREATE POLICY "Workspace owners can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'workspace-logos' AND
    auth.uid() IN (
        SELECT owner_id FROM workspaces 
        WHERE id::text = (storage.foldername(name))[1]
    )
);

-- Sadece workspace owner'ları silebilir
CREATE POLICY "Workspace owners can delete logos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'workspace-logos' AND
    auth.uid() IN (
        SELECT owner_id FROM workspaces 
        WHERE id::text = (storage.foldername(name))[1]
    )
);

-- Sadece workspace owner'ları güncelleyebilir
CREATE POLICY "Workspace owners can update logos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'workspace-logos' AND
    auth.uid() IN (
        SELECT owner_id FROM workspaces 
        WHERE id::text = (storage.foldername(name))[1]
    )
);

-- Workspaces tablosu için RLS politikası güncelle (logo_url güncellemesi için)
DROP POLICY IF EXISTS "Workspace owners can update" ON workspaces;

CREATE POLICY "Workspace owners can update" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());
