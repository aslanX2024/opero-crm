"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Building2,
    UserCheck,
    TrendingUp,
    Search,
    ChevronRight,
    Phone,
    Mail,
    MoreVertical,
    ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBrokerConsultants, ConsultantDetail } from "@/services/broker-consultant-service";
import { useAuth } from "@/context/auth-context";

// XP'den seviye çıkar
function getLevel(xp: number): string {
    if (xp >= 10000) return "Master";
    if (xp >= 5000) return "Uzman";
    if (xp >= 2000) return "Danışman";
    return "Çaylak";
}

// Para formatla
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ConsultantsPage() {
    const { user } = useAuth();
    const [consultants, setConsultants] = useState<ConsultantDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "sales" | "properties">("sales");

    useEffect(() => {
        async function loadConsultants() {
            if (!user) return;
            setLoading(true);
            const data = await getBrokerConsultants(user.id);
            setConsultants(data);
            setLoading(false);
        }
        loadConsultants();
    }, [user]);

    // Filtreleme ve sıralama
    const filteredConsultants = consultants
        .filter((c) =>
            c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return (a.full_name || "").localeCompare(b.full_name || "");
                case "sales":
                    return (b.totalSales || 0) - (a.totalSales || 0);
                case "properties":
                    return (b.propertyCount || 0) - (a.propertyCount || 0);
                default:
                    return 0;
            }
        });

    // Toplam istatistikler
    const totalStats = {
        consultants: consultants.length,
        properties: consultants.reduce((sum, c) => sum + (c.propertyCount || 0), 0),
        customers: consultants.reduce((sum, c) => sum + (c.customerCount || 0), 0),
        sales: consultants.reduce((sum, c) => sum + (c.totalSales || 0), 0),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-600" />
                        Danışman Yönetimi
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Ofisinizdeki danışmanları yönetin ve performanslarını takip edin
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/broker">
                        ← Dashboard'a Dön
                    </Link>
                </Button>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.consultants}</p>
                                <p className="text-sm text-gray-500">Toplam Danışman</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.properties}</p>
                                <p className="text-sm text-gray-500">Toplam İlan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <UserCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.customers}</p>
                                <p className="text-sm text-gray-500">Toplam Müşteri</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(totalStats.sales)}</p>
                                <p className="text-sm text-gray-500">Toplam Satış</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtreleme */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle>Danışman Listesi</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Danışman ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 w-64"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpDown className="w-4 h-4 mr-2" />
                                        Sırala
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSortBy("sales")}>
                                        Satışa Göre
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("properties")}>
                                        İlan Sayısına Göre
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                                        İsme Göre
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredConsultants.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Henüz danışman bulunmuyor</p>
                            <p className="text-sm mt-2">
                                Danışman davet linki ile yeni danışmanlar ekleyebilirsiniz
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredConsultants.map((consultant) => (
                                <div
                                    key={consultant.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={consultant.avatar_url} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {consultant.full_name?.slice(0, 2).toUpperCase() || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{consultant.full_name || "İsimsiz"}</p>
                                            <p className="text-sm text-gray-500">{consultant.email}</p>
                                        </div>
                                        <Badge variant="outline" className="ml-2">
                                            {getLevel(consultant.xp || 0)}
                                        </Badge>
                                    </div>

                                    <div className="hidden md:flex items-center gap-8 text-sm">
                                        <div className="text-center">
                                            <p className="font-semibold">{consultant.propertyCount}</p>
                                            <p className="text-gray-500">İlan</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{consultant.customerCount}</p>
                                            <p className="text-gray-500">Müşteri</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{formatCurrency(consultant.totalSales || 0)}</p>
                                            <p className="text-gray-500">Satış</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={`mailto:${consultant.email}`}>
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </Button>
                                        {consultant.phone && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`tel:${consultant.phone}`}>
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Link href={`/dashboard/broker/consultants/${consultant.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
