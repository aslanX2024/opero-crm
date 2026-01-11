"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Save,
    FileText,
    MapPin,
    Settings,
    Image,
    User,
    Edit3,
    Sparkles,
    Plus,
    Trash2,
    GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    LISTING_TYPES,
    PROPERTY_TYPES,
    ROOM_COUNTS,
    HEATING_TYPES,
    CITIES,
} from "@/types/property";

// Form adımları
const STEPS = [
    { id: 1, title: "Temel Bilgiler", icon: FileText },
    { id: 2, title: "Konum", icon: MapPin },
    { id: 3, title: "Özellikler", icon: Settings },
    { id: 4, title: "Görseller", icon: Image },
    { id: 5, title: "Mal Sahibi", icon: User },
    { id: 6, title: "Açıklama", icon: Edit3 },
];

// İlçeler (demo)
const DISTRICTS: Record<string, string[]> = {
    "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Ataşehir", "Üsküdar", "Bakırköy", "Beyoğlu", "Fatih"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut"],
    "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Bayraklı"],
    "Antalya": ["Muratpaşa", "Konyaaltı", "Kepez", "Alanya", "Manavgat"],
};

// Yeni mülk ekleme sayfası
export default function NewPropertyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Adım 1 - Temel bilgiler
        title: "",
        listing_type: "satilik" as "satilik" | "kiralik",
        property_type: "daire",
        price: "",
        currency: "TRY",
        commission_rate: "2",

        // Adım 2 - Konum
        city: "",
        district: "",
        neighborhood: "",
        address: "",
        latitude: "",
        longitude: "",

        // Adım 3 - Özellikler
        gross_area: "",
        net_area: "",
        room_count: "2+1",
        floor: "",
        total_floors: "",
        building_age: "",
        heating_type: "",
        has_elevator: false,
        has_parking: false,
        has_balcony: false,
        is_in_complex: false,
        is_furnished: false,
        is_credit_eligible: false,
        is_exchange_eligible: false,

        // Adım 4 - Görseller
        images: [] as string[],
        main_image_index: 0,
        video_url: "",

        // Adım 5 - Mal sahibi
        owner_name: "",
        owner_phone: "",
        authorization_start: "",
        authorization_end: "",
        owner_notes: "",

        // Adım 6 - Açıklama
        description: "",
        portal_ids: {} as Record<string, string>,
    });

    // Input değişikliği
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Sonraki adım
    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Önceki adım
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Kaydet
    const handleSave = async (isDraft: boolean = false) => {
        setSaving(true);
        // Simüle kaydetme
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSaving(false);

        // XP animasyonu ve yönlendirme
        alert(isDraft ? "Taslak kaydedildi!" : "Mülk başarıyla eklendi! +50 XP kazandınız 🎉");
        router.push("/dashboard/portfolio");
    };

    // Mevcut ilçeler
    const availableDistricts = formData.city ? DISTRICTS[formData.city] || [] : [];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Başlık */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                </Button>
                <h1 className="text-2xl font-bold">Yeni Mülk Ekle</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Mülk bilgilerini adım adım doldurun
                </p>
            </div>

            {/* Adım Göstergesi */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex items-center">
                                {/* Adım */}
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg transition-all",
                                        isCurrent && "bg-blue-50 dark:bg-blue-900/20",
                                        isCompleted && "text-green-600 dark:text-green-400"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                            isCurrent && "border-blue-600 bg-blue-600 text-white",
                                            isCompleted && "border-green-600 bg-green-600 text-white",
                                            !isCurrent && !isCompleted && "border-gray-300 dark:border-gray-600"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "hidden lg:block text-sm font-medium",
                                            isCurrent && "text-blue-600 dark:text-blue-400",
                                            !isCurrent && !isCompleted && "text-gray-500"
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </button>

                                {/* Çizgi */}
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "hidden sm:block w-12 lg:w-20 h-0.5 mx-2",
                                            isCompleted ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form İçeriği */}
            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        Adım {currentStep} / {STEPS.length}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Adım 1: Temel Bilgiler */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">İlan Başlığı *</Label>
                                <Input
                                    id="title"
                                    placeholder="Örn: Deniz Manzaralı Lüks 3+1 Daire"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tür *</Label>
                                    <Select
                                        value={formData.listing_type}
                                        onValueChange={(v) => handleChange("listing_type", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(LISTING_TYPES).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Mülk Tipi *</Label>
                                    <Select
                                        value={formData.property_type}
                                        onValueChange={(v) => handleChange("property_type", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="price">Fiyat *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="4500000"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Para Birimi</Label>
                                    <Select
                                        value={formData.currency}
                                        onValueChange={(v) => handleChange("currency", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TRY">₺ TRY</SelectItem>
                                            <SelectItem value="USD">$ USD</SelectItem>
                                            <SelectItem value="EUR">€ EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="commission">Komisyon Oranı (%)</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    placeholder="2"
                                    value={formData.commission_rate}
                                    onChange={(e) => handleChange("commission_rate", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Adım 2: Konum */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Şehir *</Label>
                                    <Select
                                        value={formData.city}
                                        onValueChange={(v) => {
                                            handleChange("city", v);
                                            handleChange("district", "");
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Şehir seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CITIES.map((city) => (
                                                <SelectItem key={city} value={city}>
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>İlçe *</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(v) => handleChange("district", v)}
                                        disabled={!formData.city}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="İlçe seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableDistricts.map((district) => (
                                                <SelectItem key={district} value={district}>
                                                    {district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="neighborhood">Mahalle</Label>
                                    <Input
                                        id="neighborhood"
                                        placeholder="Mahalle adı"
                                        value={formData.neighborhood}
                                        onChange={(e) => handleChange("neighborhood", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adres</Label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    placeholder="Detaylı adres bilgisi..."
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            {/* Harita placeholder */}
                            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Harita üzerinde konum seçin</p>
                                    <p className="text-sm">veya koordinatları manuel girin</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Enlem (Latitude)</Label>
                                    <Input
                                        id="latitude"
                                        placeholder="40.9876"
                                        value={formData.latitude}
                                        onChange={(e) => handleChange("latitude", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Boylam (Longitude)</Label>
                                    <Input
                                        id="longitude"
                                        placeholder="29.0283"
                                        value={formData.longitude}
                                        onChange={(e) => handleChange("longitude", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Adım 3: Özellikler */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gross_area">Brüt m² *</Label>
                                    <Input
                                        id="gross_area"
                                        type="number"
                                        placeholder="180"
                                        value={formData.gross_area}
                                        onChange={(e) => handleChange("gross_area", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="net_area">Net m² *</Label>
                                    <Input
                                        id="net_area"
                                        type="number"
                                        placeholder="160"
                                        value={formData.net_area}
                                        onChange={(e) => handleChange("net_area", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Oda Sayısı *</Label>
                                    <Select
                                        value={formData.room_count}
                                        onValueChange={(v) => handleChange("room_count", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROOM_COUNTS.map((room) => (
                                                <SelectItem key={room} value={room}>
                                                    {room}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="building_age">Bina Yaşı</Label>
                                    <Input
                                        id="building_age"
                                        type="number"
                                        placeholder="5"
                                        value={formData.building_age}
                                        onChange={(e) => handleChange("building_age", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="floor">Bulunduğu Kat</Label>
                                    <Input
                                        id="floor"
                                        type="number"
                                        placeholder="8"
                                        value={formData.floor}
                                        onChange={(e) => handleChange("floor", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_floors">Toplam Kat</Label>
                                    <Input
                                        id="total_floors"
                                        type="number"
                                        placeholder="12"
                                        value={formData.total_floors}
                                        onChange={(e) => handleChange("total_floors", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Isınma Tipi</Label>
                                    <Select
                                        value={formData.heating_type}
                                        onValueChange={(v) => handleChange("heating_type", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HEATING_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Checkbox'lar */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Ek Özellikler</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { key: "has_elevator", label: "Asansör" },
                                        { key: "has_parking", label: "Otopark" },
                                        { key: "has_balcony", label: "Balkon" },
                                        { key: "is_in_complex", label: "Site İçi" },
                                        { key: "is_furnished", label: "Eşyalı" },
                                        { key: "is_credit_eligible", label: "Krediye Uygun" },
                                        { key: "is_exchange_eligible", label: "Takasa Açık" },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={key}
                                                checked={formData[key as keyof typeof formData] as boolean}
                                                onCheckedChange={(checked) => handleChange(key, checked)}
                                            />
                                            <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                                                {label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Adım 4: Görseller */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            {/* Fotoğraf yükleme alanı */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium mb-2">Fotoğrafları sürükleyip bırakın</p>
                                <p className="text-sm text-gray-500 mb-4">veya</p>
                                <Button variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Dosya Seç
                                </Button>
                                <p className="text-xs text-gray-400 mt-4">
                                    PNG, JPG, WEBP • Maksimum 10MB • En fazla 20 fotoğraf
                                </p>
                            </div>

                            {/* Yüklenen fotoğraflar (demo) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg group cursor-move"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <Image className="w-8 h-8" />
                                        </div>
                                        <div className="absolute top-2 left-2">
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                        </div>
                                        {i === 1 && (
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-blue-600 text-xs">Ana</Badge>
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="destructive" className="h-7 w-7">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Video URL */}
                            <div className="space-y-2">
                                <Label htmlFor="video_url">Video URL (YouTube / 360° Tur)</Label>
                                <Input
                                    id="video_url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.video_url}
                                    onChange={(e) => handleChange("video_url", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Adım 5: Mal Sahibi */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner_name">Ad Soyad *</Label>
                                    <Input
                                        id="owner_name"
                                        placeholder="Ahmet Yılmaz"
                                        value={formData.owner_name}
                                        onChange={(e) => handleChange("owner_name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="owner_phone">Telefon *</Label>
                                    <Input
                                        id="owner_phone"
                                        placeholder="0532 111 22 33"
                                        value={formData.owner_phone}
                                        onChange={(e) => handleChange("owner_phone", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="authorization_start">Yetki Başlangıç Tarihi</Label>
                                    <Input
                                        id="authorization_start"
                                        type="date"
                                        value={formData.authorization_start}
                                        onChange={(e) => handleChange("authorization_start", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="authorization_end">Yetki Bitiş Tarihi</Label>
                                    <Input
                                        id="authorization_end"
                                        type="date"
                                        value={formData.authorization_end}
                                        onChange={(e) => handleChange("authorization_end", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner_notes">Notlar</Label>
                                <textarea
                                    id="owner_notes"
                                    rows={4}
                                    placeholder="Mal sahibi hakkında özel notlar..."
                                    value={formData.owner_notes}
                                    onChange={(e) => handleChange("owner_notes", e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Adım 6: Açıklama */}
                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="description">İlan Açıklaması *</Label>
                                    <Button variant="outline" size="sm">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        AI ile Oluştur
                                    </Button>
                                </div>
                                <textarea
                                    id="description"
                                    rows={8}
                                    placeholder="Mülk hakkında detaylı açıklama yazın..."
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            {/* Portal ilan numaraları */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Portal İlan Numaraları (Opsiyonel)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sahibinden">Sahibinden.com</Label>
                                        <Input
                                            id="sahibinden"
                                            placeholder="İlan numarası"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hepsiemlak">Hepsiemlak.com</Label>
                                        <Input
                                            id="hepsiemlak"
                                            placeholder="İlan numarası"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Özet */}
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-medium">Mülk kaydedildiğinde +50 XP kazanacaksınız!</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigasyon Butonları */}
            <div className="flex items-center justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Önceki
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(true)}
                        disabled={saving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Taslak Kaydet
                    </Button>

                    {currentStep === STEPS.length ? (
                        <Button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            {saving ? (
                                <>Kaydediliyor...</>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Mülkü Kaydet
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button onClick={nextStep}>
                            Sonraki
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
