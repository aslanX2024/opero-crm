"use client";

import { useState, useEffect } from "react";
import {
    Building2,
    Users,
    TrendingUp,
    Star,
    Phone,
    Eye,
    UserCheck,
    CheckCircle2,
    Clock,
    Home,
    Calendar,
    MessageSquare,
    FileText,
    Sparkles,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DailyTasksCard } from "@/components/gamification/daily-tasks";

// Seviye hesaplama fonksiyonu
function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progress: number } {
    const levels = [
        { min: 0, max: 100, level: 1, title: "Çaylak" },
        { min: 100, max: 300, level: 2, title: "Asistan" },
        { min: 300, max: 600, level: 3, title: "Danışman" },
        { min: 600, max: 1000, level: 4, title: "Kıdemli Danışman" },
        { min: 1000, max: 1500, level: 5, title: "Uzman Danışman" },
        { min: 1500, max: 2500, level: 6, title: "Baş Danışman" },
        { min: 2500, max: 4000, level: 7, title: "Takım Lideri" },
        { min: 4000, max: 6000, level: 8, title: "Bölge Müdürü" },
        { min: 6000, max: 10000, level: 9, title: "Direktör" },
        { min: 10000, max: Infinity, level: 10, title: "Efsane" },
    ];

    const currentLevel = levels.find((l) => xp >= l.min && xp < l.max) || levels[levels.length - 1];
    const progress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        nextLevelXp: currentLevel.max,
        progress: Math.min(progress, 100),
    };
}

// Pipeline verileri (demo)
const pipelineData = [
    { name: "Yeni Lead", count: 12, color: "#60a5fa" },
    { name: "İletişim", count: 8, color: "#34d399" },
    { name: "Gösterim", count: 5, color: "#fbbf24" },
    { name: "Teklif", count: 3, color: "#f97316" },
    { name: "Kapanış", count: 2, color: "#a855f7" },
];

// Günlük görevler tipi
interface DailyTask {
    id: string;
    title: string;
    description: string;
    type: "call" | "showing" | "followup";
    xpReward: number;
    completed: boolean;
}

// Demo günlük görevler
const initialTasks: DailyTask[] = [
    { id: "1", title: "Ahmet Yılmaz'ı ara", description: "Kadıköy daire hakkında", type: "call", xpReward: 10, completed: false },
    { id: "2", title: "Şişli villa gösterimi", description: "14:00 - Mehmet Bey", type: "showing", xpReward: 25, completed: false },
    { id: "3", title: "Zeynep Hanım takip", description: "Teklif durumu", type: "followup", xpReward: 15, completed: false },
    { id: "4", title: "Bakırköy müşterisi ara", description: "Yeni ilanlar hakkında", type: "call", xpReward: 10, completed: false },
    { id: "5", title: "Beşiktaş daire gösterimi", description: "16:30 - Ali Bey", type: "showing", xpReward: 25, completed: false },
];

// Aktivite tipi
interface Activity {
    id: string;
    type: "property" | "customer" | "appointment" | "sale" | "call";
    title: string;
    description: string;
    time: string;
}

// Demo aktiviteler
const recentActivities: Activity[] = [
    { id: "1", type: "property", title: "Yeni mülk eklendi", description: "Kadıköy 3+1 Daire - 2.500.000 ₺", time: "5 dk önce" },
    { id: "2", type: "customer", title: "Yeni müşteri", description: "Ayşe Yıldız - Kiralık arıyor", time: "15 dk önce" },
    { id: "3", type: "call", title: "Arama yapıldı", description: "Mehmet Demir ile görüşme", time: "1 saat önce" },
    { id: "4", type: "appointment", title: "Randevu oluşturuldu", description: "Yarın 10:00 - Şişli gösterim", time: "2 saat önce" },
    { id: "5", type: "sale", title: "Satış kapandı!", description: "Beşiktaş Villa - 15.000.000 ₺", time: "3 saat önce" },
    { id: "6", type: "property", title: "Mülk güncellendi", description: "Ataşehir 2+1 fiyat değişikliği", time: "4 saat önce" },
    { id: "7", type: "customer", title: "Müşteri notu eklendi", description: "Can Özkan - 3+1 tercih ediyor", time: "5 saat önce" },
    { id: "8", type: "call", title: "Gelen arama", description: "Yeni potansiyel müşteri", time: "6 saat önce" },
    { id: "9", type: "appointment", title: "Gösterim tamamlandı", description: "Kadıköy daire gösterimi", time: "Dün" },
    { id: "10", type: "sale", title: "Komisyon alındı", description: "Şişli ofis satışı - 45.000 ₺", time: "Dün" },
];

