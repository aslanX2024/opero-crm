"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Users,
    Building2,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    Minus,
    Calendar,
    Bell,
    Target,
    BarChart3,
    Eye,
    Phone,
    MessageSquare,
    ChevronRight,
    Crown,
    Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    DEMO_AGENT_PERFORMANCES,
    DEMO_OFFICE_METRICS,
    DEMO_BROKER_ALERTS,
    DEMO_SALES_TREND,
    ALERT_SEVERITY_COLORS,
    ALERT_TYPE_LABELS,
    AgentPerformance,
} from "@/types/broker";

export default function BrokerDashboard() {
    const [agents] = useState(DEMO_AGENT_PERFORMANCES);
    const [metrics] = useState(DEMO_OFFICE_METRICS);
    const [alerts] = useState(DEMO_BROKER_ALERTS);
    const [salesTrend] = useState(DEMO_SALES_TREND);

    // En yüksek aylık satış (grafik için)
    const maxMonthlySales = Math.max(
        ...salesTrend.flatMap((m) => m.agents.map((a) => a.sales))
    );

    // Sıralanmış danışmanlar
    const sortedAgents = useMemo(() => {
        return [...agents].sort((a, b) => b.monthlySales - a.monthlySales);
    }, [agents]);

    // Trend ikonu
    const getTrendIcon = (trend: AgentPerformance["trend"]) => {
        switch (trend) {
            case "up": return <ArrowUp className="w-4 h-4 text-green-500" />;
            case "down": return <ArrowDown className="w-4 h-4 text-red-500" />;
            default: return <Minus className="w-4 h-4 text-gray-400" />;
        }
    };

    // Sıra ikonu
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <span className="text-xl">🥇</span>;
            case 2: return <span className="text-xl">🥈</span>;
            case 3: return <span className="text-xl">🥉</span>;
            default: return <span className="text-lg font-bold text-gray-400">{rank}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Crown className="w-7 h-7 text-yellow-500" />
                        Broker Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Ofis performansı ve danışman yönetimi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Toplantı Planla
                    </Button>
                    <Button variant="outline">
                        <Bell className="w-4 h-4 mr-2" />
                        Duyuru Gönder
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Target className="w-4 h-4 mr-2" />
                        Hedef Belirle
                    </Button>
                </div>
            </div>

            {/* Üst Metrikler */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Toplam Danışman</p>
                                <p className="text-3xl font-bold text-blue-600">{metrics.totalAgents}</p>
                                <p className="text-xs text-green-600">{metrics.activeAgents} aktif</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Aktif Portföy</p>
                                <p className="text-3xl font-bold text-green-600">{metrics.totalPortfolio}</p>
                                <p className="text-xs text-gray-500">{metrics.totalCustomers} müşteri</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Bu Ay Satış</p>
                                <p className="text-3xl font-bold text-orange-600">{metrics.monthlySalesCount}</p>
                                <p className="text-xs text-gray-500">{(metrics.monthlySalesAmount / 1000000).toFixed(1)}M ₺</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pipeline (Weighted)</p>
                                <p className="text-3xl font-bold text-purple-600">{(metrics.pipelineWeighted / 1000000).toFixed(0)}M</p>
                                <p className="text-xs text-gray-500">Toplam: {(metrics.pipelineValue / 1000000).toFixed(0)}M ₺</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Uyarılar */}
            {alerts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {alerts.map((alert) => (
                        <Card
                            key={alert.id}
                            className={cn("border", ALERT_SEVERITY_COLORS[alert.severity])}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{ALERT_TYPE_LABELS[alert.type].icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{alert.title}</p>
                                        {alert.agentName && (
                                            <p className="text-xs font-medium">{alert.agentName}</p>
                                        )}
                                        <p className="text-xs opacity-75 mt-1">{alert.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Danışman Performans Tablosu + Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performans Tablosu */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Danışman Performansı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Danışman</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Portföy</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Gösterim</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Satış</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">XP</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {sortedAgents.map((agent, index) => (
                                        <tr
                                            key={agent.id}
                                            className={cn(
                                                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                index < 3 && "bg-yellow-50/50 dark:bg-yellow-900/10"
                                            )}
                                        >
                                            <td className="px-3 py-3">
                                                <div className="w-8 flex justify-center">
                                                    {getRankIcon(index + 1)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="text-xs">{agent.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{agent.name}</p>
                                                        <p className="text-xs text-gray-500">{agent.level}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-center text-sm">{agent.activePortfolio}</td>
                                            <td className="px-3 py-3 text-center text-sm">{agent.activeCustomers}</td>
                                            <td className="px-3 py-3 text-center text-sm">{agent.monthlyShowings}</td>
                                            <td className="px-3 py-3 text-center">
                                                <Badge className={cn(
                                                    agent.monthlySales > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {agent.monthlySales}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-3 text-center text-sm font-medium text-purple-600">
                                                {agent.xp.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                {getTrendIcon(agent.trend)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Satış Trendi Grafiği */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Aylık Satış Trendi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {salesTrend.map((month, monthIndex) => (
                                <div key={month.month}>
                                    <p className="text-sm font-medium mb-2">{month.month}</p>
                                    <div className="space-y-1">
                                        {month.agents.map((agent, agentIndex) => (
                                            <div key={agent.name} className="flex items-center gap-2">
                                                <span className="text-xs w-16 truncate">{agent.name}</span>
                                                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all",
                                                            agentIndex === 0 && "bg-blue-500",
                                                            agentIndex === 1 && "bg-green-500",
                                                            agentIndex === 2 && "bg-orange-500"
                                                        )}
                                                        style={{ width: `${(agent.sales / maxMonthlySales) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium w-4">{agent.sales}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-4 pt-4 border-t text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-500 rounded" />
                                Ali
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded" />
                                Mehmet
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-orange-500 rounded" />
                                Demo
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hızlı Aksiyonlar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Phone className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Takım Toplantısı</p>
                                <p className="text-sm text-gray-500">Haftalık değerlendirme planla</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Motivasyon Mesajı</p>
                                <p className="text-sm text-gray-500">Tüm ekibe duyuru gönder</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Performans Raporu</p>
                                <p className="text-sm text-gray-500">Detaylı analiz görüntüle</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
