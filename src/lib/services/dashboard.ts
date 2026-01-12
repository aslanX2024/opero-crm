import { supabase } from "@/lib/supabase";
import { getPropertyStats } from "./properties";
import { getCustomerStats } from "./customers";
import { getDealStats } from "./deals";
import { getAppointmentStats, getTodayAppointments } from "./appointments";

// Dashboard özet verileri
export interface DashboardStats {
    properties: {
        total: number;
        active: number;
        sold: number;
        rented: number;
        totalValue: number;
    };
    customers: {
        total: number;
        new: number;
        active: number;
        converted: number;
    };
    deals: {
        total: number;
        active: number;
        completed: number;
        totalValue: number;
        weightedValue: number;
    };
    appointments: {
        total: number;
        today: number;
        thisWeek: number;
        completed: number;
        cancelled: number;
    };
}

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

// Dashboard görevleri (tasks)
export interface DashboardTask {
    id: string;
    title: string;
    type: "follow_up" | "showing" | "offer" | "general";
    priority: "low" | "normal" | "high" | "urgent";
    due_date: string | null;
    completed: boolean;
    related_customer_id: string | null;
    related_property_id: string | null;
    related_deal_id: string | null;
}

export async function getDashboardTasks(userId: string): Promise<DashboardTask[]> {
    // Bugünkü randevulardan görevler
    const todayAppointments = await getTodayAppointments(userId);

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

    // Takip edilmesi gereken müşteriler
    const { data: followUps } = await supabase
        .from("customers")
        .select("id, full_name, next_follow_up")
        .eq("assigned_to", userId)
        .lte("next_follow_up", new Date().toISOString().split("T")[0])
        .not("next_follow_up", "is", null)
        .limit(10);

    const followUpTasks: DashboardTask[] = (followUps || []).map((customer) => ({
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
}

// Aktivite akışı
export interface ActivityItem {
    id: string;
    type: "property_added" | "customer_added" | "deal_updated" | "appointment_completed";
    title: string;
    description: string;
    timestamp: string;
}

export async function getRecentActivity(userId: string, limit: number = 10): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];

    // Son eklenen mülkler
    const { data: recentProperties } = await supabase
        .from("properties")
        .select("id, title, created_at")
        .eq("created_by", userId)
        .order("created_at", { ascending: false })
        .limit(3);

    (recentProperties || []).forEach((p) => {
        activities.push({
            id: `prop-${p.id}`,
            type: "property_added",
            title: "Yeni mülk eklendi",
            description: p.title,
            timestamp: p.created_at,
        });
    });

    // Son eklenen müşteriler
    const { data: recentCustomers } = await supabase
        .from("customers")
        .select("id, full_name, created_at")
        .eq("assigned_to", userId)
        .order("created_at", { ascending: false })
        .limit(3);

    (recentCustomers || []).forEach((c) => {
        activities.push({
            id: `cust-${c.id}`,
            type: "customer_added",
            title: "Yeni müşteri eklendi",
            description: c.full_name,
            timestamp: c.created_at,
        });
    });

    // Son güncellenen fırsatlar
    const { data: recentDeals } = await supabase
        .from("deals")
        .select("id, title, stage, updated_at")
        .eq("assigned_to", userId)
        .order("updated_at", { ascending: false })
        .limit(3);

    (recentDeals || []).forEach((d) => {
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
}
