import { supabase } from "@/lib/supabase";

export interface TeamMember {
    id: string;
    full_name: string;
    email: string;
    role: "broker" | "agent" | "admin";
    avatar_url?: string;
    phone?: string;
    status: "active" | "invited";
}

export async function getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
    // Gerçek uygulamada workspace_id'ye göre filtreleme yapılmalı
    // Şimdilik profil tablosundan çekiyoruz
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        // .eq("workspace_id", workspaceId) // Workspace ID eklendiğinde açılmalı

    if (error) {
        console.error("Error fetching team:", error);
        return [];
    }

    return (data || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        role: p.role,
        avatar_url: p.avatar_url,
        phone: p.phone,
        status: "active"
    }));
}
