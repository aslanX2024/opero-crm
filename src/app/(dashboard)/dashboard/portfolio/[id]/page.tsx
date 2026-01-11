"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Edit,
    Share2,
    Upload,
    Users,
    Calendar,
    Eye,
    Heart,
    MapPin,
    Maximize2,
    BedDouble,
    Building2,
    Thermometer,
    Car,
    Layers,
    Clock,
    Phone,
    User,
    ChevronLeft,
    ChevronRight,
    X,
    Copy,
    Check,
    FileText,
    Home,
    TrendingUp,
    MessageSquare,
    Plus,
    ExternalLink,
    Star,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    Property,
    DEMO_PROPERTIES,
    LISTING_TYPES,
    PROPERTY_TYPES,
    PROPERTY_STATUSES,
    formatPrice,
} from "@/types/property";
import { PortalPublishModal } from "@/components/portal/portal-publish-modal";

// Durum rengi
function getStatusColor(status: Property["status"]) {
    switch (status) {
        case "aktif": return "bg-green-500 text-white";
        case "satildi": return "bg-red-500 text-white";
        case "kiralandi": return "bg-blue-500 text-white";
        case "pasif": return "bg-gray-500 text-white";
        default: return "bg-gray-500 text-white";
    }
}

// Yetki süresi hesaplama
function calculateAuthDays(endDate: string): { days: number; isExpiring: boolean; isExpired: boolean } {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return {
        days,
        isExpiring: days > 0 && days <= 30,
        isExpired: days <= 0,
    };
}

// Demo aktiviteler
const DEMO_ACTIVITIES = [
    { id: "1", type: "showing", title: "Gösterim yapıldı", description: "Ahmet Bey ile gösterim", date: "2 gün önce", icon: Eye },
    { id: "2", type: "offer", title: "Teklif alındı", description: "4.200.000 ₺ teklif", date: "5 gün önce", icon: FileText },
    { id: "3", type: "view", title: "Portal görüntüleme", description: "Sahibinden.com - 45 görüntülenme", date: "1 hafta önce", icon: TrendingUp },
    { id: "4", type: "note", title: "Not eklendi", description: "Müşteri fiyat pazarlığına açık", date: "1 hafta önce", icon: MessageSquare },
    { id: "5", type: "showing", title: "Gösterim planlandı", description: "Mehmet Bey - İptal edildi", date: "2 hafta önce", icon: Calendar },
];

// Benzer mülkler
const SIMILAR_PROPERTIES = DEMO_PROPERTIES.slice(0, 3);

// Mülk Detay Sayfası
export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <PropertyDetailContent id={id} />;
}

