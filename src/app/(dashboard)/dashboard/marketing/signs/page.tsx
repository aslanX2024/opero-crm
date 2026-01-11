"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    MapPin,
    Plus,
    List,
    Map,
    Calendar,
    User,
    Building2,
    AlertTriangle,
    CheckCircle,
    Clock,
    Camera,
    Edit,
    Trash2,
    Eye,
    X,
    Search,
    Filter,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Signboard,
    DEMO_SIGNBOARDS,
    DEMO_AGENTS,
    SIGNBOARD_TYPES,
    SIGNBOARD_STATUSES,
    CHECK_STATUSES,
    getSignboardsNeedingCheck,
    getDaysDiff,
    SignboardType,
    SignboardStatus,
} from "@/types/signboard";
import { DEMO_PROPERTIES } from "@/types/property";

export default function SignboardsPage() {
    const [signboards, setSignboards] = useState<Signboard[]>(DEMO_SIGNBOARDS);
    const [view, setView] = useState<"list" | "map">("list");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSignboard, setSelectedSignboard] = useState<Signboard | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCheckModal, setShowCheckModal] = useState(false);

    // Kontrol gereken tabelalar
    const needsCheck = useMemo(() => getSignboardsNeedingCheck(signboards), [signboards]);

    // Filtrelenmiş tabelalar
    const filteredSignboards = useMemo(() => {
        return signboards.filter((s) => {
            if (filterStatus && s.status !== filterStatus) return false;
            if (filterType && s.type !== filterType) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    s.location.toLowerCase().includes(query) ||
                    s.property_title?.toLowerCase().includes(query) ||
                    s.address.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [signboards, filterStatus, filterType, searchQuery]);

    // İstatistikler
    const stats = useMemo(() => ({
        total: signboards.length,
        active: signboards.filter((s) => s.status === "aktif").length,
        removed: signboards.filter((s) => s.status === "kaldirildi").length,
        maintenance: signboards.filter((s) => s.status === "bakimda").length,
        totalLeads: signboards.reduce((sum, s) => sum + s.leads_count, 0),
    }), [signboards]);

    // Durum güncelle
    const updateStatus = (id: string, status: SignboardStatus) => {
        setSignboards((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, status, updated_at: new Date().toISOString() }
                    : s
            )
        );
        setSelectedSignboard(null);
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Tabela Takibi</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Fiziksel tabelaları yönetin ve takip edin
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Tabela
                </Button>
            </div>

            {/* Uyarı - Kontrol Gereken Tabelalar */}
            {needsCheck.length > 0 && (
                <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <div className="flex-1">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                    {needsCheck.length} tabela kontrol edilmeli!
                                </p>
                                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                                    Periyodik kontrol tarihi geçmiş tabelalar var
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="border-yellow-400">
                                Kontrolleri Başlat
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* İstatistikler */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-gray-500">Toplam Tabela</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        <p className="text-xs text-gray-500">Aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                        <p className="text-xs text-gray-500">Bakımda</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-600">{stats.removed}</p>
                        <p className="text-xs text-gray-500">Kaldırıldı</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
                        <p className="text-xs text-gray-500">Toplam Lead</p>
                    </CardContent>
                </Card>
            </div>

            {/* Kontroller */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
                        <TabsList>
                            <TabsTrigger value="list">
                                <List className="w-4 h-4 mr-1" />
                                Liste
                            </TabsTrigger>
                            <TabsTrigger value="map">
                                <Map className="w-4 h-4 mr-1" />
                                Harita
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-48"
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Tip" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(SIGNBOARD_TYPES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Durum" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(SIGNBOARD_STATUSES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Liste Görünümü */}
            {view === "list" && (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasyon</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mülk</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlangıç</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sorumlu</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontrol</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredSignboards.map((sign) => {
                                        const typeInfo = SIGNBOARD_TYPES[sign.type];
                                        const statusInfo = SIGNBOARD_STATUSES[sign.status];
                                        const checkDays = sign.next_check ? getDaysDiff(sign.next_check) : null;
                                        const needsCheckNow = checkDays !== null && checkDays <= 0;

                                        return (
                                            <tr
                                                key={sign.id}
                                                className={cn(
                                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                    needsCheckNow && sign.status === "aktif" && "bg-yellow-50 dark:bg-yellow-900/10"
                                                )}
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="font-medium text-sm">{sign.location}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{sign.address}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {sign.property_title ? (
                                                        <Link
                                                            href={`/dashboard/portfolio/${sign.property_id}`}
                                                            className="text-sm text-blue-600 hover:underline line-clamp-1"
                                                        >
                                                            {sign.property_title}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge className={typeInfo.color}>
                                                        {typeInfo.icon} {typeInfo.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    {new Date(sign.start_date).toLocaleDateString("tr-TR")}
                                                </td>
                                                <td className="px-4 py-4 text-sm">{sign.responsible_name}</td>
                                                <td className="px-4 py-4">
                                                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {sign.next_check && sign.status === "aktif" && (
                                                        <div className={cn(
                                                            "text-xs",
                                                            needsCheckNow ? "text-red-600 font-medium" : "text-gray-500"
                                                        )}>
                                                            {needsCheckNow ? (
                                                                <span className="flex items-center gap-1">
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                    Kontrol gerekli!
                                                                </span>
                                                            ) : (
                                                                `${checkDays} gün sonra`
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="secondary">{sign.leads_count}</Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setSelectedSignboard(sign)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Harita Görünümü */}
            {view === "map" && (
                <Card>
                    <CardContent className="p-4">
                        <div className="relative h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {/* Harita Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Map className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-500">Harita Görünümü</p>
                                    <p className="text-sm text-gray-400">Google Maps veya Leaflet entegrasyonu gerekli</p>
                                </div>
                            </div>

                            {/* Tabela pinleri (simüle) */}
                            <div className="absolute inset-0 p-8">
                                <div className="relative w-full h-full">
                                    {filteredSignboards
                                        .filter((s) => s.status === "aktif")
                                        .map((sign, index) => {
                                            // Rastgele pozisyon (gerçek haritada lat/lng kullanılır)
                                            const top = 20 + (index * 15) % 60;
                                            const left = 10 + (index * 20) % 70;

                                            return (
                                                <div
                                                    key={sign.id}
                                                    className="absolute cursor-pointer group"
                                                    style={{ top: `${top}%`, left: `${left}%` }}
                                                    onClick={() => setSelectedSignboard(sign)}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                                                        SIGNBOARD_TYPES[sign.type].color.replace("text-", "ring-2 ring-")
                                                    )}>
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2 min-w-[150px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <p className="text-sm font-medium">{sign.location}</p>
                                                        <p className="text-xs text-gray-500">{sign.property_title || SIGNBOARD_TYPES[sign.type].label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Harita Altı Liste */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {filteredSignboards.filter((s) => s.status === "aktif").slice(0, 3).map((sign) => (
                                <div
                                    key={sign.id}
                                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setSelectedSignboard(sign)}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={SIGNBOARD_TYPES[sign.type].color}>
                                            {SIGNBOARD_TYPES[sign.type].icon}
                                        </Badge>
                                        <span className="font-medium text-sm">{sign.location}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{sign.leads_count} lead</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detay Modal */}
            {selectedSignboard && (
                <SignboardDetailModal
                    signboard={selectedSignboard}
                    onClose={() => setSelectedSignboard(null)}
                    onUpdateStatus={updateStatus}
                    onCheck={() => {
                        setShowCheckModal(true);
                    }}
                />
            )}

            {/* Yeni Tabela Modal */}
            {showAddModal && (
                <AddSignboardModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={(newSign) => {
                        setSignboards((prev) => [newSign, ...prev]);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}

// Detay Modal
function SignboardDetailModal({
    signboard,
    onClose,
    onUpdateStatus,
    onCheck,
}: {
    signboard: Signboard;
    onClose: () => void;
    onUpdateStatus: (id: string, status: SignboardStatus) => void;
    onCheck: () => void;
}) {
    const typeInfo = SIGNBOARD_TYPES[signboard.type];
    const statusInfo = SIGNBOARD_STATUSES[signboard.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Tabela Detayı
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge className={typeInfo.color}>{typeInfo.icon} {typeInfo.label}</Badge>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </div>

                    <div>
                        <p className="font-medium">{signboard.location}</p>
                        <p className="text-sm text-gray-500">{signboard.address}</p>
                    </div>

                    {signboard.property_title && (
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <Link
                                href={`/dashboard/portfolio/${signboard.property_id}`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {signboard.property_title}
                            </Link>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Başlangıç</p>
                            <p className="font-medium">{new Date(signboard.start_date).toLocaleDateString("tr-TR")}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Sorumlu</p>
                            <p className="font-medium">{signboard.responsible_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Son Kontrol</p>
                            <p className="font-medium">
                                {signboard.last_check ? new Date(signboard.last_check).toLocaleDateString("tr-TR") : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Sonraki Kontrol</p>
                            <p className="font-medium">
                                {signboard.next_check ? new Date(signboard.next_check).toLocaleDateString("tr-TR") : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{signboard.leads_count}</p>
                        <p className="text-sm text-gray-500">Lead kazandırdı</p>
                    </div>

                    {signboard.notes && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm">{signboard.notes}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        {signboard.status === "aktif" && (
                            <>
                                <Button variant="outline" onClick={onCheck}>
                                    <Camera className="w-4 h-4 mr-2" />
                                    Kontrol Et
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-yellow-600"
                                    onClick={() => onUpdateStatus(signboard.id, "bakimda")}
                                >
                                    Bakıma Al
                                </Button>
                            </>
                        )}
                        {signboard.status === "bakimda" && (
                            <Button
                                className="col-span-2 bg-green-600"
                                onClick={() => onUpdateStatus(signboard.id, "aktif")}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Aktif Et
                            </Button>
                        )}
                        {signboard.status !== "kaldirildi" && (
                            <Button
                                variant="outline"
                                className="text-red-600 col-span-2"
                                onClick={() => onUpdateStatus(signboard.id, "kaldirildi")}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Kaldırıldı Olarak İşaretle
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Yeni Tabela Ekleme Modal
function AddSignboardModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (signboard: Signboard) => void;
}) {
    const [type, setType] = useState<SignboardType>("satilik");
    const [propertyId, setPropertyId] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [responsibleId, setResponsibleId] = useState("");

    const handleSubmit = () => {
        if (!location || !address || !responsibleId) {
            alert("Lütfen zorunlu alanları doldurun");
            return;
        }

        const property = DEMO_PROPERTIES.find((p) => p.id === propertyId);
        const agent = DEMO_AGENTS.find((a) => a.id === responsibleId);

        const newSignboard: Signboard = {
            id: Date.now().toString(),
            property_id: propertyId || undefined,
            property_title: property?.title,
            type,
            location,
            address,
            lat: 41.0 + Math.random() * 0.1,
            lng: 29.0 + Math.random() * 0.1,
            start_date: new Date().toISOString().split("T")[0],
            responsible_id: responsibleId,
            responsible_name: agent?.name || "",
            status: "aktif",
            next_check: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            leads_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onAdd(newSignboard);
        alert("Tabela eklendi! +20 XP kazandınız! 🎉");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Yeni Tabela Ekle
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tabela Tipi *</Label>
                        <Select value={type} onValueChange={(v) => setType(v as SignboardType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(SIGNBOARD_TYPES).map(([key, { label, icon }]) => (
                                    <SelectItem key={key} value={key}>{icon} {label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Mülk (Opsiyonel)</Label>
                        <Select value={propertyId} onValueChange={setPropertyId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Mülk seçin..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Mülk yok</SelectItem>
                                {DEMO_PROPERTIES.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Lokasyon Adı *</Label>
                        <Input
                            placeholder="örn: Kadıköy Moda Caddesi"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tam Adres *</Label>
                        <Input
                            placeholder="Açık adres..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Sorumlu Danışman *</Label>
                        <Select value={responsibleId} onValueChange={setResponsibleId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Danışman seçin..." />
                            </SelectTrigger>
                            <SelectContent>
                                {DEMO_AGENTS.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            İptal
                        </Button>
                        <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Ekle
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
