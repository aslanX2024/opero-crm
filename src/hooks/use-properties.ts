"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    Property,
    CreatePropertyInput,
} from "@/lib/services/properties";

// Query keys
export const propertyKeys = {
    all: ["properties"] as const,
    lists: () => [...propertyKeys.all, "list"] as const,
    list: (filters: Record<string, unknown>) => [...propertyKeys.lists(), filters] as const,
    details: () => [...propertyKeys.all, "detail"] as const,
    detail: (id: string) => [...propertyKeys.details(), id] as const,
};

/**
 * Tüm mülkleri getir
 */
export function useProperties(userId?: string) {
    return useQuery({
        queryKey: propertyKeys.list({ userId }),
        queryFn: async () => {
            if (!userId) return [];
            return getProperties(userId);
        },
        staleTime: 1000 * 60 * 5, // 5 dakika
        enabled: !!userId, // userId yoksa sorgu yapma
    });
}

/**
 * Tek mülk getir
 */
export function useProperty(id: string) {
    return useQuery({
        queryKey: propertyKeys.detail(id),
        queryFn: () => getPropertyById(id),
        enabled: !!id, // id varsa çalıştır
    });
}

/**
 * Mülk oluştur
 */
export function useCreateProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, input }: { userId: string; input: CreatePropertyInput }) =>
            createProperty(userId, input),
        onSuccess: () => {
            // Cache'i invalidate et
            queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
        },
    });
}

/**
 * Mülk güncelle
 */
export function useUpdateProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateProperty(id, data as any),
        onSuccess: (_, { id }) => {
            // Hem liste hem de detay cache'ini invalidate et
            queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
            queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
        },
    });
}

/**
 * Mülk sil
 */
export function useDeleteProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProperty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
        },
    });
}