// Aktivite ikonu
function getActivityIcon(type: Activity["type"]) {
    switch (type) {
        case "property": return <Home className="w-4 h-4" />;
        case "customer": return <Users className="w-4 h-4" />;
        case "appointment": return <Calendar className="w-4 h-4" />;
        case "sale": return <TrendingUp className="w-4 h-4" />;
        case "call": return <Phone className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
    }
}

// Aktivite rengi
function getActivityColor(type: Activity["type"]) {
    switch (type) {
        case "property": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        case "customer": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        case "appointment": return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
        case "sale": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "call": return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
        default: return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
}

// Görev ikonu
function getTaskIcon(type: DailyTask["type"]) {
    switch (type) {
        case "call": return <Phone className="w-4 h-4" />;
        case "showing": return <Eye className="w-4 h-4" />;
        case "followup": return <UserCheck className="w-4 h-4" />;
        default: return <CheckCircle2 className="w-4 h-4" />;
    }
}

// Dashboard ana sayfası
export default function DashboardPage() {
    const { profile } = useAuth();
    const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
    const [xpAnimation, setXpAnimation] = useState<{ show: boolean; amount: number; position: { x: number; y: number } }>({
        show: false,
        amount: 0,
        position: { x: 0, y: 0 },
    });

    // Seviye bilgisi
    const levelInfo = calculateLevel(profile?.xp || 450);

    // Özet istatistikler (demo veriler)
    const stats = {
        activePortfolio: 24,
        activeCustomers: 156,
        monthlySales: { count: 8, amount: 45000000 },
    };

    // Görev tamamlama
    const handleTaskComplete = (taskId: string, checked: boolean, event: React.MouseEvent) => {
        if (checked) {
            const task = tasks.find((t) => t.id === taskId);
            if (task) {
                // XP animasyonu göster
                const rect = (event.target as HTMLElement).getBoundingClientRect();
                setXpAnimation({
                    show: true,
                    amount: task.xpReward,
                    position: { x: rect.left, y: rect.top },
                });

                // Animasyonu kapat
                setTimeout(() => {
                    setXpAnimation((prev) => ({ ...prev, show: false }));
                }, 1500);
            }
        }

        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, completed: checked } : t))
        );
    };

    // Tamamlanan görev sayısı
    const completedTasks = tasks.filter((t) => t.completed).length;

    return (
        <div className="space-y-6">
            {/* XP Animasyonu */}
            {xpAnimation.show && (
                <div
                    className="fixed z-50 pointer-events-none animate-bounce"
                    style={{
                        left: xpAnimation.position.x,
                        top: xpAnimation.position.y - 20,
                    }}
                >
                    <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        +{xpAnimation.amount} XP
                    </div>
                </div>
            )}

            {/* Hoşgeldin mesajı */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute left-1/2 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">
                        Günaydın, {profile?.full_name?.split(" ")[0] || "Kullanıcı"} 👋
                    </h1>
                    <p className="text-blue-100">
                        Bugün {tasks.length - completedTasks} görevin ve {pipelineData[0].count} yeni leadın var.
                    </p>
                </div>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Aktif Portföy */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Portföy</p>
                                <p className="text-3xl font-bold mt-1">{stats.activePortfolio}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+3 bu hafta</p>
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
                                <p className="text-3xl font-bold mt-1">{stats.activeCustomers}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12 bu ay</p>
                            </div>
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bu Ay Satış */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bu Ay Satış</p>
                                <p className="text-3xl font-bold mt-1">{stats.monthlySales.count}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {(stats.monthlySales.amount / 1000000).toFixed(1)}M ₺
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
                                <p className="text-3xl font-bold mt-1">{profile?.xp || 450}</p>
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
                <DailyTasksCard compact />

                {/* Pipeline Özeti */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Pipeline Özeti
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pipelineData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={80}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value} müşteri`, "Toplam"]}
                                        contentStyle={{
                                            backgroundColor: "var(--background)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                                        {pipelineData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Pipeline toplamı */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-sm text-gray-500">Toplam Pipeline</span>
                            <span className="text-lg font-bold">
                                {pipelineData.reduce((acc, curr) => acc + curr.count, 0)} Müşteri
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Son Aktiviteler */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Son Aktiviteler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Timeline çizgisi */}
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
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
                                            <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
