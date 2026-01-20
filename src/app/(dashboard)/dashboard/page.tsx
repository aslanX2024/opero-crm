"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
    Building2,
    Users,
    TrendingUp,
    Star,
    Clock,
    Home,
    Calendar,
    FileText,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DailyTasksCard } from "@/components/gamification/daily-tasks";
import { useDashboardStats, useRecentActivity } from "@/hooks/use-dashboard";
import { getDealsByStage, type PipelineStageCount } from "@/lib/services/deals";
import { calculateLevel } from "@/lib/gamification";
import { formatTimeAgo } from "@/lib/formatters";
import type { ActivityItem } from "@/types/dashboard";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useQuery } from "@tanstack/react-query";

// Pipeline Chart - Dinamik Import (Type Safe Wrapper)
const PipelineChart = dynamic(
    () => import("@/components/dashboard/pipeline-chart"),
    {
        ssr: false,
        loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    }
);

// Aktivite ikonu
function getActivityIcon(type: ActivityItem["type"]) {
    switch (type) {
        case "property_added": return <Home className="w-4 h-4" />;
        case "customer_added": return <Users className="w-4 h-4" />;
        case "deal_updated": return <TrendingUp className="w-4 h-4" />;
        case "appointment_completed": return <Calendar className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
    }
}

// Aktivite rengi
function getActivityColor(type: ActivityItem["type"]) {
    switch (type) {
        case "property_added": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        case "customer_added": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        case "deal_updated": return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
        case "appointment_completed": return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
        default: return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
}

// Dashboard ana sayfası
export default function DashboardPage() {
    const { profile } = useAuth();
    const { checkAndStartTour } = useOnboarding();

    // TanStack Query ile veri çekme
    const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats(profile?.id || "");
    const { data: activities, isLoading: activityLoading, error: activityError } = useRecentActivity(profile?.id || "");

    // Pipeline verisi için henüz hook yok, onu da useQuery ile saralım
    const { data: pipelineData, isLoading: pipelineLoading, error: pipelineError } = useQuery({
        queryKey: ["deals", "byStage", profile?.id],
        queryFn: () => getDealsByStage(profile?.id || ""),
        enabled: !!profile?.id,
    });

    const loading = statsLoading || activityLoading || pipelineLoading;
    const error = statsError || activityError || pipelineError;

    // Seviye bilgisi
    const levelInfo = calculateLevel(profile?.xp || 0);

    // Onboarding başlat
    useEffect(() => {
        if (!loading) {
            checkAndStartTour("dashboard");
        }
    }, [loading, checkAndStartTour]);

    // Loading durumu
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Hata durumu
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Bir hata oluştu
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">Veriler yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hoşgeldin mesajı */}
            <div id="dashboard-header" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute left-1/2 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">
                        Günaydın, {profile?.full_name?.split(" ")[0] || "Kullanıcı"} 👋
                    </h1>
                    <p className="text-blue-100">
                        {stats?.properties.active || 0} aktif portföyün ve {stats?.deals.active || 0} açık fırsatın var.
                    </p>
                </div>
            </div>

            {/* Özet Kartları */}
            <div id="stats-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Aktif Portföy */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Portföy</p>
                                <p className="text-3xl font-bold mt-1">{stats?.properties.active || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Toplam: {stats?.properties.total || 0}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Aktif Müşteri */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Müşteri</p>
                                <p className="text-3xl font-bold mt-1">{stats?.customers.active || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Toplam: {stats?.customers.total || 0}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Açık Fırsatlar */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Açık Fırsatlar</p>
                                <p className="text-3xl font-bold mt-1">{stats?.deals.active || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {stats?.deals.weightedValue
                                        ? `${(stats.deals.weightedValue / 1000000).toFixed(1)}M ₺ beklenen`
                                        : "Değer hesaplanıyor"}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* XP Puanı */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">XP Puanı</p>
                                <p className="text-3xl font-bold mt-1">{profile?.xp || 0}</p>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                                            Seviye {levelInfo.level}
                                        </span>
                                        <span className="text-gray-400">{levelInfo.nextLevelXp} XP</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                            style={{ width: `${levelInfo.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center ml-4">
                                <Star className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orta Kısım: Görevler ve Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Günlük Görevler - Streak Sistemi ile */}
                <div id="quick-actions">
                    <DailyTasksCard compact />
                </div>

                {/* Pipeline Özeti */}
                <Card id="pipeline-summary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Pipeline Özeti
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pipelineData && pipelineData.length > 0 ? (
                            <PipelineChart data={pipelineData} />
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">Henüz fırsat eklenmemiş</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        Pipeline &gt; Yeni Fırsat ekleyerek başlayın
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Son Aktiviteler */}
            <Card id="recent-activity">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Son Aktiviteler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activities && activities.length > 0 ? (
                        <div className="relative">
                            {/* Timeline çizgisi */}
                            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="relative flex items-start gap-4 pl-2">
                                        {/* İkon */}
                                        <div
                                            className={cn(
                                                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center",
                                                getActivityColor(activity.type)
                                            )}
                                        >
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        {/* İçerik */}
                                        <div className="flex-1 min-w-0 pb-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-medium text-sm">{activity.title}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                    {formatTimeAgo(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">Henüz aktivite yok</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                Mülk veya müşteri ekleyerek başlayın
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