// Client component for interactivity
function PropertyDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showOwnerInfo, setShowOwnerInfo] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [showPortalModal, setShowPortalModal] = useState(false);

    // Demo mülk verisi
    const property = DEMO_PROPERTIES.find((p) => p.id === id) || DEMO_PROPERTIES[0];

    // Demo fotoğraflar
    const images = [
        "Salon Görünümü",
        "Yatak Odası",
        "Mutfak",
        "Banyo",
        "Balkon",
    ];

    // Yetki süresi
    const authInfo = calculateAuthDays(property.authorization_end);

    // Link kopyala
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Sonraki fotoğraf
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    // Önceki fotoğraf
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-6">
            {/* Üst Bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Portföye Dön
                </Button>
                <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(property.status)}>
                        {PROPERTY_STATUSES[property.status]}
                    </Badge>
                    <Badge variant="outline">
                        {LISTING_TYPES[property.listing_type]}
                    </Badge>
                </div>
            </div>

            {/* Ana İçerik - İki Sütun */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Panel - Geniş */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Fotoğraf Galerisi */}
                    <Card className="overflow-hidden">
                        <div className="relative">
                            {/* Ana Fotoğraf */}
                            <div
                                className="h-80 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center cursor-pointer"
                                onClick={() => setLightboxOpen(true)}
                            >
                                <div className="text-center text-gray-500">
                                    <Building2 className="w-16 h-16 mx-auto mb-2" />
                                    <p className="font-medium">{images[currentImageIndex]}</p>
                                    <p className="text-sm">Tıklayarak büyüt</p>
                                </div>
                            </div>

                            {/* Navigasyon Okları */}
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>

                            {/* Fotoğraf Sayacı */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </div>

                        {/* Thumbnail'lar */}
                        <div className="p-4 flex gap-2 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={cn(
                                        "w-20 h-14 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 border-2 transition-all",
                                        currentImageIndex === idx
                                            ? "border-blue-600"
                                            : "border-transparent hover:border-gray-300"
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Fiyat ve Başlık */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatPrice(property.price, property.currency)}
                                    </p>
                                    {property.listing_type === "kiralik" && (
                                        <p className="text-gray-500">/ aylık</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Komisyon</p>
                                    <p className="font-semibold">%{property.commission_rate}</p>
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold mt-4">{property.title}</h1>

                            <div className="flex items-center gap-1 text-gray-500 mt-2">
                                <MapPin className="w-4 h-4" />
                                <span>{property.neighborhood}, {property.district}, {property.city}</span>
                            </div>

                            {/* Özellik İkonları */}
                            <div className="flex flex-wrap gap-6 mt-6 py-4 border-t border-b">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <Maximize2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Brüt / Net</p>
                                        <p className="font-semibold">{property.gross_area} / {property.net_area} m²</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <BedDouble className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Oda Sayısı</p>
                                        <p className="font-semibold">{property.room_count}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                        <Layers className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kat</p>
                                        <p className="font-semibold">{property.floor} / {property.total_floors}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Bina Yaşı</p>
                                        <p className="font-semibold">{property.building_age} yıl</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detaylı Özellikler */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detaylı Özellikler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{property.heating_type || "Belirtilmemiş"}</span>
                                </div>
                                {property.has_elevator && (
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Asansör</span>
                                    </div>
                                )}
                                {property.has_parking && (
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Otopark</span>
                                    </div>
                                )}
                                {property.has_balcony && (
                                    <div className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Balkon</span>
                                    </div>
                                )}
                                {property.is_in_complex && (
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Site İçi</span>
                                    </div>
                                )}
                                {property.is_furnished && (
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Eşyalı</span>
                                    </div>
                                )}
                                {property.is_credit_eligible && (
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Krediye Uygun</span>
                                    </div>
                                )}
                                {property.is_exchange_eligible && (
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Takasa Açık</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Harita */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Konum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Harita Görünümü</p>
                                    <p className="text-sm">{property.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* İlan Açıklaması */}
                    <Card>
                        <CardHeader>
                            <CardTitle>İlan Açıklaması</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {property.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Aktivite Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Aktivite Geçmişi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-6">
                                    {DEMO_ACTIVITIES.map((activity) => {
                                        const Icon = activity.icon;
                                        return (
                                            <div key={activity.id} className="relative flex gap-4 pl-2">
                                                <div className="relative z-10 w-8 h-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="font-medium text-sm">{activity.title}</p>
                                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benzer Mülkler */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Benzer Mülkler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {SIMILAR_PROPERTIES.filter(p => p.id !== property.id).slice(0, 3).map((p) => (
                                    <Link href={`/dashboard/portfolio/${p.id}`} key={p.id}>
                                        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                                            <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                                                <Building2 className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                                            <p className="text-blue-600 font-bold text-sm mt-1">{formatPrice(p.price, p.currency)}</p>
                                            <p className="text-xs text-gray-500">{p.district}, {p.city}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notlar */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Notlar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <textarea
                                        placeholder="Not ekle..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Not Ekle
                                </Button>

                                {/* Mevcut notlar */}
                                <div className="border-t pt-4 mt-4 space-y-3">
                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm">Müşteri fiyat konusunda pazarlığa açık, 4M altına düşebilir.</p>
                                        <p className="text-xs text-gray-500 mt-1">Demo Kullanıcı • 1 hafta önce</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sağ Panel - Dar */}
                <div className="space-y-6">
                    {/* Aksiyon Butonları */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <Link href={`/dashboard/portfolio/${property.id}/edit`}>
                                <Button className="w-full" variant="default">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Düzenle
                                </Button>
                            </Link>
                            <Button className="w-full" variant="outline" onClick={handleCopyLink}>
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Kopyalandı!
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Paylaş
                                    </>
                                )}
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => setShowPortalModal(true)}>
                                <Upload className="w-4 h-4 mr-2" />
                                Portal'a Yükle
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Users className="w-4 h-4 mr-2" />
                                Eşleşen Müşteriler
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                Gösterim Planla
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Mal Sahibi Bilgileri */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Mal Sahibi</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowOwnerInfo(!showOwnerInfo)}
                                >
                                    {showOwnerInfo ? "Gizle" : "Göster"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {showOwnerInfo ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{property.owner_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{property.owner_name}</p>
                                            <p className="text-sm text-gray-500">{property.owner_phone}</p>
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline" size="sm">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Ara
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Bilgileri görmek için "Göster" butonuna tıklayın
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Yetki Süresi */}
                    <Card className={cn(
                        authInfo.isExpired && "border-red-300 dark:border-red-800",
                        authInfo.isExpiring && "border-yellow-300 dark:border-yellow-800"
                    )}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Yetki Süresi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {authInfo.isExpired ? (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold">Yetki süresi dolmuş!</span>
                                </div>
                            ) : authInfo.isExpiring ? (
                                <div className="text-yellow-600">
                                    <p className="font-semibold">{authInfo.days} gün kaldı</p>
                                    <p className="text-sm">Yetki yenileme gerekiyor</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold text-green-600">{authInfo.days} gün kaldı</p>
                                    <p className="text-sm text-gray-500">
                                        {property.authorization_start} - {property.authorization_end}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Performans Kartı */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Performans
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">Görüntülenme</span>
                                </div>
                                <span className="font-semibold">{property.views}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">Gösterim</span>
                                </div>
                                <span className="font-semibold">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">Teklif</span>
                                </div>
                                <span className="font-semibold">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">Favori</span>
                                </div>
                                <span className="font-semibold">28</span>
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
                                    <span>Mülk ekleme</span>
                                    <span className="text-green-600">+50 XP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>İlk fotoğraf</span>
                                    <span className="text-green-600">+10 XP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tam doldurulmuş</span>
                                    <span className="text-green-600">+25 XP</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                                    <span>Toplam</span>
                                    <span className="text-purple-600">85 XP</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 text-white hover:bg-white/20 h-12 w-12"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 text-white hover:bg-white/20 h-12 w-12"
                        onClick={nextImage}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </Button>
                    <div className="text-center text-white">
                        <div className="w-[80vw] h-[70vh] bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                            <div>
                                <Building2 className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                <p className="text-xl">{images[currentImageIndex]}</p>
                            </div>
                        </div>
                        <p>{currentImageIndex + 1} / {images.length}</p>
                    </div>
                </div>
            )}

            {/* Portal Yayınlama Modal */}
            {showPortalModal && (
                <PortalPublishModal
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyType={property.property_type}
                    propertyPrice={property.price}
                    onClose={() => setShowPortalModal(false)}
                    onSuccess={(results) => {
                        console.log("Portal yayın sonuçları:", results);
                        // Başarılı sonuçları mülk verisine kaydet
                    }}
                />
            )}
        </div>
    );
}
