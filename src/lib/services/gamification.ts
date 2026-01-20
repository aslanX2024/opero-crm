import { supabase } from "@/lib/supabase";

export interface DailyTask {
    id: string;
    user_id: string;
    task_date: string;
    task_type: string;
    target_count: number;
    current_count: number;
    completed: boolean;
    xp_reward: number;
}

export async function getDailyTasks(userId: string): Promise<DailyTask[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', today);

    if (error) {
        console.error("Error fetching daily tasks:", error);
        return [];
    }

    return data || [];
}

export async function updateTaskProgress(taskId: string, increment: number = 1) {
    // 1. Mevcut görevi çek
    const { data: task, error: fetchError } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

    if (fetchError || !task) return null;

    // 2. Yeni değerleri hesapla
    const newCount = Math.min(task.current_count + increment, task.target_count);
    const isCompleted = newCount >= task.target_count;

    // 3. Güncelle
    const { data, error } = await supabase
        .from('daily_tasks')
        .update({
            current_count: newCount,
            completed: isCompleted
        })
        .eq('id', taskId)
        .select()
        .single();

    if (error) {
        console.error("Error updating task:", error);
        return null;
    }

    return data as DailyTask;
}

export async function initializeDailyTasks(userId: string) {
    // Demo amaçlı: Günlük görevleri oluştur (normalde bir cron job yapmalı)
    const today = new Date().toISOString().split('T')[0];

    const tasks = [
        { task_type: 'call', target_count: 5, xp_reward: 50 },
        { task_type: 'meeting', target_count: 2, xp_reward: 100 },
        { task_type: 'update_crm', target_count: 3, xp_reward: 30 }
    ];

    for (const t of tasks) {
        await supabase
            .from('daily_tasks')
            .upsert({
                user_id: userId,
                task_date: today,
                ...t
            }, { onConflict: 'user_id, task_date, task_type' });
    }
}
