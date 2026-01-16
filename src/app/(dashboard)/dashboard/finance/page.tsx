"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Building2,
    Users,
    Calendar,
    Filter,
    Download,
    FileSpreadsheet,
    FileText,
    Bell,
    ChevronDown,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Receipt,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    DEMO_TRANSACTIONS,
    DEMO_AGENT_SUMMARIES,
    DEMO_MONTHLY_REVENUES,
    COMMISSION_STATUSES,
    COMMISSION_MODELS,
    formatCurrency,
    CommissionStatus,
} from "@/types/finance";
import { useAuth } from "@/context/auth-context";

export default function FinanceDashboard() {
    const { profile } = useAuth();
    const isBroker = profile?.role === "broker";
    const [transactions] = useState(DEMO_TRANSACTIONS);
    const [agentSummaries] = useState(DEMO_AGENT_SUMMARIES);
    const [monthlyRevenues] = useState(DEMO_MONTHLY_REVENUES);
    const [period, setPeriod] = useState("thisMonth");
    const [filterAgent, setFilterAgent] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Toplam metrikler
    const metrics = useMemo(() => {
        const total = transactions.reduce((sum, t) => sum + t.gross_commission, 0);
        const collected = transactions.reduce((sum, t) => sum + t.collected_amount, 0);
        const pending = total - collected;
        const officeProfit = transactions.reduce((sum, t) => sum + t.office_amount, 0);

        return { total, collected, pending, officeProfit };
    }, [transactions]);

    // Bekleyen ödemeler
    const pendingPayments = useMemo(() => {
        return transactions
            .filter((t) => t.status === "bekleyen" || t.status === "onaylandi")
            .sort((a, b) => new Date(a.due_date || "").getTime() - new Date(b.due_date || "").getTime());
    }, [transactions]);

    // Filtrelenmiş işlemler
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (filterAgent && t.agent_id !== filterAgent) return false;
            if (filterStatus && t.status !== filterStatus) return false;
            return true;
        });
    }, [transactions, filterAgent, filterStatus]);

    // En yüksek aylık gelir
    const maxRevenue = Math.max(...monthlyRevenues.map((r) => r.total));

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Finans Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Komisyon ve gelir takibi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Dönem" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thisMonth">Bu Ay</SelectItem>
                            <SelectItem value="lastMonth">Geçen Ay</SelectItem>
                            <SelectItem value="thisQuarter">Bu Çeyrek</SelectItem>
                            <SelectItem value="thisYear">Bu Yıl</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Excel
                    </Button>
                    <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                    </Button>
                    {isBroker && (
                        <Link href="/dashboard/broker/finance">
                            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                <Receipt className="w-4 h-4 mr-2" />
                                Ofis Giderleri
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Üst Metrikler */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Toplam Gelir</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.total)}</p>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +12% geçen aya göre
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Bekleyen Komisyon</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(metrics.pending)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {pendingPayments.length} bekleyen işlem
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Tahsil Edilen</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.collected)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {Math.round((metrics.collected / metrics.total) * 100)}% tahsilat
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Ofis Kârı</p>
                                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.officeProfit)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    %{Math.round((metrics.officeProfit / metrics.total) * 100)} ofis payı
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* İki Sütun: Danışman + Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Danışman Bazlı Tablo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Danışman Performansı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {agentSummaries.map((agent) => (
                                <div key={agent.agent_id} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{agent.agent_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{agent.agent_name}</p>
                                                <Badge className={cn(
                                                    agent.model === "elite" && "bg-purple-100 text-purple-700",
                                                    agent.model === "yuksek" && "bg-blue-100 text-blue-700",
                                                    agent.model === "standart" && "bg-green-100 text-green-700",
                                                    agent.model === "baslangic" && "bg-gray-100 text-gray-700"
                                                )}>
                                                    {COMMISSION_MODELS[agent.model].label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">{agent.sales_count} satış</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                            <p className="font-bold">{formatCurrency(agent.total_sales_volume)}</p>
                                            <p className="text-xs text-gray-500">Ciro</p>
                                        </div>
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                            <p className="font-bold text-green-600">{formatCurrency(agent.collected)}</p>
                                            <p className="text-xs text-gray-500">Tahsil</p>
                                        </div>
                                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                            <p className="font-bold text-yellow-600">{formatCurrency(agent.pending)}</p>
                                            <p className="text-xs text-gray-500">Bekleyen</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Aylık Gelir Grafiği */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Son 12 Ay Gelir
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end gap-2">
                            {monthlyRevenues.map((month, index) => {
                                const height = (month.total / maxRevenue) * 100;
                                const collectedHeight = (month.collected / month.total) * 100;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full rounded-t-md relative overflow-hidden cursor-pointer group"
                                            style={{ height: `${height}%` }}
                                        >
                                            {/* Bekleyen (üst kısım) */}
                                            <div
                                                className="absolute top-0 left-0 right-0 bg-yellow-400"
                                                style={{ height: `${100 - collectedHeight}%` }}
                                            />
                                            {/* Tahsil edilen (alt kısım) */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-green-500"
                                                style={{ height: `${collectedHeight}%` }}
                                            />
                                            {/* Tooltip */}
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                <p className="font-bold">{formatCurrency(month.total)}</p>
                                                <p className="text-green-300">Tahsil: {formatCurrency(month.collected)}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{month.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded" />
                                <span>Tahsil Edilen</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-yellow-400 rounded" />
                                <span>Bekleyen</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* İşlem Listesi */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            İşlem Listesi
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Select value={filterAgent} onValueChange={setFilterAgent}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Danışman" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tümü</SelectItem>
                                    {agentSummaries.map((a) => (
                                        <SelectItem key={a.agent_id} value={a.agent_id}>{a.agent_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Durum" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tümü</SelectItem>
                                    {Object.entries(COMMISSION_STATUSES).map(([key, { label }]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mülk</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komisyon</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danışman</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-4 text-sm">
                                            {new Date(t.date).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/dashboard/portfolio/${t.property_id}`}
                                                className="text-sm text-blue-600 hover:underline line-clamp-1"
                                            >
                                                {t.property_title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 text-sm">{t.customer_name}</td>
                                        <td className="px-4 py-4 text-sm font-medium">
                                            {t.sale_price.toLocaleString("tr-TR")} ₺
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="text-sm font-medium">{t.gross_commission.toLocaleString("tr-TR")} ₺</p>
                                                <p className="text-xs text-gray-500">%{t.commission_rate} + KDV</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className="text-xs">{t.agent_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm">{t.agent_name}</p>
                                                    {t.co_broker_name && (
                                                        <p className="text-xs text-gray-500">+ {t.co_broker_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge className={COMMISSION_STATUSES[t.status].color}>
                                                {COMMISSION_STATUSES[t.status].label}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Bekleyen Ödemeler */}
            {pendingPayments.length > 0 && (
                <Card className="border-yellow-300 dark:border-yellow-700">
                    <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
                        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertCircle className="w-5 h-5" />
                            Bekleyen Ödemeler ({pendingPayments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {pendingPayments.map((payment) => {
                                const daysUntilDue = payment.due_date
                                    ? Math.ceil((new Date(payment.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                    : null;
                                const isOverdue = daysUntilDue !== null && daysUntilDue < 0;

                                return (
                                    <div
                                        key={payment.id}
                                        className={cn(
                                            "p-3 border rounded-lg flex items-center justify-between",
                                            isOverdue && "border-red-300 bg-red-50 dark:bg-red-900/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <Link
                                                    href={`/dashboard/portfolio/${payment.property_id}`}
                                                    className="font-medium text-sm hover:text-blue-600"
                                                >
                                                    {payment.property_title}
                                                </Link>
                                                <p className="text-xs text-gray-500">{payment.customer_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(payment.gross_commission - payment.collected_amount)}</p>
                                                <p className={cn(
                                                    "text-xs",
                                                    isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                                                )}>
                                                    {payment.due_date
                                                        ? isOverdue
                                                            ? `${Math.abs(daysUntilDue!)} gün gecikmiş`
                                                            : `${daysUntilDue} gün kaldı`
                                                        : "Vade belirsiz"
                                                    }
                                                </p>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                <Bell className="w-4 h-4 mr-1" />
                                                Hatırlat
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Komisyon Modelleri Bilgi */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Komisyon Paylaşım Modelleri</CardTitle>
                        {isBroker && (
                            <Link href="/dashboard/broker/settings/commission-models">
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Modelleri Düzenle
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(COMMISSION_MODELS).map(([key, model]) => (
                            <div key={key} className="p-3 border rounded-lg text-center">
                                <p className="font-medium text-sm">{model.label}</p>
                                <p className="text-2xl font-bold text-blue-600 my-2">%{model.agentShare}</p>
                                <p className="text-xs text-gray-500">Danışman</p>
                                <p className="text-xs text-gray-400 mt-2">{model.requirement}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
