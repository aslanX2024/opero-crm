import { supabase } from "@/lib/supabase";

// Types
export interface Appointment {
    id: string;
    workspace_id: string | null;
    assigned_to: string;
    customer_id: string | null;
    property_id: string | null;
    deal_id: string | null;
    title: string;
    type: "gosterim" | "toplanti" | "degerleme" | "imza";
    status: "planlanmis" | "tamamlandi" | "iptal" | "noshow";
    date: string;
    start_time: string;
    end_time: string;
    location: string | null;
    notes: string | null;
    reminder_sent: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAppointmentInput {
    title: string;
    type: "gosterim" | "toplanti" | "degerleme" | "imza";
    date: string;
    start_time: string;
    end_time: string;
    customer_id?: string;
    property_id?: string;
    deal_id?: string;
    location?: string;
    notes?: string;
}

// Service Functions
export async function getAppointments(userId: string, dateRange?: { start: string; end: string }) {
    let query = supabase
        .from("appointments")
        .select(`
            *,
            customer:customers(id, full_name, phone),
            property:properties(id, title, city, district)
        `)
        .eq("assigned_to", userId)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

    if (dateRange) {
        query = query.gte("date", dateRange.start).lte("date", dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }

    return data as (Appointment & { customer: any; property: any })[];
}

export async function getAppointmentById(id: string) {
    const { data, error } = await supabase
        .from("appointments")
        .select(`
            *,
            customer:customers(*),
            property:properties(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching appointment:", error);
        return null;
    }

    return data as Appointment & { customer: any; property: any };
}

export async function createAppointment(userId: string, input: CreateAppointmentInput) {
    const { data, error } = await supabase
        .from("appointments")
        .insert({
            ...input,
            assigned_to: userId,
            status: "planlanmis",
            reminder_sent: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }

    return data as Appointment;
}

export async function updateAppointment(id: string, input: Partial<CreateAppointmentInput & { status: string }>) {
    const { data, error } = await supabase
        .from("appointments")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating appointment:", error);
        throw error;
    }

    return data as Appointment;
}

export async function updateAppointmentStatus(id: string, status: Appointment["status"]) {
    const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating appointment status:", error);
        throw error;
    }

    return data as Appointment;
}

export async function deleteAppointment(id: string) {
    const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting appointment:", error);
        throw error;
    }

    return true;
}

export async function getTodayAppointments(userId: string) {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("appointments")
        .select(`
            *,
            customer:customers(id, full_name, phone),
            property:properties(id, title, city, district)
        `)
        .eq("assigned_to", userId)
        .eq("date", today)
        .eq("status", "planlanmis")
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Error fetching today appointments:", error);
        return [];
    }

    return data as (Appointment & { customer: any; property: any })[];
}

export async function getAppointmentStats(userId: string) {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const { data, error } = await supabase
        .from("appointments")
        .select("id, status, date, type")
        .eq("assigned_to", userId);

    if (error) {
        console.error("Error fetching appointment stats:", error);
        return {
            total: 0,
            today: 0,
            thisWeek: 0,
            completed: 0,
            cancelled: 0,
        };
    }

    const appointments = data || [];
    return {
        total: appointments.length,
        today: appointments.filter((a) => a.date === today && a.status === "planlanmis").length,
        thisWeek: appointments.filter((a) => {
            const d = new Date(a.date);
            return d >= weekStart && d <= weekEnd && a.status === "planlanmis";
        }).length,
        completed: appointments.filter((a) => a.status === "tamamlandi").length,
        cancelled: appointments.filter((a) => a.status === "iptal" || a.status === "noshow").length,
    };
}
