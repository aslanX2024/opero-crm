"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/context/auth-context";
import { WorkspaceProvider } from "@/context/workspace-context";

// Ana providers bileşeni
// Tüm uygulamayı saran context'leri içerir
export function Providers({ children }: { children: React.ReactNode }) {
    // QueryClient'ı state içinde tutarak her renderda yeniden oluşmasını önle
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Sayfa odağı değiştiğinde otomatik yeniden fetch yapma
                        refetchOnWindowFocus: false,
                        // Hata durumunda 1 kere tekrar dene
                        retry: 1,
                        // 5 dakika boyunca cache'te tut
                        staleTime: 5 * 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {/* Auth context - kullanıcı oturumu ve yetkilendirme */}
            <AuthProvider>
                {/* Workspace context - multi-tenant workspace yönetimi */}
                <WorkspaceProvider>{children}</WorkspaceProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

