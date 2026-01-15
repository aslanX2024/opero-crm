// Broker Consultant Service - Danışman yönetimi için servis fonksiyonları
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase";

// Danışman detaylı bilgisi
export interface ConsultantDetail extends UserProfile {
    propertyCount?: number;
    customerCount?: number;
    dealCount?: number;
    totalSales?: number;
}

// Broker'ın danışmanlarını getir
export async function getBrokerConsultants(brokerId: string): Promise<ConsultantDetail[]> {
    try {
        // Önce broker'ın workspace'ini bul veya direkt danisman rolündeki kullanıcıları getir
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "danisman")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Danışman listesi hatası:", error);
            return [];
        }

        // Her danışman için istatistikleri hesapla
        const consultantsWithStats = await Promise.all(
            (data || []).map(async (consultant) => {
                // Property sayısı
                const { count: propertyCount } = await supabase
                    .from("properties")
                    .select("*", { count: "exact", head: true })
                    .eq("created_by", consultant.id);

                // Customer sayısı
                const { count: customerCount } = await supabase
                    .from("customers")
                    .select("*", { count: "exact", head: true })
                    .eq("assigned_to", consultant.id);

                // Deal sayısı ve toplam satış
                const { data: deals } = await supabase
                    .from("deals")
                    .select("value, stage")
                    .eq("assigned_to", consultant.id);

                const closedDeals = deals?.filter(d => d.stage === "closed_won") || [];
                const totalSales = closedDeals.reduce((sum, d) => sum + (d.value || 0), 0);

                return {
                    ...consultant,
                    propertyCount: propertyCount || 0,
                    customerCount: customerCount || 0,
                    dealCount: deals?.length || 0,
                    totalSales,
                };
            })
        );

        return consultantsWithStats;
    } catch (error) {
        console.error("Danışman servisi hatası:", error);
        return [];
    }
}

// Tek danışman detayı
export async function getConsultantById(consultantId: string): Promise<ConsultantDetail | null> {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", consultantId)
            .single();

        if (error || !data) {
            console.error("Danışman bulunamadı:", error);
            return null;
        }

        // İstatistikleri hesapla
        const { count: propertyCount } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("created_by", consultantId);

        const { count: customerCount } = await supabase
            .from("customers")
            .select("*", { count: "exact", head: true })
            .eq("assigned_to", consultantId);

        const { data: deals } = await supabase
            .from("deals")
            .select("value, stage")
            .eq("assigned_to", consultantId);

        const closedDeals = deals?.filter(d => d.stage === "closed_won") || [];
        const totalSales = closedDeals.reduce((sum, d) => sum + (d.value || 0), 0);

        return {
            ...data,
            propertyCount: propertyCount || 0,
            customerCount: customerCount || 0,
            dealCount: deals?.length || 0,
            totalSales,
        };
    } catch (error) {
        console.error("Danışman detay hatası:", error);
        return null;
    }
}
