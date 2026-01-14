import { supabase } from "@/lib/supabase";
import { STAGE_ORDER, type PipelineStage } from "@/types/pipeline";

// Types
export type DealStage =
    | "yeni_lead"
    | "iletisim_kuruldu"
    | "kalifikasyon"
    | "gosterim_planlandi"
    | "gosterim_yapildi"
    | "teklif"
    | "muzakere"
    | "sozlesme"
    | "kapanis"
    | "tamamlandi";

export interface Deal {
    id: string;
    workspace_id: string | null;
    assigned_to: string;
    property_id: string | null;
    customer_id: string | null;
    title: string;
    stage: DealStage;
    priority: "low" | "normal" | "high" | "urgent";
    expected_value: number | null;
    probability: number;
    stage_entered_at: string;
    last_activity_at: string;
    next_action: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateDealInput {
    title: string;
    property_id?: string;
    customer_id?: string;
    expected_value?: number;
    priority?: "low" | "normal" | "high" | "urgent";
    next_action?: string;
    notes?: string;
}

// Service Functions
export async function getDeals(userId: string) {
    const { data, error } = await supabase
        .from("deals")
        .select(`
            *,
            property:properties(id, title, price, city, district),
            customer:customers(id, full_name, phone)
        `)
        .eq("assigned_to", userId)
        .order("last_activity_at", { ascending: false });

    if (error) {
        console.error("Error fetching deals:", error);
        return [];
    }

    return data as (Deal & { property: any; customer: any })[];
}

export async function getDealById(id: string) {
    const { data, error } = await supabase
        .from("deals")
        .select(`
            *,
            property:properties(*),
            customer:customers(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching deal:", error);
        return null;
    }

    return data as Deal & { property: any; customer: any };
}

export async function createDeal(userId: string, input: CreateDealInput) {
    const { data, error } = await supabase
        .from("deals")
        .insert({
            ...input,
            assigned_to: userId,
            stage: "yeni_lead",
            probability: 10,
            stage_entered_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating deal:", error);
        throw error;
    }

    return data as Deal;
}

export async function updateDealStage(id: string, stage: DealStage) {
    // Probability mapping based on stage
    const probabilityMap: Record<DealStage, number> = {
        yeni_lead: 10,
        iletisim_kuruldu: 20,
        kalifikasyon: 30,
        gosterim_planlandi: 40,
        gosterim_yapildi: 50,
        teklif: 60,
        muzakere: 70,
        sozlesme: 85,
        kapanis: 95,
        tamamlandi: 100,
    };

    const { data, error } = await supabase
        .from("deals")
        .update({
            stage,
            probability: probabilityMap[stage],
            stage_entered_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating deal stage:", error);
        throw error;
    }

    return data as Deal;
}

export async function updateDeal(id: string, input: Partial<CreateDealInput>) {
    const { data, error } = await supabase
        .from("deals")
        .update({
            ...input,
            last_activity_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating deal:", error);
        throw error;
    }

    return data as Deal;
}

export async function deleteDeal(id: string) {
    const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting deal:", error);
        throw error;
    }

    return true;
}

export async function getDealStats(userId: string) {
    const { data, error } = await supabase
        .from("deals")
        .select("id, stage, expected_value, probability")
        .eq("assigned_to", userId);

    if (error) {
        console.error("Error fetching deal stats:", error);
        return {
            total: 0,
            active: 0,
            completed: 0,
            totalValue: 0,
            weightedValue: 0,
        };
    }

    const deals = data || [];
    // Aktif aşamalar: tamamlandi hariç tüm aşamalar (merkezi STAGE_ORDER kullanılıyor)
    const activeStages = STAGE_ORDER.filter(s => s !== "tamamlandi");

    return {
        total: deals.length,
        active: deals.filter((d) => activeStages.includes(d.stage)).length,
        completed: deals.filter((d) => d.stage === "tamamlandi").length,
        totalValue: deals.reduce((sum, d) => sum + (d.expected_value || 0), 0),
        weightedValue: deals.reduce((sum, d) => sum + ((d.expected_value || 0) * (d.probability / 100)), 0),
    };
}

// Pipeline özeti için aşamalara göre gruplandırılmış fırsatlar
export interface PipelineStageCount {
    name: string;
    stage: DealStage;
    count: number;
    color: string;
}

const stageLabels: Record<DealStage, { name: string; color: string }> = {
    yeni_lead: { name: "Yeni Lead", color: "#60a5fa" },
    iletisim_kuruldu: { name: "İletişim", color: "#34d399" },
    kalifikasyon: { name: "Kalifikasyon", color: "#a78bfa" },
    gosterim_planlandi: { name: "Gösterim Planlandı", color: "#fbbf24" },
    gosterim_yapildi: { name: "Gösterim Yapıldı", color: "#fb923c" },
    teklif: { name: "Teklif", color: "#f97316" },
    muzakere: { name: "Müzakere", color: "#ef4444" },
    sozlesme: { name: "Sözleşme", color: "#8b5cf6" },
    kapanis: { name: "Kapanış", color: "#a855f7" },
    tamamlandi: { name: "Tamamlandı", color: "#22c55e" },
};

export async function getDealsByStage(userId: string): Promise<PipelineStageCount[]> {
    const { data, error } = await supabase
        .from("deals")
        .select("stage")
        .eq("assigned_to", userId);

    if (error) {
        console.error("Error fetching deals by stage:", error);
        return [];
    }

    const deals = data || [];
    const stageCounts: Record<string, number> = {};

    deals.forEach((deal) => {
        stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
    });

    // Aktif aşamalar: tamamlandi hariç (merkezi STAGE_ORDER kullanılıyor)
    const activeStages = STAGE_ORDER.filter(s => s !== "tamamlandi");

    return activeStages
        .filter((stage) => stageCounts[stage] > 0)
        .map((stage) => ({
            name: stageLabels[stage].name,
            stage,
            count: stageCounts[stage],
            color: stageLabels[stage].color,
        }));
}
