"use client";

import { useState } from "react";
import {
    Globe,
    Upload,
    Check,
    X,
    Loader2,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Tag,
    DollarSign,
    Star,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Portal sabitleri
const PORTALS = [
    { id: "sahibinden", name: "Sahibinden.com", connected: true, logo: "🏠" },
    { id: "hepsiemlak", name: "Hepsiemlak", connected: true, logo: "🏢" },
    { id: "emlakjet", name: "Emlakjet", connected: false, logo: "✈️" },
];

// Kategori seçenekleri
const CATEGORIES = {
    daire: { sahibinden: "Satılık Daire", hepsiemlak: "Konut > Daire", emlakjet: "Daire" },
    villa: { sahibinden: "Satılık Villa", hepsiemlak: "Konut > Villa", emlakjet: "Villa" },
    arsa: { sahibinden: "Satılık Arsa", hepsiemlak: "Arsa", emlakjet: "Arsa" },
    isyeri: { sahibinden: "Satılık İşyeri", hepsiemlak: "Ticari > Dükkan", emlakjet: "İşyeri" },
    ofis: { sahibinden: "Satılık Ofis", hepsiemlak: "Ticari > Ofis", emlakjet: "Ofis" },
};

// Öne çıkarma paketleri
const HIGHLIGHT_PACKAGES = {
    sahibinden: [
        { id: "none", name: "Standart İlan", price: 0 },
        { id: "doping", name: "Doping", price: 150 },
        { id: "acil", name: "Acil", price: 100 },
        { id: "vitrin", name: "Vitrin", price: 300 },
    ],
    hepsiemlak: [
        { id: "none", name: "Standart", price: 0 },
        { id: "premium", name: "Premium", price: 200 },
        { id: "gold", name: "Gold", price: 400 },
    ],
    emlakjet: [
        { id: "none", name: "Ücretsiz", price: 0 },
        { id: "one_cikar", name: "Öne Çıkar", price: 150 },
    ],
};

// Yayınlama durumu
type PublishStatus = "idle" | "publishing" | "success" | "error";

interface PortalPublishState {
    selected: boolean;
    category: string;
    price: number;
    highlightPackage: string;
    status: PublishStatus;
    listingId?: string;
    error?: string;
}

interface PortalPublishModalProps {
    propertyId: string;
    propertyTitle: string;
    propertyType: string;
    propertyPrice: number;
    onClose: () => void;
    onSuccess?: (results: Record<string, string>) => void;
}

export function PortalPublishModal({
    propertyId,
    propertyTitle,
    propertyType,
    propertyPrice,
    onClose,
    onSuccess,
}: PortalPublishModalProps) {
    // Her portal için state
    const [portalStates, setPortalStates] = useState<Record<string, PortalPublishState>>(() => {
        const initial: Record<string, PortalPublishState> = {};
        PORTALS.forEach((portal) => {
            const categoryKey = propertyType as keyof typeof CATEGORIES;
            const category = CATEGORIES[categoryKey]?.[portal.id as keyof typeof CATEGORIES.daire] || "";
            initial[portal.id] = {
                selected: portal.connected,
                category,
                price: propertyPrice,
                highlightPackage: "none",
                status: "idle",
            };
        });
        return initial;
    });

    const [isPublishing, setIsPublishing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Portal seçimini değiştir
    const togglePortal = (portalId: string) => {
        setPortalStates((prev) => ({
            ...prev,
            [portalId]: { ...prev[portalId], selected: !prev[portalId].selected },
        }));
    };

    // Portal ayarını güncelle
    const updatePortalState = (portalId: string, updates: Partial<PortalPublishState>) => {
        setPortalStates((prev) => ({
            ...prev,
            [portalId]: { ...prev[portalId], ...updates },
        }));
    };

    // Seçili portal sayısı
    const selectedCount = Object.values(portalStates).filter((s) => s.selected).length;

    // Yayınla
    const handlePublish = async () => {
        setIsPublishing(true);

        // Her seçili portal için yayınla
        for (const portal of PORTALS) {
            const state = portalStates[portal.id];
            if (!state.selected) continue;

            updatePortalState(portal.id, { status: "publishing" });

            // Simüle API çağrısı (2-4 saniye)
            await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000));

            // Demo: %90 başarı oranı
            const success = Math.random() > 0.1;

            if (success) {
                const listingId = `${portal.id.toUpperCase()}-${Date.now().toString().slice(-8)}`;
                updatePortalState(portal.id, { status: "success", listingId });
            } else {
                updatePortalState(portal.id, { status: "error", error: "Fotoğraf yükleme hatası" });
            }
        }

        setIsPublishing(false);
        setShowResults(true);

        // Başarılı sonuçları callback'e gönder
        const successResults: Record<string, string> = {};
        Object.entries(portalStates).forEach(([portalId, state]) => {
            if (state.status === "success" && state.listingId) {
                successResults[portalId] = state.listingId;
            }
        });

        if (Object.keys(successResults).length > 0) {
            onSuccess?.(successResults);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Portallara Yükle
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{propertyTitle}</p>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {!showResults ? (
                        <>
                            {/* Portal Seçimi */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Portal Seçimi</Label>
                                {PORTALS.map((portal) => {
                                    const state = portalStates[portal.id];
                                    const packages = HIGHLIGHT_PACKAGES[portal.id as keyof typeof HIGHLIGHT_PACKAGES];

                                    return (
                                        <div
                                            key={portal.id}
                                            className={cn(
                                                "border rounded-lg transition-all",
                                                state.selected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700",
                                                !portal.connected && "opacity-50"
                                            )}
                                        >
                                            {/* Portal başlık */}
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={state.selected}
                                                        onCheckedChange={() => portal.connected && togglePortal(portal.id)}
                                                        disabled={!portal.connected}
                                                    />
                                                    <span className="text-2xl">{portal.logo}</span>
                                                    <div>
                                                        <p className="font-medium">{portal.name}</p>
                                                        {!portal.connected && (
                                                            <p className="text-xs text-orange-600">Bağlantı gerekli</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {state.selected && portal.connected && (
                                                    <Badge className="bg-blue-100 text-blue-700">Seçili</Badge>
                                                )}
                                            </div>

                                            {/* Portal ayarları */}
                                            {state.selected && portal.connected && (
                                                <div className="px-4 pb-4 pt-2 border-t space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Kategori */}
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-1 text-sm">
                                                                <Tag className="w-3 h-3" />
                                                                Kategori
                                                            </Label>
                                                            <Input
                                                                value={state.category}
                                                                onChange={(e) => updatePortalState(portal.id, { category: e.target.value })}
                                                                placeholder="Kategori"
                                                            />
                                                        </div>

                                                        {/* Fiyat */}
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-1 text-sm">
                                                                <DollarSign className="w-3 h-3" />
                                                                Fiyat (₺)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={state.price}
                                                                onChange={(e) =>
                                                                    updatePortalState(portal.id, { price: parseInt(e.target.value) || 0 })
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Öne çıkarma paketi */}
                                                    <div className="space-y-2">
                                                        <Label className="flex items-center gap-1 text-sm">
                                                            <Star className="w-3 h-3" />
                                                            Öne Çıkarma Paketi
                                                        </Label>
                                                        <Select
                                                            value={state.highlightPackage}
                                                            onValueChange={(v) => updatePortalState(portal.id, { highlightPackage: v })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {packages.map((pkg) => (
                                                                    <SelectItem key={pkg.id} value={pkg.id}>
                                                                        {pkg.name} {pkg.price > 0 && `(+${pkg.price} ₺)`}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Yayınla butonu */}
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    İptal
                                </Button>
                                <Button
                                    onClick={handlePublish}
                                    disabled={selectedCount === 0 || isPublishing}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                >
                                    {isPublishing ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    {selectedCount} Portal'a Yayınla
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* Sonuçlar */
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                Yayınlama Sonuçları
                            </h3>

                            {PORTALS.map((portal) => {
                                const state = portalStates[portal.id];
                                if (!state.selected) return null;

                                return (
                                    <div
                                        key={portal.id}
                                        className={cn(
                                            "p-4 rounded-lg border flex items-center justify-between",
                                            state.status === "success"
                                                ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                                                : state.status === "error"
                                                    ? "bg-red-50 border-red-200 dark:bg-red-900/20"
                                                    : "bg-gray-50 border-gray-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{portal.logo}</span>
                                            <div>
                                                <p className="font-medium">{portal.name}</p>
                                                {state.status === "success" && state.listingId && (
                                                    <p className="text-sm text-green-600">
                                                        İlan No: <code className="bg-green-100 px-1 rounded">{state.listingId}</code>
                                                    </p>
                                                )}
                                                {state.status === "error" && (
                                                    <p className="text-sm text-red-600">{state.error}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {state.status === "success" && <CheckCircle className="w-6 h-6 text-green-500" />}
                                            {state.status === "error" && <AlertCircle className="w-6 h-6 text-red-500" />}
                                            {state.status === "publishing" && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* XP Kazanımı */}
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    <span className="font-medium">
                                        +{Object.values(portalStates).filter((s) => s.status === "success").length * 10} XP kazandınız!
                                    </span>
                                </div>
                            </div>

                            <Button onClick={onClose} className="w-full">
                                Kapat
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Toplu yayınlama için progress modal
interface BulkPublishModalProps {
    properties: { id: string; title: string; price: number }[];
    onClose: () => void;
}

export function BulkPublishModal({ properties, onClose }: BulkPublishModalProps) {
    const [selectedPortals, setSelectedPortals] = useState<string[]>(["sahibinden", "hepsiemlak"]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<Record<string, "success" | "error">>({});

    const progress = (currentIndex / properties.length) * 100;

    const togglePortal = (portalId: string) => {
        setSelectedPortals((prev) =>
            prev.includes(portalId) ? prev.filter((p) => p !== portalId) : [...prev, portalId]
        );
    };

    const handleBulkPublish = async () => {
        setIsPublishing(true);
        setResults({});

        for (let i = 0; i < properties.length; i++) {
            setCurrentIndex(i + 1);

            // Her mülk için yayınla (simüle)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const success = Math.random() > 0.15;
            setResults((prev) => ({
                ...prev,
                [properties[i].id]: success ? "success" : "error",
            }));
        }

        setIsPublishing(false);
    };

    const successCount = Object.values(results).filter((r) => r === "success").length;
    const errorCount = Object.values(results).filter((r) => r === "error").length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Toplu Portal Yayını
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {!isPublishing && currentIndex === 0 ? (
                        <>
                            <p className="text-sm text-gray-500">
                                <strong>{properties.length}</strong> mülk seçili portallara yayınlanacak.
                            </p>

                            {/* Portal seçimi */}
                            <div className="space-y-2">
                                <Label>Hedef Portallar</Label>
                                {PORTALS.filter((p) => p.connected).map((portal) => (
                                    <div key={portal.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedPortals.includes(portal.id)}
                                            onCheckedChange={() => togglePortal(portal.id)}
                                        />
                                        <span className="text-xl">{portal.logo}</span>
                                        <span>{portal.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleBulkPublish}
                                    disabled={selectedPortals.length === 0}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Yayınla
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>İlerleme</span>
                                    <span>
                                        {currentIndex} / {properties.length}
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {isPublishing && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    <span className="ml-3">Yayınlanıyor: {properties[currentIndex - 1]?.title}</span>
                                </div>
                            )}

                            {!isPublishing && currentIndex > 0 && (
                                <>
                                    {/* Sonuç özeti */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600">{successCount}</p>
                                            <p className="text-sm text-gray-500">Başarılı</p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                                            <p className="text-sm text-gray-500">Hatalı</p>
                                        </div>
                                    </div>

                                    {/* XP */}
                                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
                                        <Sparkles className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                                        <p className="font-bold text-lg">+{successCount * 10} XP</p>
                                    </div>

                                    <Button onClick={onClose} className="w-full">
                                        Kapat
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
