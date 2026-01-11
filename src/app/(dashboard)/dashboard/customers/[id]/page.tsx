"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Phone,
    Mail,
    MessageCircle,
    Calendar,
    Edit,
    MapPin,
    DollarSign,
    Home,
    User,
    Target,
    Clock,
    TrendingUp,
    FileText,
    Star,
    Check,
    X,
    Eye,
    Send,
    Sparkles,
    Building2,
    Info,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    Customer,
    DEMO_CUSTOMERS,
    CUSTOMER_TYPES,
    CUSTOMER_STATUSES,
    LEAD_SOURCES,
    getLeadScoreColor,
    getLeadScoreLabel,
    isContactOverdue,
    getDaysSinceContact,
    formatBudget,
} from "@/types/customer";
import { DEMO_PROPERTIES, formatPrice } from "@/types/property";
import {
    findMatchingProperties,
    getMatchScoreColor,
    getMatchScoreLabel,
    MatchResult,
} from "@/lib/matching";

// Durum rengi
function getStatusColor(status: Customer["status"]) {
    switch (status) {
        case "yeni": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case "iletisimde": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "aktif": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "donusmus": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
        case "pasif": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        default: return "bg-gray-100 text-gray-700";
    }
}

// Müşteri detay sayfası
export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <CustomerDetailContent id={id} />;
}

