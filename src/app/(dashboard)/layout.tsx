"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useAppStore } from "@/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { PWAInstallPrompt, IOSInstallPrompt } from "@/components/pwa/install-prompt";

// Dashboard layout - sadece giriş yapmış kullanıcılar için
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const { sidebarCollapsed } = useAppStore();

    // Oturum kontrolü - giriş yapmamış kullanıcıyı login'e yönlendir
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Rol bazlı yönlendirme - broker farklı dashboard'a
    useEffect(() => {
        if (profile?.role === "broker") {
            router.push("/broker");
        }
    }, [profile, router]);

    // Yükleniyor durumu
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Oturum yoksa hiçbir şey gösterme (yönlendirme yapılıyor)
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar - sadece masaüstünde görünür */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Header */}
            <Header />

            {/* Ana içerik alanı */}
            <main
                className={cn(
                    "pt-16 min-h-screen transition-all duration-300",
                    // Masaüstünde sidebar genişliğine göre margin
                    sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
                )}
            >
                <div className="p-4 lg:p-6">{children}</div>
            </main>

            {/* PWA Yükleme Promptları */}
            <PWAInstallPrompt />
            <IOSInstallPrompt />
        </div>
    );
}
