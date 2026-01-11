"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Users,
    Phone,
    MessageCircle,
    Mail,
    Clock,
    Building2,
    UserPlus,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    Filter,
    RefreshCw,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Settings,
    ArrowRight,
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
import { useAuth } from "@/context/auth-context";
import {
    Lead,
    DEMO_LEADS,
    DEMO_AGENTS,
    LEAD_STATUSES,
    LEAD_SOURCES,
    ASSIGNMENT_RULES,
    calculateSourceStats,
    LeadStatus,
    LeadSource,
    AssignmentRule,
} from "@/types/lead";

export default function LeadsPage() {
    const { profile } = useAuth();
    const isBroker = profile?.role === "broker" || profile?.role === "admin";

    const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterSource, setFilterSource] = useState<string>("");
    const [assignmentRule, setAssignmentRule] = useState<AssignmentRule>("manual");
    const [showSettings, setShowSettings] = useState(false);

    // Kaynak istatistikleri
    const sourceStats = useMemo(() => calculateSourceStats(leads), [leads]);

    // Filtrelenmiş leadler
    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            if (filterStatus && lead.status !== filterStatus) return false;
            if (filterSource && lead.source !== filterSource) return false;
            return true;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [leads, filterStatus, filterSource]);

    // Yeni (atanmamış) lead sayısı
    const newLeadsCount = leads.filter((l) => l.status === "yeni").length;

    // Lead ata
    const assignLead = (leadId: string, agentId: string) => {
        const agent = DEMO_AGENTS.find((a) => a.id === agentId);
        if (!agent) return;

        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === leadId
                    ? {
                        ...lead,
                        status: "atandi" as LeadStatus,
                        assigned_to: agentId,
                        assigned_to_name: agent.name,
                        response_time: Math.floor((Date.now() - new Date(lead.created_at).getTime()) / 60000),
                        updated_at: new Date().toISOString(),
                    }
                    : lead
            )
        );

        // Bildirim simülasyonu
        alert(`Lead "${agent.name}" danışmanına atandı! 🎉\n+15 XP kazandınız!`);
    };

    // Müşteri ve Deal oluştur
    const convertLead = (leadId: string) => {
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === leadId
                    ? { ...lead, status: "donustu" as LeadStatus, updated_at: new Date().toISOString() }
                    : lead
            )
        );

        alert("Müşteri ve Deal otomatik oluşturuldu! 🎉\n+50 XP kazandınız!");
    };

    // Otomatik senkronizasyon
    const syncLeads = async () => {
        // Simüle yeni lead çekme
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newLead: Lead = {
            id: Date.now().toString(),
            source: "sahibinden",
            customer_name: "Yeni Müşteri",
            customer_phone: "0532 " + Math.random().toString().slice(2, 11),
            property_id: "1",
            property_title: "Deniz Manzaralı Lüks Daire",
            message: "Bu ilan hala güncel mi?",
            status: "yeni",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setLeads((prev) => [newLead, ...prev]);
        alert("1 yeni lead çekildi!");
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Portal Leadleri</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Portallardan gelen müşteri talepleri
                    </p>
                </div>
                <div className="flex gap-2">
                    {isBroker && (
                        <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                            <Settings className="w-4 h-4 mr-2" />
                            Atama Kuralları
                        </Button>
                    )}
                    {isBroker && (
                        <Button onClick={syncLeads} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Senkronize Et
                        </Button>
                    )}
                </div>
            </div>

            {/* Atama Kuralları Ayarları - Sadece Broker */}
            {showSettings && isBroker && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Otomatik Atama Kuralları</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(ASSIGNMENT_RULES).map(([key, { label, description }]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "p-4 rounded-lg border-2 text-left transition-all",
                                        assignmentRule === key
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                    onClick={() => setAssignmentRule(key as AssignmentRule)}
                                >
                                    <p className="font-medium">{label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Kaynak İstatistikleri */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.entries(LEAD_SOURCES) as [LeadSource, typeof LEAD_SOURCES.sahibinden][])
                    .filter(([key]) => key !== "manual")
                    .map(([source, { label, logo, color }]) => {
                        const stats = sourceStats[source];
                        const conversionRate = stats.month > 0 ? Math.round((stats.converted / stats.month) * 100) : 0;

                        return (
                            <Card key={source}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", color)}>
                                            <span>{logo}</span>
                                        </div>
                                        <span className="font-medium text-sm">{label}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <p className="text-lg font-bold">{stats.today}</p>
                                            <p className="text-xs text-gray-500">Bugün</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold">{stats.week}</p>
                                            <p className="text-xs text-gray-500">Hafta</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold">{stats.month}</p>
                                            <p className="text-xs text-gray-500">Ay</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Dönüşüm:</span>
                                            <span className="ml-1 font-medium text-green-600">{conversionRate}%</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Yanıt:</span>
                                            <span className="ml-1 font-medium">{stats.avgResponseTime || "-"} dk</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>

            {/* Filtreler */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Tüm Durumlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(LEAD_STATUSES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Tüm Kaynaklar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(LEAD_SOURCES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {newLeadsCount > 0 && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                        {newLeadsCount} yeni lead bekliyor!
                    </Badge>
                )}
            </div>

            {/* Lead Listesi */}
            <div className="space-y-4">
                {filteredLeads.map((lead) => {
                    const sourceInfo = LEAD_SOURCES[lead.source];
                    const statusInfo = LEAD_STATUSES[lead.status];
                    const isNew = lead.status === "yeni";
                    const timeSince = getTimeSince(lead.created_at);

                    return (
                        <Card
                            key={lead.id}
                            className={cn(
                                "transition-all",
                                isNew && "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 shadow-md"
                            )}
                        >
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Sol: Lead bilgileri */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {/* Kaynak */}
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm", sourceInfo.color)}>
                                                {sourceInfo.logo}
                                            </div>

                                            {/* Müşteri adı */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{lead.customer_name}</h3>
                                                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                                                    {isNew && (
                                                        <Badge className="bg-blue-500 text-white">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Yeni
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {lead.customer_phone}
                                                    </span>
                                                    {lead.customer_email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {lead.customer_email}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {timeSince}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mülk bilgisi */}
                                        {lead.property_title && (
                                            <div className="flex items-center gap-2 mb-2 text-sm">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <Link
                                                    href={`/dashboard/portfolio/${lead.property_id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {lead.property_title}
                                                </Link>
                                            </div>
                                        )}

                                        {/* Mesaj */}
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                                            <p className="line-clamp-2">{lead.message}</p>
                                        </div>
                                    </div>

                                    {/* Sağ: Aksiyonlar */}
                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                        {lead.status === "yeni" ? (
                                            <>
                                                {/* Atama dropdown - Sadece Broker */}
                                                {isBroker ? (
                                                    <Select onValueChange={(v) => assignLead(lead.id, v)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Danışmana Ata" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {DEMO_AGENTS.map((agent) => (
                                                                <SelectItem key={agent.id} value={agent.id}>
                                                                    {agent.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600"
                                                        onClick={() => assignLead(lead.id, profile?.id || "1")}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-1" />
                                                        Sahiplen
                                                    </Button>
                                                )}
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="flex-1">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        Ara
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="flex-1">
                                                        <MessageCircle className="w-4 h-4 mr-1" />
                                                        WA
                                                    </Button>
                                                </div>
                                            </>
                                        ) : lead.status === "atandi" || lead.status === "iletisimde" ? (
                                            <>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback className="text-xs">
                                                            {lead.assigned_to_name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{lead.assigned_to_name}</span>
                                                </div>
                                                {lead.response_time && (
                                                    <p className="text-xs text-gray-500">
                                                        Yanıt süresi: {lead.response_time} dk
                                                    </p>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => convertLead(lead.id)}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Müşteri + Deal Oluştur
                                                </Button>
                                            </>
                                        ) : lead.status === "donustu" ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Dönüştürüldü</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <XCircle className="w-5 h-5" />
                                                <span className="text-sm">Kayıp</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {filteredLeads.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">Henüz lead yok</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* XP Bilgisi */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">XP Kazanımları</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">+15 XP</p>
                            <p className="text-xs text-gray-500">Lead Atama</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-green-600">+50 XP</p>
                            <p className="text-xs text-gray-500">Müşteri+Deal Oluştur</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">+10 XP</p>
                            <p className="text-xs text-gray-500">&lt;15 dk Yanıt</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Zaman farkı hesaplama
function getTimeSince(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMin < 1) return "Az önce";
    if (diffMin < 60) return `${diffMin} dk önce`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} saat önce`;
    return `${Math.floor(diffMin / 1440)} gün önce`;
}
