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

// Aktivite akışı
export interface ActivityItem {
    id: string;
    type: "property_added" | "customer_added" | "deal_updated" | "appointment_completed";
    title: string;
    description: string;
    timestamp: string;
}
