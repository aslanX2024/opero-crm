"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Home,
    Building2,
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    ArrowRight,
    Star,
    Clock,
    CheckCircle,
    Circle,
    AlertCircle,
    Sparkles,
    LayoutGrid,
    Phone,
    Target,
    ChevronRight,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    DEMO_PROPERTIES,
    DEMO_CUSTOMERS,
    DEMO_DEALS,
    DEMO_APPOINTMENTS,
    DEMO_STATS,
    DEMO_TASKS,
} from "@/lib/demo-mode";
import { validateDemoToken, markTokenAsUsed } from "@/lib/demo-tokens";

// Pipeline aşama renkleri
const stageColors: Record<string, string> = {
    lead: "bg-gray-500",
    viewing: "bg-blue-500",
    offer: "bg-yellow-500",
    negotiation: "bg-orange-500",
    contract: "bg-purple-500",
    closed: "bg-green-500",
};

const stageLabels: Record<string, string> = {
    lead: "Lead",
    viewing: "Görüşme",
    offer: "Teklif",
    negotiation: "Müzakere",
    contract: "Sözleşme",
    closed: "Kapandı",
};

// Format para
const formatCurrency = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M ₺`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K ₺`;
    }
    return `${value.toLocaleString("tr-TR")} ₺`;
};

