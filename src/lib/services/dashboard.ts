import { supabase } from "@/lib/supabase";
import { getPropertyStats } from "./properties";
import { getCustomerStats } from "./customers";
import { getDealStats } from "./deals";
import { getAppointmentStats, getTodayAppointments } from "./appointments";
import type { DashboardStats, DashboardTask, ActivityItem } from "@/types/dashboard";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
    const [properties, customers, deals, appointments] = await Promise.all([
        getPropertyStats(userId),
        getCustomerStats(userId),
        getDealStats(userId),
        getAppointmentStats(userId),
    ]);

    return {
        properties,
        customers,
        deals,
        appointments,
    };
}

export async function getDashboardTasks(userId: string): Promise<DashboardTask[]> {
    try {
        // Bugünkü randevulardan görevler (paralel çalışabilir, ancak bağımlılıklar varsa sıralı kalmalı)
        // Burada randevu ve takip sorgularını paralel yapabiliriz.

        const [todayAppointments, followUpsResult] = await Promise.all([
            getTodayAppointments(userId),
            supabase
                .from("customers")
                .select("id, full_name, next_follow_up")
                .eq("assigned_to", userId)
                .lte("next_follow_up", new Date().toISOString().split("T")[0])
                .not("next_follow_up", "is", null)
                .limit(10)
        ]);

        const appointmentTasks: DashboardTask[] = todayAppointments.map((apt) => ({
            id: apt.id,
            title: apt.title,
            type: "showing" as const,
            priority: "high" as const,
            due_date: apt.date,
            completed: apt.status === "tamamlandi",
            related_customer_id: apt.customer_id,
            related_property_id: apt.property_id,
            related_deal_id: apt.deal_id,
        }));

        const followUpTasks: DashboardTask[] = (followUpsResult.data || []).map((customer) => ({
            id: `follow-${customer.id}`,
            title: `${customer.full_name} ile iletişim`,
            type: "follow_up" as const,
            priority: "normal" as const,
            due_date: customer.next_follow_up,
            completed: false,
            related_customer_id: customer.id,
            related_property_id: null,
            related_deal_id: null,
        }));

        return [...appointmentTasks, ...followUpTasks];
    } catch (error) {
        console.error("Error fetching dashboard tasks:", error);
        return [];
    }
}

export async function getRecentActivity(userId: string, limit: number = 10): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];

    try {
        // Paralel sorgular
        const [recentProperties, recentCustomers, recentDeals] = await Promise.all([
            supabase
                .from("properties")
                .select("id, title, created_at")
                .eq("created_by", userId)
                .order("created_at", { ascending: false })
                .limit(3),
            supabase
                .from("customers")
                .select("id, full_name, created_at")
                .eq("assigned_to", userId)
                .order("created_at", { ascending: false })
                .limit(3),
            supabase
                .from("deals")
                .select("id, title, stage, updated_at")
                .eq("assigned_to", userId)
                .order("updated_at", { ascending: false })
                .limit(3)
        ]);

        (recentProperties.data || []).forEach((p) => {
            activities.push({
                id: `prop-${p.id}`,
                type: "property_added",
                title: "Yeni mülk eklendi",
                description: p.title,
                timestamp: p.created_at,
            });
        });

        (recentCustomers.data || []).forEach((c) => {
            activities.push({
                id: `cust-${c.id}`,
                type: "customer_added",
                title: "Yeni müşteri eklendi",
                description: c.full_name,
                timestamp: c.created_at,
            });
        });

        (recentDeals.data || []).forEach((d) => {
            activities.push({
                id: `deal-${d.id}`,
                type: "deal_updated",
                title: "Fırsat güncellendi",
                description: `${d.title} - ${d.stage}`,
                timestamp: d.updated_at,
            });
        });

        // Sırala ve limit uygula
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        return [];
    }
}
