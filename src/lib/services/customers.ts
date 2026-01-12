import { supabase } from "@/lib/supabase";

// Types
export interface Customer {
    id: string;
    workspace_id: string | null;
    assigned_to: string | null;
    full_name: string;
    email: string | null;
    phone: string;
    customer_type: "alici" | "satici" | "kiraci" | "yatirimci";
    status: "yeni" | "iletisimde" | "aktif" | "donusmus" | "pasif";
    lead_source: string | null;
    lead_score: number;
    preferred_regions: string[];
    budget_min: number | null;
    budget_max: number | null;
    preferred_property_types: string[];
    preferred_room_counts: string[];
    last_contact_date: string | null;
    next_follow_up: string | null;
    total_showings: number;
    total_offers: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCustomerInput {
    full_name: string;
    phone: string;
    email?: string;
    customer_type: "alici" | "satici" | "kiraci" | "yatirimci";
    lead_source?: string;
    preferred_regions?: string[];
    budget_min?: number;
    budget_max?: number;
    preferred_property_types?: string[];
    preferred_room_counts?: string[];
    notes?: string;
}

// Service Functions
export async function getCustomers(userId: string) {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("assigned_to", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    return data as Customer[];
}

export async function getCustomerById(id: string) {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching customer:", error);
        return null;
    }

    return data as Customer;
}

export async function createCustomer(userId: string, input: CreateCustomerInput) {
    const { data, error } = await supabase
        .from("customers")
        .insert({
            ...input,
            assigned_to: userId,
            status: "yeni",
            lead_score: 0,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating customer:", error);
        throw error;
    }

    return data as Customer;
}

export async function updateCustomer(id: string, input: Partial<CreateCustomerInput & { status: string }>) {
    const { data, error } = await supabase
        .from("customers")
        .update({
            ...input,
            last_contact_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating customer:", error);
        throw error;
    }

    return data as Customer;
}

export async function deleteCustomer(id: string) {
    const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting customer:", error);
        throw error;
    }

    return true;
}

export async function getCustomerStats(userId: string) {
    const { data, error } = await supabase
        .from("customers")
        .select("id, status, customer_type")
        .eq("assigned_to", userId);

    if (error) {
        console.error("Error fetching customer stats:", error);
        return {
            total: 0,
            new: 0,
            active: 0,
            converted: 0,
        };
    }

    const customers = data || [];
    return {
        total: customers.length,
        new: customers.filter((c) => c.status === "yeni").length,
        active: customers.filter((c) => c.status === "aktif" || c.status === "iletisimde").length,
        converted: customers.filter((c) => c.status === "donusmus").length,
    };
}
