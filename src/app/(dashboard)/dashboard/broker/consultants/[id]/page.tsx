"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    Users,
    DollarSign,
    Calendar,
    Phone,
    Mail,
    MapPin,
    TrendingUp,
    Clock,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getConsultantById, ConsultantDetail } from "@/services/broker-consultant-service";
import { supabase } from "@/lib/supabase";

// XP'den seviye çıkar
function getLevel(xp: number): { name: string; nextLevel: number; progress: number } {
    if (xp >= 10000) return { name: "Master", nextLevel: 15000, progress: 100 };
    if (xp >= 5000) return { name: "Uzman", nextLevel: 10000, progress: ((xp - 5000) / 5000) * 100 };
    if (xp >= 2000) return { name: "Danışman", nextLevel: 5000, progress: ((xp - 2000) / 3000) * 100 };
    return { name: "Çaylak", nextLevel: 2000, progress: (xp / 2000) * 100 };
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

interface Property {
    id: string;
    title: string;
    price: number;
    status: string;
    created_at: string;
}

interface Activity {
    id: string;
    type: string;
    description: string;
    created_at: string;
}

export default function ConsultantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const consultantId = params.id as string;

    const [consultant, setConsultant] = useState<ConsultantDetail | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadConsultant() {
            setLoading(true);

            // Danışman bilgisi
            const data = await getConsultantById(consultantId);
            setConsultant(data);

            // Danışmanın ilanları
            const { data: props } = await supabase
                .from("properties")
                .select("id, title, price, status, created_at")
                .eq("created_by", consultantId)
                .order("created_at", { ascending: false })
                .limit(5);

            setProperties(props || []);
            setLoading(false);
        }

        if (consultantId) {
            loadConsultant();
        }
    }, [consultantId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!consultant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Danışman bulunamadı</p>
                <Button className="mt-4" onClick={() => router.back()}>
                    Geri Dön
                </Button>
            </div>
        );
    }

    const level = getLevel(consultant.xp || 0);

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Danışman Detayı</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Performans ve aktivite bilgileri
                    </p>
                </div>
            </div>

            {/* Profil Kartı */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={consultant.avatar_url} />
                            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {consultant.full_name?.slice(0, 2).toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold">{consultant.full_name}</h2>
                                <Badge variant="secondary">{level.name}</Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {consultant.email}
                                </span>
                                {consultant.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {consultant.phone}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Katılım: {new Date(consultant.created_at || "").toLocaleDateString("tr-TR")}
                                </span>
                            </div>

                            {/* XP Progress */}
                            <div className="max-w-md">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{consultant.xp || 0} XP</span>
                                    <span className="text-gray-500">{level.nextLevel} XP</span>
                                </div>
                                <Progress value={level.progress} className="h-2" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <a href={`mailto:${consultant.email}`}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    E-posta Gönder
                                </a>
                            </Button>
                            {consultant.phone && (
                                <Button variant="outline" asChild>
                                    <a href={`tel:${consultant.phone}`}>
                                        <Phone className="w-4 h-4 mr-2" />
                                        Ara
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{consultant.propertyCount}</p>
                                <p className="text-sm text-gray-500">Aktif İlan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{consultant.customerCount}</p>
                                <p className="text-sm text-gray-500">Müşteri</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{consultant.dealCount}</p>
                                <p className="text-sm text-gray-500">Toplam Satış</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(consultant.totalSales || 0)}</p>
                                <p className="text-sm text-gray-500">Satış Hacmi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Son İlanlar */}
            <Card>
                <CardHeader>
                    <CardTitle>Son İlanlar</CardTitle>
                </CardHeader>
                <CardContent>
                    {properties.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Henüz ilan bulunmuyor</p>
                    ) : (
                        <div className="space-y-3">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{property.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(property.created_at).toLocaleDateString("tr-TR")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(property.price)}</p>
                                        <Badge
                                            variant={property.status === "active" ? "default" : "secondary"}
                                        >
                                            {property.status === "active" ? "Aktif" : property.status}
                                        </Badge>
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
