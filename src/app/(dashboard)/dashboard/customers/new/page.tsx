"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    User,
    Phone,
    Mail,
    DollarSign,
    MapPin,
    Home,
    Calendar,
    FileText,
    Plus,
    X,
    Sparkles,
    Check,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    CUSTOMER_TYPES,
    LEAD_SOURCES,
    getLeadScoreColor,
    getLeadScoreLabel,
} from "@/types/customer";
import { PROPERTY_TYPES, ROOM_COUNTS } from "@/types/property";
import { LocationSelector } from "@/components/location/location-selector";
import { SelectedLocation } from "@/types/location";



// Özellikler (checkbox'lar için)
const PROPERTY_FEATURES = [
    { key: "elevator", label: "Asansör" },
    { key: "parking", label: "Otopark" },
    { key: "balcony", label: "Balkon" },
    { key: "complex", label: "Site İçi" },
    { key: "furnished", label: "Eşyalı" },
    { key: "credit", label: "Krediye Uygun" },
    { key: "newBuilding", label: "Sıfır Bina" },
    { key: "seaView", label: "Deniz Manzarası" },
];

// Taşınma zamanı seçenekleri
const MOVE_TIMEFRAMES = [
    { value: "immediate", label: "Hemen" },
    { value: "1month", label: "1 Ay İçinde" },
    { value: "3months", label: "3 Ay İçinde" },
    { value: "6months", label: "6 Ay İçinde" },
    { value: "1year", label: "1 Yıl İçinde" },
    { value: "noRush", label: "Acele Yok" },
];

// Aciliyet seçenekleri
const URGENCY_OPTIONS = [
    { value: "urgent", label: "Acil - 1 Ay İçinde" },
    { value: "normal", label: "Normal - 3 Ay İçinde" },
    { value: "flexible", label: "Esnek - 6 Ay+" },
];

// Lead skor hesaplama
function calculateLeadScore(formData: any): number {
    let score = 0;

    // Bütçe netliği (+20)
    if (formData.budgetMin && formData.budgetMax) {
        score += 20;
    }

    // Zaman çerçevesi (+15)
    if (formData.moveTimeframe === "immediate" || formData.moveTimeframe === "1month") {
        score += 15;
    } else if (formData.moveTimeframe === "3months") {
        score += 10;
    }

    // İletişim kalitesi (+15) - telefon varsa
    if (formData.phone && formData.phone.length >= 10) {
        score += 15;
    }

    // Lokasyon netliği (+10)
    if (formData.selectedLocations && formData.selectedLocations.length > 0) {
        score += 10;
    }

    // Referans kaynağı (+20)
    if (formData.leadSource === "referans") {
        score += 20;
    } else if (formData.leadSource === "website") {
        score += 10;
    }

    // Mülk tipi seçimi (+5)
    if (formData.selectedPropertyTypes.length > 0) {
        score += 5;
    }

    // Oda sayısı seçimi (+5)
    if (formData.selectedRoomCounts.length > 0) {
        score += 5;
    }

    return Math.min(score, 100);
}

// Telefon formatı kontrolü
function formatPhoneNumber(value: string): string {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
}

