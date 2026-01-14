"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// İstanbul varsayılan merkez
const DEFAULT_CENTER: [number, number] = [41.0082, 28.9784];
const DEFAULT_ZOOM = 12;

// Seçim marker ikonu
const selectionIcon = L.divIcon({
    className: "custom-marker",
    html: `
        <div class="relative animate-bounce">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rotate-45"></div>
        </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
});

// Harita merkez kontrol
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1 });
    }, [map, center, zoom]);

    return null;
}

// Harita tıklama olayı
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

interface MapLocationPickerProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
    height?: string;
}

export default function MapLocationPicker({
    latitude,
    longitude,
    onChange,
    height = "300px",
}: MapLocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [center, setCenter] = useState<[number, number]>(
        latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER
    );

    // Marker pozisyonu
    const markerPosition: [number, number] | null =
        latitude && longitude ? [latitude, longitude] : null;

    // Konum seç
    const handleLocationSelect = (lat: number, lng: number) => {
        onChange(lat, lng);
        setCenter([lat, lng]);
    };

    // Mevcut konumu al
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Tarayıcınız konum servisini desteklemiyor.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                handleLocationSelect(lat, lng);
            },
            (error) => {
                console.error("Konum alınamadı:", error);
                alert("Konum alınamadı. Lütfen konum izinlerini kontrol edin.");
            }
        );
    };

    // Adresi ara (basit OpenStreetMap Nominatim kullanımı)
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    searchQuery
                )}&format=json&limit=1&countrycodes=tr`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                handleLocationSelect(parseFloat(lat), parseFloat(lon));
            } else {
                alert("Adres bulunamadı. Lütfen farklı bir arama deneyin.");
            }
        } catch (error) {
            console.error("Arama hatası:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Arama ve konum butonları */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Adres veya yer ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                    className="shrink-0"
                >
                    <Navigation className="w-4 h-4 mr-2" />
                    Konumum
                </Button>
            </div>

            {/* Harita */}
            <div
                style={{ height }}
                className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative"
            >
                <MapContainer
                    center={center}
                    zoom={DEFAULT_ZOOM}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController center={center} zoom={DEFAULT_ZOOM} />
                    <MapClickHandler onSelect={handleLocationSelect} />

                    {markerPosition && (
                        <Marker position={markerPosition} icon={selectionIcon} />
                    )}
                </MapContainer>

                {/* Yardım overlay */}
                {!markerPosition && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg px-4 py-2 text-center text-sm shadow-lg">
                        <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                        Haritaya tıklayarak konum seçin
                    </div>
                )}
            </div>

            {/* Koordinat görüntüleme */}
            {markerPosition && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>
                        Seçilen konum: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                    </span>
                </div>
            )}
        </div>
    );
}