// Client component
function CustomerDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const [showAllMatches, setShowAllMatches] = useState(false);
    const [newNote, setNewNote] = useState("");

    // Demo müşteri verisi
    const customer = DEMO_CUSTOMERS.find((c) => c.id === id) || DEMO_CUSTOMERS[0];

    // Eşleşen mülkler
    const matches = useMemo(() => {
        return findMatchingProperties(customer, DEMO_PROPERTIES);
    }, [customer]);

    // Gösterilecek eşleşmeler
    const displayedMatches = showAllMatches ? matches : matches.slice(0, 3);
    const goodMatches = matches.filter(m => m.matchScore >= 60);

    // Yetki süresi
    const overdue = isContactOverdue(customer.last_contact_date);
    const daysSince = getDaysSinceContact(customer.last_contact_date);

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Üst Bar */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Müşterilere Dön
                    </Button>
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(customer.status)}>
                            {CUSTOMER_STATUSES[customer.status]}
                        </Badge>
                        <Badge variant="outline">
                            {CUSTOMER_TYPES[customer.customer_type]}
                        </Badge>
                    </div>
                </div>

                {/* Ana İçerik */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profil Kartı */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                            {customer.full_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold">{customer.full_name}</h1>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                <span>{customer.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                <span>{customer.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Badge className={cn("text-base px-4 py-1", getLeadScoreColor(customer.lead_score))}>
                                                {customer.lead_score} - {getLeadScoreLabel(customer.lead_score)}
                                            </Badge>
                                            <Badge variant="outline">
                                                {LEAD_SOURCES[customer.lead_source]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Hızlı Aksiyonlar */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6 pt-6 border-t">
                                    <Button variant="outline" className="flex-col h-auto py-3">
                                        <Phone className="w-5 h-5 mb-1 text-green-600" />
                                        <span className="text-xs">Ara</span>
                                    </Button>
                                    <Button variant="outline" className="flex-col h-auto py-3">
                                        <MessageCircle className="w-5 h-5 mb-1 text-green-500" />
                                        <span className="text-xs">WhatsApp</span>
                                    </Button>
                                    <Button variant="outline" className="flex-col h-auto py-3">
                                        <Mail className="w-5 h-5 mb-1 text-blue-600" />
                                        <span className="text-xs">E-posta</span>
                                    </Button>
                                    <Link href={`/dashboard/customers/${id}/edit`} className="contents">
                                        <Button variant="outline" className="flex-col h-auto py-3">
                                            <Edit className="w-5 h-5 mb-1 text-gray-600" />
                                            <span className="text-xs">Düzenle</span>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Eşleşen Mülkler */}
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Eşleşen Mülkler
                                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            {goodMatches.length} iyi eşleşme
                                        </Badge>
                                    </CardTitle>
                                    <Badge variant="outline" className="gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        +20 XP / eşleşme
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {displayedMatches.length > 0 ? (
                                    <>
                                        {displayedMatches.map((match) => (
                                            <MatchCard key={match.property.id} match={match} />
                                        ))}

                                        {matches.length > 3 && (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => setShowAllMatches(!showAllMatches)}
                                            >
                                                {showAllMatches ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4 mr-2" />
                                                        Daha Az Göster
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4 mr-2" />
                                                        Tümünü Göster ({matches.length} mülk)
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-500">Kriterlere uygun mülk bulunamadı</p>
                                        <Link href="/dashboard/portfolio">
                                            <Button variant="outline" className="mt-4">
                                                Portföyü İncele
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Aktivite ve Notlar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Aktivite
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Son iletişim uyarısı */}
                                {overdue && (
                                    <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm text-orange-700 dark:text-orange-400">
                                            Son iletişimden {daysSince} gün geçti. İletişime geçmeniz önerilir.
                                        </span>
                                    </div>
                                )}

                                {/* Aktivite listesi */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                            <Eye className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Gösterim yapıldı</p>
                                            <p className="text-xs text-gray-500">Kadıköy 3+1 Daire • 2 gün önce</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <Phone className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Telefon görüşmesi</p>
                                            <p className="text-xs text-gray-500">5 dakika • {daysSince} gün önce</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Not ekleme */}
                                <div className="pt-4 border-t">
                                    <div className="flex gap-2">
                                        <textarea
                                            placeholder="Not ekle..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            className="flex-1 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <Button size="sm" className="mt-2">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Not Ekle
                                    </Button>
                                </div>

                                {/* Mevcut notlar */}
                                {customer.notes && (
                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm">{customer.notes}</p>
                                        <p className="text-xs text-gray-500 mt-1">Demo Kullanıcı • 1 hafta önce</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sağ Panel */}
                    <div className="space-y-6">
                        {/* İstatistikler */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    İstatistikler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-2xl font-bold">{customer.total_showings}</p>
                                        <p className="text-xs text-gray-500">Gösterim</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-2xl font-bold">{customer.total_offers}</p>
                                        <p className="text-xs text-gray-500">Teklif</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-2xl font-bold">{goodMatches.length}</p>
                                        <p className="text-xs text-gray-500">Eşleşme</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-2xl font-bold">{daysSince}</p>
                                        <p className="text-xs text-gray-500">Gün Önce</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tercihler */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Tercihler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Bütçe</p>
                                        <p className="text-sm text-gray-500">{formatBudget(customer.budget_min, customer.budget_max)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Bölgeler</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {customer.preferred_regions.map((region) => (
                                                <Badge key={region} variant="outline" className="text-xs">
                                                    {region}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Oda Sayısı</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {customer.preferred_room_counts.map((room) => (
                                                <Badge key={room} variant="outline" className="text-xs">
                                                    {room}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* XP Bilgisi */}
                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="font-semibold">XP Kazanımları</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Müşteri ekleme</span>
                                        <span className="text-green-600">+30 XP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>İlk iletişim</span>
                                        <span className="text-green-600">+10 XP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Eşleşme bulma</span>
                                        <span className="text-green-600">+20 XP</span>
                                    </div>
                                    <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                                        <span>Toplam</span>
                                        <span className="text-purple-600">60 XP</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hızlı Gösterim Planla */}
                        <Card>
                            <CardContent className="p-4">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Gösterim Planla
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

// Eşleşme kartı
function MatchCard({ match }: { match: MatchResult }) {
    const { property, matchScore, matchDetails } = match;

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Mülk görseli */}
                <div className="w-24 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-gray-400" />
                </div>

                {/* Mülk bilgileri */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Link href={`/dashboard/portfolio/${property.id}`} className="font-medium text-sm hover:text-blue-600 line-clamp-1">
                                {property.title}
                            </Link>
                            <p className="text-xs text-gray-500">{property.district}, {property.city}</p>
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge className={cn("text-sm", getMatchScoreColor(matchScore))}>
                                    %{matchScore}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="w-64">
                                <div className="space-y-2">
                                    <p className="font-semibold">{getMatchScoreLabel(matchScore)}</p>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                {matchDetails.budget.matched ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-500" />
                                                )}
                                                Bütçe
                                            </span>
                                            <span className="text-gray-500">{matchDetails.budget.details}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                {matchDetails.region.matched ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-500" />
                                                )}
                                                Bölge
                                            </span>
                                            <span className="text-gray-500">{matchDetails.region.details}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                {matchDetails.propertyType.matched ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-500" />
                                                )}
                                                Tip
                                            </span>
                                            <span className="text-gray-500">{matchDetails.propertyType.details}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                {matchDetails.roomCount.matched ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-500" />
                                                )}
                                                Oda
                                            </span>
                                            <span className="text-gray-500">{matchDetails.roomCount.details}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                {matchDetails.features.matched ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-500" />
                                                )}
                                                Özellikler
                                            </span>
                                            <span className="text-gray-500">{matchDetails.features.details}</span>
                                        </div>
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <p className="text-blue-600 font-bold text-sm mt-1">
                        {formatPrice(property.price, property.currency)}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{property.gross_area} m²</span>
                        <span>•</span>
                        <span>{property.room_count}</span>
                    </div>
                </div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Gösterim Planla
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                    <Send className="w-3 h-3 mr-1" />
                    Müşteriye Gönder
                </Button>
            </div>
        </div>
    );
}