// Yeni müşteri ekleme sayfası
export default function NewCustomerPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        // Temel bilgiler
        fullName: "",
        phone: "",
        email: "",
        customerType: "alici" as "alici" | "satici" | "kiraci" | "yatirimci",
        leadSource: "",
        otherSource: "",

        // Alıcı/Kiracı için
        budgetMin: 1000000,
        budgetMax: 5000000,
        selectedPropertyTypes: [] as string[],
        selectedRoomCounts: [] as string[],
        selectedLocations: [] as SelectedLocation[],
        selectedFeatures: [] as string[],
        moveTimeframe: "",

        // Satıcı için
        hasProperty: false,
        expectedPrice: "",
        urgency: "",

        // Ortak
        notes: "",
    });

    // Form değişikliği
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Telefon değişikliği
    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        handleChange("phone", formatted);

        const numbers = value.replace(/\D/g, "");
        if (numbers.length > 0 && numbers.length < 10) {
            setPhoneError("Telefon numarası en az 10 haneli olmalıdır");
        } else {
            setPhoneError("");
        }
    };

    // Çoklu seçim toggle
    const toggleSelection = (field: string, value: string) => {
        const current = formData[field as keyof typeof formData] as string[];
        if (current.includes(value)) {
            handleChange(field, current.filter((v) => v !== value));
        } else {
            handleChange(field, [...current, value]);
        }
    };

    // Lead skor
    const leadScore = calculateLeadScore(formData);

    // Kaydet
    const handleSave = async () => {
        // Validasyon
        if (!formData.fullName.trim()) {
            alert("Ad Soyad zorunludur");
            return;
        }
        if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
            alert("Geçerli bir telefon numarası giriniz");
            return;
        }

        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSaving(false);

        alert(`Müşteri başarıyla eklendi! Lead Skoru: ${leadScore}\n+30 XP kazandınız 🎉`);
        router.push("/dashboard/customers");
    };

    // Alıcı/Kiracı mı?
    const isBuyer = formData.customerType === "alici" || formData.customerType === "kiraci" || formData.customerType === "yatirimci";
    const isSeller = formData.customerType === "satici";

    // Bütçe formatı
    const formatBudgetLabel = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ₺`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K ₺`;
        return `${value} ₺`;
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Başlık */}
            <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                </Button>
                <h1 className="text-2xl font-bold">Yeni Müşteri Ekle</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Müşteri bilgilerini doldurun
                </p>
            </div>

            <div className="space-y-6">
                {/* Lead Skor Önizleme */}
                <Card className={cn(
                    "border-2",
                    leadScore >= 70 && "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20",
                    leadScore >= 40 && leadScore < 70 && "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20",
                    leadScore < 40 && "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
                )}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tahmini Lead Skoru</p>
                                <p className="text-2xl font-bold">{leadScore}</p>
                            </div>
                        </div>
                        <Badge className={cn("text-lg px-4 py-2", getLeadScoreColor(leadScore))}>
                            {getLeadScoreLabel(leadScore)}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Temel Bilgiler */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Temel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Ad Soyad *</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Ahmet Yılmaz"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon *</Label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        placeholder="0532 111 22 33"
                                        value={formData.phone}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        className={cn(phoneError && "border-red-500")}
                                    />
                                    {phoneError && (
                                        <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ahmet@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Müşteri Tipi *</Label>
                                <Select
                                    value={formData.customerType}
                                    onValueChange={(v) => handleChange("customerType", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(CUSTOMER_TYPES).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Kaynak</Label>
                            <Select
                                value={formData.leadSource}
                                onValueChange={(v) => handleChange("leadSource", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kaynak seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(LEAD_SOURCES).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                    <SelectItem value="other">Diğer</SelectItem>
                                </SelectContent>
                            </Select>
                            {formData.leadSource === "other" && (
                                <Input
                                    placeholder="Kaynak belirtin..."
                                    value={formData.otherSource}
                                    onChange={(e) => handleChange("otherSource", e.target.value)}
                                    className="mt-2"
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Alıcı/Kiracı/Yatırımcı Bilgileri */}
                {isBuyer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                {formData.customerType === "kiraci" ? "Kiralama" : "Satın Alma"} Tercihleri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Bütçe */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Bütçe Aralığı</Label>
                                    <span className="text-sm text-gray-500">
                                        {formatBudgetLabel(formData.budgetMin)} - {formatBudgetLabel(formData.budgetMax)}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Minimum</Label>
                                        <Slider
                                            defaultValue={[formData.budgetMin]}
                                            min={formData.customerType === "kiraci" ? 5000 : 500000}
                                            max={formData.customerType === "kiraci" ? 100000 : 50000000}
                                            step={formData.customerType === "kiraci" ? 1000 : 100000}
                                            onValueChange={(v) => handleChange("budgetMin", v[0])}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Maksimum</Label>
                                        <Slider
                                            defaultValue={[formData.budgetMax]}
                                            min={formData.customerType === "kiraci" ? 5000 : 500000}
                                            max={formData.customerType === "kiraci" ? 100000 : 50000000}
                                            step={formData.customerType === "kiraci" ? 1000 : 100000}
                                            onValueChange={(v) => handleChange("budgetMax", v[0])}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mülk Tipi */}
                            <div className="space-y-3">
                                <Label>İstenen Mülk Tipi</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                                        <Button
                                            key={key}
                                            type="button"
                                            variant={formData.selectedPropertyTypes.includes(key) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleSelection("selectedPropertyTypes", key)}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Oda Sayısı */}
                            <div className="space-y-3">
                                <Label>İstenen Oda Sayısı</Label>
                                <div className="flex flex-wrap gap-2">
                                    {ROOM_COUNTS.slice(0, 8).map((room) => (
                                        <Button
                                            key={room}
                                            type="button"
                                            variant={formData.selectedRoomCounts.includes(room) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleSelection("selectedRoomCounts", room)}
                                        >
                                            {room}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Bölgeler */}
                            <div className="space-y-3">
                                <Label>Tercih Edilen Bölgeler</Label>
                                <p className="text-sm text-gray-500 mb-2">Müşterinin aradığı bölgeleri seçin (birden fazla seçilebilir)</p>
                                <LocationSelector
                                    value={formData.selectedLocations}
                                    onChange={(locations) => handleChange("selectedLocations", locations)}
                                    maxSelections={10}
                                    showNeighborhoods={true}
                                />
                            </div>

                            {/* Özellikler */}
                            <div className="space-y-3">
                                <Label>İstenen Özellikler</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {PROPERTY_FEATURES.map(({ key, label }) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`feature-${key}`}
                                                checked={formData.selectedFeatures.includes(key)}
                                                onCheckedChange={() => toggleSelection("selectedFeatures", key)}
                                            />
                                            <Label htmlFor={`feature-${key}`} className="text-sm font-normal cursor-pointer">
                                                {label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Taşınma Zamanı */}
                            <div className="space-y-2">
                                <Label>Ne Zaman Taşınmak İstiyor?</Label>
                                <Select
                                    value={formData.moveTimeframe}
                                    onValueChange={(v) => handleChange("moveTimeframe", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOVE_TIMEFRAMES.map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Satıcı Bilgileri */}
                {isSeller && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Satış Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="hasProperty"
                                    checked={formData.hasProperty}
                                    onCheckedChange={(checked) => handleChange("hasProperty", checked)}
                                />
                                <Label htmlFor="hasProperty" className="font-normal cursor-pointer">
                                    Portföyde mülkü var
                                </Label>
                            </div>

                            {formData.hasProperty ? (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Portföyden mülk seçin veya yeni ekleyin
                                    </p>
                                    <div className="flex gap-2">
                                        <Select>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Mülk seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Deniz Manzaralı Lüks Daire</SelectItem>
                                                <SelectItem value="2">Merkezi Konumda Satılık Ofis</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" asChild>
                                            <a href="/dashboard/portfolio/new">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Yeni
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Müşteriyi kaydettikten sonra mülk ekleyebilirsiniz
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="expectedPrice">Fiyat Beklentisi</Label>
                                <Input
                                    id="expectedPrice"
                                    type="number"
                                    placeholder="5000000"
                                    value={formData.expectedPrice}
                                    onChange={(e) => handleChange("expectedPrice", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Aciliyet Durumu</Label>
                                <Select
                                    value={formData.urgency}
                                    onValueChange={(v) => handleChange("urgency", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {URGENCY_OPTIONS.map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notlar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Notlar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            placeholder="Müşteri hakkında notlar..."
                            value={formData.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            rows={4}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </CardContent>
                </Card>

                {/* XP Bilgisi */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span className="font-medium">Müşteri kaydedildiğinde +30 XP kazanacaksınız!</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Kaydet Butonu */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {saving ? (
                            <>Kaydediliyor...</>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Müşteriyi Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
