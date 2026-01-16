"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    Award,
    MapPin,
    Calendar,
    Package,
    AlertTriangle,
    ExternalLink,
    Play,
    Pause,
    Globe,
    Megaphone,
    FileText,
    ArrowRight,
    Plus,
    Eye,
    MousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DEMO_CHANNELS,
    DEMO_SIGNBOARDS,
    DEMO_BROCHURES,
    DEMO_CAMPAIGNS,
    DEMO_WEEKLY_TRENDS,
    CHANNEL_TYPE_COLORS,
    CAMPAIGN_STATUSES,
    calculateCPL,
    calculateConversionRate,
    calculateCTR,
    MarketingChannel,
} from "@/types/marketing";

export default function MarketingDashboard() {
    // Artık demo veri kullanmıyoruz - boş başlangıç
    const [channels] = useState<MarketingChannel[]>([]);
    const [signboards] = useState<any[]>([]);
    const [brochures] = useState<any[]>([]);
    const [campaigns] = useState<any[]>([]);
    const [trends] = useState<any[]>([]);

    // Toplam metrikler
    const totalLeads = useMemo(() => channels.reduce((sum, c) => sum + c.leads_count, 0), [channels]);
    const totalCost = useMemo(() => channels.reduce((sum, c) => sum + c.cost, 0), [channels]);
    const totalConversions = useMemo(() => channels.reduce((sum, c) => sum + c.conversions, 0), [channels]);
    const averageCPL = channels.length > 0 ? calculateCPL(totalCost, totalLeads) : 0;
    const conversionRate = channels.length > 0 ? calculateConversionRate(totalLeads, totalConversions) : 0;

    // En iyi kanal
    const bestChannel = useMemo(() => {
        if (channels.length === 0) return null;
        return [...channels].sort((a, b) => b.conversions - a.conversions)[0];
    }, [channels]);

    // Düşük stok broşürler
    const lowStockBrochures = brochures.filter((b) => b.quantity <= b.min_quantity);

    // Aktif kampanyalar
    const activeCampaigns = campaigns.filter((c) => c.status === "aktif");

    // En yüksek lead sayısı (chart scale için)
    const maxLeads = channels.length > 0 ? Math.max(...channels.map((c) => c.leads_count)) : 0;

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Pazarlama Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Tüm pazarlama kanallarının performansı
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/marketing/leads">
                        <Button variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            Leadler
                        </Button>
                    </Link>
                    <Link href="/dashboard/marketing/portals">
                        <Button variant="outline">
                            <Globe className="w-4 h-4 mr-2" />
                            Portal Yönetimi
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Üst Metrikler */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Toplam Lead (Bu Ay)</p>
                                <p className="text-3xl font-bold text-blue-600">{totalLeads}</p>
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
                                <p className="text-sm text-gray-500">Lead Başı Maliyet</p>
                                <p className="text-3xl font-bold text-green-600">{averageCPL} ₺</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Dönüşüm Oranı</p>
                                <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">En İyi Kanal</p>
                                <p className="text-xl font-bold text-yellow-600">{bestChannel?.name || "-"}</p>
                                <p className="text-xs text-gray-500">{bestChannel?.conversions || 0} dönüşüm</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Grafikler - İki Sütun */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kanal Performans Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Kanal Performansı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {channels.map((channel) => {
                                const typeInfo = CHANNEL_TYPE_COLORS[channel.type];
                                const percentage = (channel.leads_count / maxLeads) * 100;

                                return (
                                    <div key={channel.id} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-3 h-3 rounded-full", typeInfo.bgColor)} />
                                                <span className="font-medium">{channel.name}</span>
                                                <Badge variant="secondary" className="text-xs">{typeInfo.label}</Badge>
                                            </div>
                                            <span className="font-bold">{channel.leads_count}</span>
                                        </div>
                                        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: channel.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Renk açıklaması */}
                        <div className="flex gap-4 mt-4 pt-4 border-t text-xs">
                            {Object.entries(CHANNEL_TYPE_COLORS).map(([key, { label, bgColor }]) => (
                                <div key={key} className="flex items-center gap-1">
                                    <div className={cn("w-2 h-2 rounded-full", bgColor)} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Lead Kaynağı Pasta Grafiği */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Lead Kaynağı Dağılımı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center">
                            {/* Basit pasta grafik simulasyonu */}
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {(() => {
                                        let currentAngle = 0;
                                        return channels.map((channel) => {
                                            const percentage = (channel.leads_count / totalLeads) * 100;
                                            const angle = (percentage / 100) * 360;
                                            const startAngle = currentAngle;
                                            currentAngle += angle;

                                            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                                            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                                            const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                                            const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                                            const largeArc = angle > 180 ? 1 : 0;

                                            return (
                                                <path
                                                    key={channel.id}
                                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                    fill={channel.color}
                                                    className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                                />
                                            );
                                        });
                                    })()}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{totalLeads}</p>
                                        <p className="text-xs text-gray-500">Toplam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {channels.map((channel) => {
                                const percentage = Math.round((channel.leads_count / totalLeads) * 100);
                                return (
                                    <div key={channel.id} className="flex items-center gap-2 text-sm">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: channel.color }}
                                        />
                                        <span>{channel.name}</span>
                                        <span className="text-gray-500 ml-auto">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trend Grafiği */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Son 12 Hafta Lead Trendi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48 flex items-end gap-2">
                        {trends.map((week, index) => {
                            const maxTrendLeads = Math.max(...trends.map((t) => t.leads));
                            const height = (week.leads / maxTrendLeads) * 100;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-md transition-all hover:from-blue-600 hover:to-indigo-600 cursor-pointer relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {week.leads} lead, {week.conversions} dönüşüm
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">H{week.week}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Alt Bölüm - Üç Sütun */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fiziksel Pazarlama - Tabelalar */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Aktif Tabelalar
                            </span>
                            <Badge variant="secondary">{signboards.filter((s) => s.status === "aktif").length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {signboards
                                .filter((s) => s.status === "aktif")
                                .map((sign) => (
                                    <div key={sign.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <Link
                                            href={`/dashboard/portfolio/${sign.property_id}`}
                                            className="font-medium text-sm hover:text-blue-600 line-clamp-1"
                                        >
                                            {sign.property_title}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1">{sign.location}</p>
                                        <div className="flex items-center justify-between mt-2 text-xs">
                                            <span className="text-gray-400">{sign.responsible}</span>
                                            <Badge variant="secondary">{sign.leads_count} lead</Badge>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Broşür Stok Durumu */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Broşür Stoku
                            </span>
                            {lowStockBrochures.length > 0 && (
                                <Badge className="bg-red-100 text-red-700">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {lowStockBrochures.length} düşük
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {brochures.map((brochure) => {
                                const isLow = brochure.quantity <= brochure.min_quantity;
                                const percentage = Math.min((brochure.quantity / (brochure.min_quantity * 3)) * 100, 100);

                                return (
                                    <div key={brochure.id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className={cn(isLow && "text-red-600 font-medium")}>{brochure.name}</span>
                                            <span className={cn("font-medium", isLow && "text-red-600")}>{brochure.quantity}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    isLow ? "bg-red-500" : "bg-green-500"
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Sipariş Ver
                        </Button>
                    </CardContent>
                </Card>

                {/* Dijital Kampanya Özeti */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Megaphone className="w-4 h-4" />
                                Aktif Kampanyalar
                            </span>
                            <Badge variant="secondary">{activeCampaigns.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activeCampaigns.map((campaign) => {
                                const spentPercentage = (campaign.spent / campaign.budget) * 100;
                                const ctr = calculateCTR(campaign.clicks, campaign.impressions);

                                return (
                                    <div key={campaign.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm line-clamp-1">{campaign.name}</span>
                                            <Badge className={cn(
                                                campaign.platform === "google" && "bg-red-100 text-red-700",
                                                campaign.platform === "meta" && "bg-blue-100 text-blue-700",
                                                campaign.platform === "portal" && "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {campaign.platform === "google" ? "Google" : campaign.platform === "meta" ? "Meta" : "Portal"}
                                            </Badge>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${spentPercentage}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                            <div>
                                                <p className="font-bold">{(campaign.impressions / 1000).toFixed(0)}K</p>
                                                <p className="text-gray-500">Gösterim</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">{ctr}%</p>
                                                <p className="text-gray-500">CTR</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">{campaign.leads}</p>
                                                <p className="text-gray-500">Lead</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
