"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    Phone,
    MessageCircle,
    Calendar,
    FileText,
    ChevronDown,
    ChevronUp,
    X,
    AlertTriangle,
    User,
    Mail,
    MapPin,
    DollarSign,
    Clock,
    Target,
    TrendingUp,
    Star,
    Edit,
    Eye,
    Home,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { getCustomers, Customer } from "@/lib/services/customers";
import {
    CUSTOMER_TYPES,
    CUSTOMER_STATUSES,
    LEAD_SOURCES,
    getLeadScoreColor,
    getLeadScoreLabel,
    isContactOverdue,
    getDaysSinceContact,
    formatBudget,
} from "@/types/customer";

// Durum rengi
function getStatusColor(status: string) {
    switch (status) {
        case "yeni": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case "iletisimde": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "aktif": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "donusmus": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
        case "pasif": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        default: return "bg-gray-100 text-gray-700";
    }
}

// Müşteri listesi sayfası
export default function CustomersPage() {
    const { user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // State
    const [activeTab, setActiveTab] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [slideOverOpen, setSlideOverOpen] = useState(false);

    // Filtreler
    const [filters, setFilters] = useState({
        status: [] as string[],
        leadScore: "" as "" | "hot" | "warm" | "cold",
        leadSource: "",
        budgetMin: "",
        budgetMax: "",
        region: "",
    });

    // Veritabanından müşterileri çek
    useEffect(() => {
        async function fetchCustomers() {
            if (!user?.id) return;

            setLoading(true);
            try {
                const data = await getCustomers(user.id);
                setCustomers(data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, [user?.id]);

    // Filtrelenmiş müşteriler
    const filteredCustomers = useMemo(() => {
        let result = [...customers];

        // Tab filtresi
        if (activeTab !== "all") {
            result = result.filter((c) => c.customer_type === activeTab);
        }

        // Arama
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.full_name.toLowerCase().includes(query) ||
                    c.phone.includes(query) ||
                    (c.email || "").toLowerCase().includes(query)
            );
        }

        // Durum filtresi
        if (filters.status.length > 0) {
            result = result.filter((c) => filters.status.includes(c.status));
        }

        // Lead skor filtresi
        if (filters.leadScore) {
            result = result.filter((c) => {
                if (filters.leadScore === "hot") return c.lead_score >= 70;
                if (filters.leadScore === "warm") return c.lead_score >= 40 && c.lead_score < 70;
                if (filters.leadScore === "cold") return c.lead_score < 40;
                return true;
            });
        }

        // Kaynak filtresi
        if (filters.leadSource && filters.leadSource !== "all") {
            result = result.filter((c) => c.lead_source === filters.leadSource);
        }

        // Bölge filtresi
        if (filters.region) {
            result = result.filter((c) =>
                c.preferred_regions.some(r => r.toLowerCase().includes(filters.region.toLowerCase()))
            );
        }

        // Sıralama: Skor'a göre
        result.sort((a, b) => b.lead_score - a.lead_score);

        return result;
    }, [customers, activeTab, searchQuery, filters]);

    // Checkbox toggle
    const toggleStatusFilter = (status: string) => {
        const current = filters.status;
        if (current.includes(status)) {
            setFilters({ ...filters, status: current.filter((s) => s !== status) });
        } else {
            setFilters({ ...filters, status: [...current, status] });
        }
    };

    // Filtreleri temizle
    const clearFilters = () => {
        setFilters({
            status: [],
            leadScore: "",
            leadSource: "",
            budgetMin: "",
            budgetMax: "",
            region: "",
        });
        setSearchQuery("");
    };

    // Müşteri detay açma
    const openCustomerDetail = (customer: Customer) => {
        setSelectedCustomer(customer);
        setSlideOverOpen(true);
    };

    // İstatistikler
    const stats = {
        total: customers.length,
        hot: customers.filter((c) => c.lead_score >= 70).length,
        warm: customers.filter((c) => c.lead_score >= 40 && c.lead_score < 70).length,
        cold: customers.filter((c) => c.lead_score < 40).length,
        overdue: customers.filter((c) => c.last_contact_date && isContactOverdue(c.last_contact_date)).length,
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Başlık ve Aksiyonlar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Müşteriler</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredCustomers.length} müşteri listeleniyor
                    </p>
                </div>
                <Link href="/dashboard/customers/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Müşteri
                    </Button>
                </Link>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <p className="text-sm text-green-600">Sıcak (70+)</p>
                        <p className="text-2xl font-bold text-green-600">{stats.hot}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <p className="text-sm text-yellow-600">Ilık (40-69)</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.warm}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                        <p className="text-sm text-red-600">Soğuk (0-39)</p>
                        <p className="text-2xl font-bold text-red-600">{stats.cold}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4">
                        <p className="text-sm text-orange-600">İletişim Bekliyor</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.overdue}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tab'lar */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">Tümü</TabsTrigger>
                        <TabsTrigger value="alici">Alıcılar</TabsTrigger>
                        <TabsTrigger value="satici">Satıcılar</TabsTrigger>
                        <TabsTrigger value="kiraci">Kiracılar</TabsTrigger>
                        <TabsTrigger value="yatirimci">Yatırımcılar</TabsTrigger>
                    </TabsList>

                    {/* Arama ve Filtre */}
                    <div className="flex gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="İsim, telefon, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setFilterOpen(!filterOpen)}
                            className={cn(filterOpen && "bg-blue-50 border-blue-200 dark:bg-blue-900/20")}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrele
                            {filterOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>

                {/* Filtre Paneli */}
                <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
                    <CollapsibleContent>
                        <Card className="mt-4">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Durum */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Durum</Label>
                                        <div className="space-y-2">
                                            {Object.entries(CUSTOMER_STATUSES).map(([key, label]) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`status-${key}`}
                                                        checked={filters.status.includes(key)}
                                                        onCheckedChange={() => toggleStatusFilter(key)}
                                                    />
                                                    <Label htmlFor={`status-${key}`} className="text-sm font-normal cursor-pointer">
                                                        {label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lead Skoru */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Lead Skoru</Label>
                                        <Select
                                            value={filters.leadScore}
                                            onValueChange={(v) => setFilters({ ...filters, leadScore: v as typeof filters.leadScore })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tümü" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tümü</SelectItem>
                                                <SelectItem value="hot">🔥 Sıcak (70+)</SelectItem>
                                                <SelectItem value="warm">☀️ Ilık (40-69)</SelectItem>
                                                <SelectItem value="cold">❄️ Soğuk (0-39)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Kaynak */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Kaynak</Label>
                                        <Select
                                            value={filters.leadSource}
                                            onValueChange={(v) => setFilters({ ...filters, leadSource: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tümü" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tümü</SelectItem>
                                                {Object.entries(LEAD_SOURCES).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Bölge */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Tercih Edilen Bölge</Label>
                                        <Input
                                            placeholder="Bölge ara..."
                                            value={filters.region}
                                            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Filtre Aksiyonları */}
                                <div className="mt-6 flex justify-end gap-2">
                                    <Button variant="outline" onClick={clearFilters}>
                                        Temizle
                                    </Button>
                                    <Button onClick={() => setFilterOpen(false)}>
                                        Uygula
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>

                {/* Tablo */}
                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Müşteri
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tip
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Bütçe
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Bölge
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Skor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Son İletişim
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Durum
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Aksiyonlar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredCustomers.map((customer) => {
                                        const overdue = customer.last_contact_date ? isContactOverdue(customer.last_contact_date) : false;
                                        const daysSince = customer.last_contact_date ? getDaysSinceContact(customer.last_contact_date) : null;

                                        return (
                                            <tr
                                                key={customer.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                                onClick={() => openCustomerDetail(customer)}
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                                                {customer.full_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-sm">{customer.full_name}</p>
                                                            <p className="text-xs text-gray-500">{customer.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="outline">
                                                        {CUSTOMER_TYPES[customer.customer_type]}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm">{formatBudget(customer.budget_min ?? 0, customer.budget_max ?? 0)}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm">{customer.preferred_regions.slice(0, 2).join(", ")}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge className={cn("text-xs", getLeadScoreColor(customer.lead_score))}>
                                                        {customer.lead_score} - {getLeadScoreLabel(customer.lead_score)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1">
                                                        {overdue && (
                                                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                        )}
                                                        <span className={cn("text-sm", overdue && "text-orange-500 font-medium")}>
                                                            {daysSince === null ? "-" : daysSince === 0 ? "Bugün" : `${daysSince} gün önce`}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge className={getStatusColor(customer.status)}>
                                                        {CUSTOMER_STATUSES[customer.status]}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ara">
                                                            <Phone className="w-4 h-4 text-green-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="WhatsApp">
                                                            <MessageCircle className="w-4 h-4 text-green-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Gösterim Planla">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Not Ekle">
                                                            <FileText className="w-4 h-4 text-gray-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Boş durum */}
                        {filteredCustomers.length === 0 && (
                            <div className="p-12 text-center">
                                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium mb-2">Müşteri Bulunamadı</h3>
                                <p className="text-gray-500 mb-4">
                                    Arama kriterlerinize uygun müşteri bulunamadı.
                                </p>
                                <Button variant="outline" onClick={clearFilters}>
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Slide-over Detay Panel */}
            {slideOverOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setSlideOverOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-semibold">Müşteri Detayı</h2>
                            <Button variant="ghost" size="icon" onClick={() => setSlideOverOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Profil */}
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                        {selectedCustomer.full_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedCustomer.full_name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline">{CUSTOMER_TYPES[selectedCustomer.customer_type]}</Badge>
                                        <Badge className={getStatusColor(selectedCustomer.status)}>
                                            {CUSTOMER_STATUSES[selectedCustomer.status]}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Skor */}
                            <Card className={cn(
                                "border-2",
                                selectedCustomer.lead_score >= 70 && "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20",
                                selectedCustomer.lead_score >= 40 && selectedCustomer.lead_score < 70 && "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20",
                                selectedCustomer.lead_score < 40 && "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                            )}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Lead Skoru</p>
                                        <p className="text-3xl font-bold">{selectedCustomer.lead_score}</p>
                                    </div>
                                    <Badge className={cn("text-lg px-4 py-2", getLeadScoreColor(selectedCustomer.lead_score))}>
                                        {getLeadScoreLabel(selectedCustomer.lead_score)}
                                    </Badge>
                                </CardContent>
                            </Card>

                            {/* Hızlı Aksiyonlar */}
                            <div className="grid grid-cols-4 gap-2">
                                <Button variant="outline" className="flex-col h-auto py-3">
                                    <Phone className="w-5 h-5 mb-1 text-green-600" />
                                    <span className="text-xs">Ara</span>
                                </Button>
                                <Button variant="outline" className="flex-col h-auto py-3">
                                    <MessageCircle className="w-5 h-5 mb-1 text-green-500" />
                                    <span className="text-xs">WhatsApp</span>
                                </Button>
                                <Button variant="outline" className="flex-col h-auto py-3">
                                    <Calendar className="w-5 h-5 mb-1 text-blue-600" />
                                    <span className="text-xs">Gösterim</span>
                                </Button>
                                <Button variant="outline" className="flex-col h-auto py-3">
                                    <Edit className="w-5 h-5 mb-1 text-gray-600" />
                                    <span className="text-xs">Düzenle</span>
                                </Button>
                            </div>

                            {/* İletişim Bilgileri */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">İletişim Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{selectedCustomer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Target className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{selectedCustomer.lead_source ? LEAD_SOURCES[selectedCustomer.lead_source as keyof typeof LEAD_SOURCES] || selectedCustomer.lead_source : "-"}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tercihler */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Tercihler</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{formatBudget(selectedCustomer.budget_min ?? 0, selectedCustomer.budget_max ?? 0)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{selectedCustomer.preferred_regions.join(", ")}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Home className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{selectedCustomer.preferred_room_counts.join(", ")}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* İstatistikler */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">İstatistikler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold">{selectedCustomer.total_showings}</p>
                                            <p className="text-xs text-gray-500">Gösterim</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{selectedCustomer.total_offers}</p>
                                            <p className="text-xs text-gray-500">Teklif</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{selectedCustomer.last_contact_date ? getDaysSinceContact(selectedCustomer.last_contact_date) : "-"}</p>
                                            <p className="text-xs text-gray-500">Gün Önce</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notlar */}
                            {selectedCustomer.notes && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Notlar</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Eşleşen Mülkler */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <span>Eşleşen Mülkler</span>
                                        <Badge>3</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Mülkleri Görüntüle
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
