import { supabase } from "@/lib/supabase";

// Types
export interface Property {
    id: string;
    workspace_id: string | null;
    created_by: string;
    title: string;
    listing_type: "satilik" | "kiralik";
    property_type: "daire" | "villa" | "arsa" | "isyeri" | "mustakil" | "residence";
    status: "aktif" | "satildi" | "kiralandi" | "pasif";
    price: number;
    currency: "TRY" | "USD" | "EUR";
    commission_rate: number;
    city: string;
    district: string;
    neighborhood: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    gross_area: number | null;
    net_area: number | null;
    room_count: string | null;
    floor: number | null;
    total_floors: number | null;
    building_age: number | null;
    heating_type: string | null;
    has_elevator: boolean;
    has_parking: boolean;
    has_balcony: boolean;
    is_in_complex: boolean;
    is_furnished: boolean;
    is_credit_eligible: boolean;
    is_exchange_eligible: boolean;
    images: string[];
    main_image_index: number;
    video_url: string | null;
    owner_name: string | null;
    owner_phone: string | null;
    authorization_start: string | null;
    authorization_end: string | null;
    owner_notes: string | null;
    description: string | null;
    views: number;
    created_at: string;
    updated_at: string;
}

export interface CreatePropertyInput {
    title: string;
    listing_type: "satilik" | "kiralik";
    property_type: "daire" | "villa" | "arsa" | "isyeri" | "mustakil" | "residence";
    price: number;
    currency?: "TRY" | "USD" | "EUR";
    commission_rate?: number;
    city: string;
    district: string;
    neighborhood?: string;
    address?: string;
    gross_area?: number;
    net_area?: number;
    room_count?: string;
    floor?: number;
    total_floors?: number;
    building_age?: number;
    heating_type?: string;
    has_elevator?: boolean;
    has_parking?: boolean;
    has_balcony?: boolean;
    is_in_complex?: boolean;
    is_furnished?: boolean;
    is_credit_eligible?: boolean;
    is_exchange_eligible?: boolean;
    images?: string[];
    owner_name?: string;
    owner_phone?: string;
    authorization_start?: string;
    authorization_end?: string;
    owner_notes?: string;
    description?: string;
}

// Service Functions
export async function getProperties(userId: string) {
    const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching properties:", error);
        return [];
    }

    return data as Property[];
}

export async function getPropertyById(id: string) {
    const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching property:", error);
        return null;
    }

    return data as Property;
}

export async function createProperty(userId: string, input: CreatePropertyInput) {
    const { data, error } = await supabase
        .from("properties")
        .insert({
            ...input,
            created_by: userId,
            status: "aktif",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating property:", error);
        throw error;
    }

    return data as Property;
}

export async function updateProperty(id: string, input: Partial<CreatePropertyInput>) {
    const { data, error } = await supabase
        .from("properties")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating property:", error);
        throw error;
    }

    return data as Property;
}

export async function deleteProperty(id: string) {
    const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting property:", error);
        throw error;
    }

    return true;
}

export async function getPropertyStats(userId: string) {
    const { data, error } = await supabase
        .from("properties")
        .select("id, status, listing_type, price")
        .eq("created_by", userId);

    if (error) {
        console.error("Error fetching property stats:", error);
        return {
            total: 0,
            active: 0,
            sold: 0,
            rented: 0,
            totalValue: 0,
        };
    }

    const properties = data || [];
    return {
        total: properties.length,
        active: properties.filter((p) => p.status === "aktif").length,
        sold: properties.filter((p) => p.status === "satildi").length,
        rented: properties.filter((p) => p.status === "kiralandi").length,
        totalValue: properties.reduce((sum, p) => sum + (p.price || 0), 0),
    };
}