export default function DemoDashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [tasks, setTasks] = useState(DEMO_TASKS);
    const [tokenStatus, setTokenStatus] = useState<"loading" | "valid" | "invalid" | "expired">("loading");

    // Token doğrulama
    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            // Token yoksa demo talep sayfasına yönlendir
            router.push("/demo");
            return;
        }

        const checkToken = async () => {
            const result = await validateDemoToken(token);

            if (result.valid) {
                setTokenStatus("valid");
                // Token'ı kullanıldı olarak işaretle
                await markTokenAsUsed(token);
            } else if (result.expired) {
                setTokenStatus("expired");
            } else {
                setTokenStatus("invalid");
            }
        };

        checkToken();
    }, [searchParams, router]);

    // Task toggle
    const toggleTask = (taskId: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            )
        );
    };

    // Pipeline grupları
    const pipelineGroups = useMemo(() => {
        const groups: Record<string, typeof DEMO_DEALS> = {};
        ["lead", "viewing", "offer", "negotiation", "contract", "closed"].forEach((stage) => {
            groups[stage] = DEMO_DEALS.filter((d) => d.stage === stage);
        });
        return groups;
    }, []);

    // Loading state
    if (tokenStatus === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Demo yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Invalid or expired token
    if (tokenStatus === "invalid" || tokenStatus === "expired") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {tokenStatus === "expired" ? "Demo Süresi Dolmuş" : "Geçersiz Demo Linki"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {tokenStatus === "expired"
                            ? "Bu demo linkinin süresi dolmuş. Yeni bir demo talep edebilirsiniz."
                            : "Bu demo linki geçerli değil. Lütfen yeni bir demo talep edin."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/demo"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                        >
                            Yeni Demo Talep Et
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium"
                        >
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Demo Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-medium">
                            OPERO CRM Demo Modu - Gerçek verilerle değil, örnek verilerle çalışıyorsunuz
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:bg-white/20">
                                Giriş Yap
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-white text-blue-600 hover:bg-white/90">
                                Ücretsiz Başla
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">OPERO</span>
                            </Link>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                Demo
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                    DM
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">Demo Kullanıcı</p>
                                <p className="text-xs text-gray-500">Emlak Danışmanı</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Merhaba, Demo Kullanıcı! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        OPERO CRM'in tüm özelliklerini keşfedin. Aşağıda örnek verilerle dolu bir dashboard görüyorsunuz.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Portföy</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {DEMO_STATS.totalProperties}
                                    </p>
                                    <p className="text-xs text-blue-600/70">{DEMO_STATS.activeListings} aktif ilan</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <Home className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 dark:text-green-400">Müşteriler</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        {DEMO_STATS.totalCustomers}
                                    </p>
                                    <p className="text-xs text-green-600/70">{DEMO_STATS.hotLeads} sıcak lead</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">Pipeline</p>
                                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                        {formatCurrency(DEMO_STATS.pipelineValue)}
                                    </p>
                                    <p className="text-xs text-purple-600/70">{DEMO_STATS.totalDeals} fırsat</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">Randevular</p>
                                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                        {DEMO_STATS.todayAppointments}
                                    </p>
                                    <p className="text-xs text-orange-600/70">bugün planlandı</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Pipeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Mini Pipeline */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Satış Pipeline</CardTitle>
                                <Button variant="ghost" size="sm">
                                    Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {/* Pipeline stages mini */}
                                <div className="flex gap-2 mb-4">
                                    {Object.entries(pipelineGroups).map(([stage, deals]) => (
                                        <div key={stage} className="flex-1 text-center">
                                            <div className={cn("h-2 rounded-full mb-2", stageColors[stage])} />
                                            <p className="text-xs font-medium">{stageLabels[stage]}</p>
                                            <p className="text-lg font-bold">{deals.length}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent deals */}
                                <div className="space-y-3 mt-6">
                                    {DEMO_DEALS.slice(0, 3).map((deal) => (
                                        <div
                                            key={deal.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-2 h-10 rounded-full", stageColors[deal.stage])} />
                                                <div>
                                                    <p className="font-medium text-sm">{deal.title}</p>
                                                    <p className="text-xs text-gray-500">{deal.customer_name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-blue-600">
                                                    {formatCurrency(deal.expected_value)}
                                                </p>
                                                <Badge variant="secondary" className="text-xs">
                                                    {stageLabels[deal.stage]}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Properties */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Son Portföy</CardTitle>
                                <Button variant="ghost" size="sm">
                                    Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {DEMO_PROPERTIES.slice(0, 4).map((property) => (
                                        <div
                                            key={property.id}
                                            className="p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <Home className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <Badge
                                                    className={cn(
                                                        "text-xs",
                                                        property.status === "active" && "bg-green-100 text-green-700",
                                                        property.status === "sold" && "bg-blue-100 text-blue-700",
                                                        property.status === "rented" && "bg-purple-100 text-purple-700",
                                                        property.status === "pending" && "bg-yellow-100 text-yellow-700"
                                                    )}
                                                >
                                                    {property.status === "active" && "Aktif"}
                                                    {property.status === "sold" && "Satıldı"}
                                                    {property.status === "rented" && "Kiralandı"}
                                                    {property.status === "pending" && "Beklemede"}
                                                </Badge>
                                            </div>
                                            <h4 className="font-medium text-sm mb-1">{property.title}</h4>
                                            <p className="text-xs text-gray-500 mb-2">
                                                {property.district}, {property.city}
                                            </p>
                                            <p className="font-bold text-blue-600">
                                                {property.price >= 1000000
                                                    ? `${(property.price / 1000000).toFixed(1)}M ₺`
                                                    : `${property.price.toLocaleString("tr-TR")} ₺`}
                                            </p>
                                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                                <span>{property.bedrooms}+{property.bathrooms}</span>
                                                <span>{property.area} m²</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Tasks */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-600" />
                                    Günlük Görevler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                                task.completed
                                                    ? "bg-green-50 dark:bg-green-900/20"
                                                    : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100"
                                            )}
                                            onClick={() => toggleTask(task.id)}
                                        >
                                            {task.completed ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                            <span
                                                className={cn(
                                                    "text-sm flex-1",
                                                    task.completed && "line-through text-gray-500"
                                                )}
                                            >
                                                {task.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Progress
                                        value={(tasks.filter((t) => t.completed).length / tasks.length) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        {tasks.filter((t) => t.completed).length}/{tasks.length} tamamlandı
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appointments */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                    Bugünkü Randevular
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {DEMO_APPOINTMENTS.filter((a) => a.status === "scheduled")
                                        .slice(0, 3)
                                        .map((apt) => (
                                            <div
                                                key={apt.id}
                                                className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-sm">{apt.title}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {apt.time}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {apt.customer_name}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hot Customers */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    Sıcak Müşteriler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {DEMO_CUSTOMERS.filter((c) => c.lead_score >= 70)
                                        .slice(0, 3)
                                        .map((customer) => (
                                            <div
                                                key={customer.id}
                                                className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="text-xs bg-yellow-200 text-yellow-800">
                                                            {customer.full_name.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{customer.full_name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatCurrency(customer.budget_min)} - {formatCurrency(customer.budget_max)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-yellow-500 text-white">
                                                    {customer.lead_score}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">
                                    OPERO CRM ile Satışlarınızı Artırın!
                                </h2>
                                <p className="text-white/80">
                                    14 gün ücretsiz deneyin, kredi kartı gerekmez.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/demo">
                                    <Button variant="outline" className="text-white border-white hover:bg-white/20">
                                        Demo Talep Et
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-white text-blue-600 hover:bg-white/90">
                                        Hemen Başla <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t mt-8 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© 2026 OPERO. Tüm hakları saklıdır.</p>
                    <p className="mt-2">
                        <Link href="/gizlilik" className="hover:text-blue-600">Gizlilik</Link>
                        {" • "}
                        <Link href="/kosullar" className="hover:text-blue-600">Koşullar</Link>
                        {" • "}
                        <Link href="/kvkk" className="hover:text-blue-600">KVKK</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
