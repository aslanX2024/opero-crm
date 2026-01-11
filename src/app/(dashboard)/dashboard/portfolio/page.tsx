"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Plus,
    LayoutGrid,
    List,
    Map,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    MapPin,
    Maximize2,
    BedDouble,
    Eye,
    Edit,
    Trash2,
    Heart,
    Share2,
    Building2,
    Home,
    TreePine,
    Store,
    Castle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
    Property,
    DEMO_PROPERTIES,
    LISTING_TYPES,
    PROPERTY_TYPES,
    PROPERTY_STATUSES,
    ROOM_COUNTS,
    CITIES,
    formatPrice,
    formatPriceShort,
} from "@/types/property";

// Mülk tipi ikonu
function getPropertyIcon(type: Property["property_type"]) {
    switch (type) {
        case "daire": return <Building2 className="w-4 h-4" />;
        case "villa": return <Castle className="w-4 h-4" />;
        case "arsa": return <TreePine className="w-4 h-4" />;
        case "isyeri": return <Store className="w-4 h-4" />;
        case "mustakil": return <Home className="w-4 h-4" />;
        case "residence": return <Building2 className="w-4 h-4" />;
        default: return <Home className="w-4 h-4" />;
    }
}

// Durum rengi
function getStatusColor(status: Property["status"]) {
    switch (status) {
        case "aktif": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "satildi": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        case "kiralandi": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case "pasif": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        default: return "bg-gray-100 text-gray-700";
    }
}

