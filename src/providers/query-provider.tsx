"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Varsayılan query ayarları
                        staleTime: 1000 * 60 * 5, // 5 dakika fresh kalır
                        gcTime: 1000 * 60 * 30, // 30 dakika cache'de kalır (eski cacheTime)
                        refetchOnWindowFocus: false, // Tab değişiminde refetch yapma
                        retry: 1, // 1 kez retry
                    },
                    mutations: {
                        // Varsayılan mutation ayarları
                        retry: 0,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
