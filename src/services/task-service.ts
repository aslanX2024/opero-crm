import { supabase } from "@/lib/supabase";

// Task tipi
export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    related_type?: "property" | "customer" | "deal";
    related_id?: string;
    created_at: string;
    updated_at?: string;
}

// Yeni görev oluşturma için tip
export interface CreateTaskInput {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in_progress" | "completed";
    related_type?: "property" | "customer" | "deal";
    related_id?: string;
}

// Görev güncelleme için tip
export interface UpdateTaskInput extends Partial<CreateTaskInput> { }

// Tüm görevleri getir
export async function getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }

    return data || [];
}

// Bekleyen görevleri getir (Dashboard için)
export async function getPendingTasks(userId: string, limit: number = 5): Promise<Task[]> {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .neq("status", "completed")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching pending tasks:", error);
        return [];
    }

    return data || [];
}

// Bugünkü görevleri getir
export async function getTodayTasks(userId: string): Promise<Task[]> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("due_date", today)
        .order("priority", { ascending: false });

    if (error) {
        console.error("Error fetching today tasks:", error);
        return [];
    }

    return data || [];
}

// Tek görev getir
export async function getTask(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

    if (error) {
        console.error("Error fetching task:", error);
        return null;
    }

    return data;
}

// Görev oluştur
export async function createTask(userId: string, input: CreateTaskInput): Promise<Task | null> {
    const { data, error } = await supabase
        .from("tasks")
        .insert({
            user_id: userId,
            title: input.title,
            description: input.description,
            due_date: input.due_date,
            priority: input.priority || "medium",
            status: input.status || "pending",
            related_type: input.related_type,
            related_id: input.related_id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating task:", error);
        return null;
    }

    return data;
}

// Görev güncelle
export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const { data, error } = await supabase
        .from("tasks")
        .update({
            ...input,
            updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select()
        .single();

    if (error) {
        console.error("Error updating task:", error);
        return null;
    }

    return data;
}

// Görev durumunu değiştir
export async function updateTaskStatus(taskId: string, status: Task["status"]): Promise<boolean> {
    const { error } = await supabase
        .from("tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", taskId);

    if (error) {
        console.error("Error updating task status:", error);
        return false;
    }

    return true;
}

// Görev sil
export async function deleteTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
        console.error("Error deleting task:", error);
        return false;
    }

    return true;
}

// Görev istatistikleri
export async function getTaskStats(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
}> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("tasks")
        .select("status, due_date")
        .eq("user_id", userId);

    if (error || !data) {
        return { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 };
    }

    const stats = {
        total: data.length,
        pending: data.filter(t => t.status === "pending").length,
        inProgress: data.filter(t => t.status === "in_progress").length,
        completed: data.filter(t => t.status === "completed").length,
        overdue: data.filter(t =>
            t.status !== "completed" &&
            t.due_date &&
            t.due_date < today
        ).length,
    };

    return stats;
}

// Öncelik etiketleri
export const PRIORITY_LABELS: Record<Task["priority"], string> = {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek",
};

// Durum etiketleri
export const STATUS_LABELS: Record<Task["status"], string> = {
    pending: "Bekliyor",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
};

// İlişki türü etiketleri
export const RELATED_TYPE_LABELS: Record<string, string> = {
    property: "Mülk",
    customer: "Müşteri",
    deal: "Anlaşma",
};
