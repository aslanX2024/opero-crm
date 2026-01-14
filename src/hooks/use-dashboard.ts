"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getDashboardStats,
    getDashboardTasks,
    getRecentActivity,
    DashboardStats,
    DashboardTask,
} from "@/lib/services/dashboard";

// Query keys
export const dashboardKeys = {
    all: ["dashboard"] as const,
    stats: (userId: string) => [...dashboardKeys.all, "stats", userId] as const,
    tasks: (userId: string) => [...dashboardKeys.all, "tasks", userId] as const,
    activity: (userId: string) => [...dashboardKeys.all, "activity", userId] as const,
};

/**
 * Dashboard istatistikleri
 */
export function useDashboardStats(userId: string) {
    return useQuery({
        queryKey: dashboardKeys.stats(userId),
        queryFn: () => getDashboardStats(userId),
        staleTime: 1000 * 60 * 2, // 2 dakika - sık güncellenen veriler
        enabled: !!userId,
    });
}

/**
 * Dashboard görevleri
 */
export function useDashboardTasks(userId: string) {
    return useQuery({
        queryKey: dashboardKeys.tasks(userId),
        queryFn: () => getDashboardTasks(userId),
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}

/**
 * Son aktiviteler
 */
export function useRecentActivity(userId: string, limit: number = 10) {
    return useQuery({
        queryKey: [...dashboardKeys.activity(userId), limit],
        queryFn: () => getRecentActivity(userId, limit),
        staleTime: 1000 * 60 * 2,
        enabled: !!userId,
    });
}
