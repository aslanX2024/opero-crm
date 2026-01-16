import { supabase } from "@/lib/supabase";

// Workspace tipi
export interface Workspace {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    plan_type: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Workspace bilgilerini getir
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
    const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();

    if (error) {
        console.error("Workspace getirme hatası:", error);
        return null;
    }

    return data as Workspace;
}

/**
 * Kullanıcının workspace'ini getir
 */
export async function getUserWorkspace(userId: string): Promise<Workspace | null> {
    // Önce kullanıcının profilinden workspace_id'yi al
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", userId)
        .single();

    if (profileError || !profile?.workspace_id) {
        console.error("Kullanıcı profili veya workspace bulunamadı:", profileError);
        return null;
    }

    return getWorkspace(profile.workspace_id);
}

/**
 * Logo yükle - Supabase Storage'a
 */
export async function uploadWorkspaceLogo(
    workspaceId: string,
    file: File
): Promise<string | null> {
    // Dosya adı oluştur
    const fileExt = file.name.split(".").pop();
    const fileName = `${workspaceId}/logo.${fileExt}`;

    // Önce varsa eski logoyu sil
    await supabase.storage.from("workspace-logos").remove([fileName]);

    // Yeni logoyu yükle
    const { data, error } = await supabase.storage
        .from("workspace-logos")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error("Logo yükleme hatası:", error);
        return null;
    }

    // Public URL al
    const { data: urlData } = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

/**
 * Workspace güncelle
 */
export async function updateWorkspace(
    workspaceId: string,
    updates: Partial<Pick<Workspace, "name" | "logo_url">>
): Promise<Workspace | null> {
    const { data, error } = await supabase
        .from("workspaces")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", workspaceId)
        .select()
        .single();

    if (error) {
        console.error("Workspace güncelleme hatası:", error);
        return null;
    }

    return data as Workspace;
}

/**
 * Logo sil
 */
export async function deleteWorkspaceLogo(workspaceId: string): Promise<boolean> {
    // Storage'dan sil
    const { error: storageError } = await supabase.storage
        .from("workspace-logos")
        .remove([`${workspaceId}/logo.png`, `${workspaceId}/logo.jpg`, `${workspaceId}/logo.webp`]);

    if (storageError) {
        console.error("Logo silme hatası:", storageError);
    }

    // Veritabanından logo_url'i temizle
    const { error: dbError } = await supabase
        .from("workspaces")
        .update({ logo_url: null, updated_at: new Date().toISOString() })
        .eq("id", workspaceId);

    if (dbError) {
        console.error("Workspace güncelleme hatası:", dbError);
        return false;
    }

    return true;
}