// Portföy sayfası
export default function PortfolioPage() {
    // State
    const [view, setView] = useState<"grid" | "list" | "map">("grid");
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // Filtreler
    const [filters, setFilters] = useState({
        listingType: [] as string[],
        propertyType: [] as string[],
        status: [] as string[],
        city: "",
        roomCount: [] as string[],
        priceRange: [0, 50000000] as [number, number],
    });

    // Filtrelenmiş mülkler
    const filteredProperties = useMemo(() => {
        let result = [...DEMO_PROPERTIES];

        // Arama
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.city.toLowerCase().includes(query) ||
                    p.district.toLowerCase().includes(query) ||
                    p.address.toLowerCase().includes(query)
            );
        }

        // Tür filtresi
        if (filters.listingType.length > 0) {
            result = result.filter((p) => filters.listingType.includes(p.listing_type));
        }

        // Tip filtresi
        if (filters.propertyType.length > 0) {
            result = result.filter((p) => filters.propertyType.includes(p.property_type));
        }

        // Durum filtresi
        if (filters.status.length > 0) {
            result = result.filter((p) => filters.status.includes(p.status));
        }

        // Şehir filtresi
        if (filters.city) {
            result = result.filter((p) => p.city === filters.city);
        }

        // Oda sayısı filtresi
        if (filters.roomCount.length > 0) {
            result = result.filter((p) => filters.roomCount.includes(p.room_count));
        }

        // Fiyat aralığı filtresi
        result = result.filter(
            (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );

        // Sıralama
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case "views":
                result.sort((a, b) => b.views - a.views);
                break;
        }

        return result;
    }, [searchQuery, filters, sortBy]);

    // Checkbox toggle
    const toggleFilter = (key: keyof typeof filters, value: string) => {
        const current = filters[key] as string[];
        if (current.includes(value)) {
            setFilters({ ...filters, [key]: current.filter((v) => v !== value) });
        } else {
            setFilters({ ...filters, [key]: [...current, value] });
        }
    };

    // Filtreleri temizle
    const clearFilters = () => {
        setFilters({
            listingType: [],
            propertyType: [],
            status: [],
            city: "",
            roomCount: [],
            priceRange: [0, 50000000],
        });
        setSearchQuery("");
    };

    return (
        <div className="space-y-6">
            {/* Başlık ve Aksiyonlar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Portföy</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredProperties.length} mülk listeleniyor
                    </p>
                </div>
                <Link href="/dashboard/portfolio/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Mülk Ekle
                    </Button>
                </Link>
            </div>

            {/* Arama ve Görünüm */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Arama */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Mülk ara (başlık, konum, adres...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Sıralama */}
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">En Yeni</SelectItem>
                        <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
                        <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
                        <SelectItem value="views">En Çok Görüntülenen</SelectItem>
                    </SelectContent>
                </Select>

                {/* Görünüm Değiştirici */}
                <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
                    <TabsList>
                        <TabsTrigger value="grid" className="px-3">
                            <LayoutGrid className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="list" className="px-3">
                            <List className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="map" className="px-3">
                            <Map className="w-4 h-4" />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Filtre Butonu */}
                <Button
                    variant="outline"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={cn(filterOpen && "bg-blue-50 border-blue-200 dark:bg-blue-900/20")}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrele
                    {filterOpen ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                </Button>
            </div>

            {/* Filtre Paneli */}
            <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
                <CollapsibleContent>
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Tür */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Tür</Label>
                                    <div className="space-y-2">
                                        {Object.entries(LISTING_TYPES).map(([key, label]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`listing-${key}`}
                                                    checked={filters.listingType.includes(key)}
                                                    onCheckedChange={() => toggleFilter("listingType", key)}
                                                />
                                                <Label htmlFor={`listing-${key}`} className="text-sm font-normal cursor-pointer">
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tip */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Mülk Tipi</Label>
                                    <div className="space-y-2">
                                        {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${key}`}
                                                    checked={filters.propertyType.includes(key)}
                                                    onCheckedChange={() => toggleFilter("propertyType", key)}
                                                />
                                                <Label htmlFor={`type-${key}`} className="text-sm font-normal cursor-pointer">
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Durum */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Durum</Label>
                                    <div className="space-y-2">
                                        {Object.entries(PROPERTY_STATUSES).map(([key, label]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`status-${key}`}
                                                    checked={filters.status.includes(key)}
                                                    onCheckedChange={() => toggleFilter("status", key)}
                                                />
                                                <Label htmlFor={`status-${key}`} className="text-sm font-normal cursor-pointer">
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Şehir ve Oda */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Şehir</Label>
                                        <Select
                                            value={filters.city}
                                            onValueChange={(v) => setFilters({ ...filters, city: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tüm şehirler" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tüm Şehirler</SelectItem>
                                                {CITIES.map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Oda Sayısı</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {ROOM_COUNTS.slice(0, 6).map((room) => (
                                                <Button
                                                    key={room}
                                                    variant={filters.roomCount.includes(room) ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => toggleFilter("roomCount", room)}
                                                >
                                                    {room}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fiyat Aralığı */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Fiyat Aralığı</Label>
                                    <span className="text-sm text-gray-500">
                                        {formatPriceShort(filters.priceRange[0])} - {formatPriceShort(filters.priceRange[1])}
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={filters.priceRange}
                                    min={0}
                                    max={50000000}
                                    step={500000}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, priceRange: value as [number, number] })
                                    }
                                />
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

            {/* Grid Görünümü */}
            {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <Link key={property.id} href={`/dashboard/portfolio/${property.id}`}>
                            <PropertyCard property={property} />
                        </Link>
                    ))}
                </div>
            )}

            {/* Liste Görünümü */}
            {view === "list" && (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Mülk
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Konum
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fiyat
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Özellikler
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Durum
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Görüntülenme
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        İşlem
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProperties.map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                                                    {getPropertyIcon(property.property_type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{property.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {LISTING_TYPES[property.listing_type]} • {PROPERTY_TYPES[property.property_type]}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm">{property.district}</p>
                                            <p className="text-xs text-gray-500">{property.city}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-sm">{formatPrice(property.price, property.currency)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm">
                                                {property.room_count} • {property.gross_area} m²
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge className={getStatusColor(property.status)}>
                                                {PROPERTY_STATUSES[property.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Eye className="w-4 h-4" />
                                                {property.views}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Harita Görünümü */}
            {view === "map" && (
                <Card className="h-[600px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Harita Görünümü</p>
                        <p className="text-sm">Leaflet entegrasyonu için konfigürasyon gerekli</p>
                    </div>
                </Card>
            )}

            {/* Boş durum */}
            {filteredProperties.length === 0 && (
                <Card className="p-12 text-center">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Mülk Bulunamadı</h3>
                    <p className="text-gray-500 mb-4">
                        Arama kriterlerinize uygun mülk bulunamadı.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                        Filtreleri Temizle
                    </Button>
                </Card>
            )}

            {/* Pagination */}
            {filteredProperties.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Toplam {filteredProperties.length} mülk
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                            Önceki
                        </Button>
                        <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">
                            1
                        </Button>
                        <Button variant="outline" size="sm">
                            2
                        </Button>
                        <Button variant="outline" size="sm">
                            Sonraki
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Mülk Kartı Bileşeni
function PropertyCard({ property }: { property: Property }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Görsel */}
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                {/* Placeholder görsel */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {getPropertyIcon(property.property_type)}
                    <span className="ml-2 text-gray-500">{PROPERTY_TYPES[property.property_type]}</span>
                </div>

                {/* Tür etiketi */}
                <div className="absolute top-3 left-3">
                    <Badge
                        className={cn(
                            "text-xs",
                            property.listing_type === "satilik"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-orange-500 hover:bg-orange-600"
                        )}
                    >
                        {LISTING_TYPES[property.listing_type]}
                    </Badge>
                </div>

                {/* Durum etiketi */}
                <div className="absolute top-3 right-3">
                    <Badge className={cn("text-xs", getStatusColor(property.status))}>
                        {PROPERTY_STATUSES[property.status]}
                    </Badge>
                </div>

                {/* Hover aksiyonları */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                        <Eye className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                        <Edit className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                        <Heart className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>

                {/* Fiyat */}
                <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(property.price, property.currency)}
                        </p>
                    </div>
                </div>
            </div>

            {/* İçerik */}
            <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

                {/* Konum */}
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{property.district}, {property.city}</span>
                </div>

                {/* Özellikler */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <BedDouble className="w-4 h-4" />
                        <span>{property.room_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Maximize2 className="w-4 h-4" />
                        <span>{property.gross_area} m²</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{property.views}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
