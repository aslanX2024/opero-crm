"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/lib/services/properties";
import { formatPrice } from "@/types/property";
import { Building2, MapPin, BedDouble, Maximize2 } from "lucide-react";

// Türkiye merkezi
const TURKEY_CENTER: [number, number] = [39.0, 35.0];
const DEFAULT_ZOOM = 6;

// İstanbul merkezi (varsayılan)
const ISTANBUL_CENTER: [number, number] = [41.0082, 28.9784];

// Custom marker icon oluştur
const createPropertyIcon = (isActive: boolean = true) => {
    return L.divIcon({
        className: "custom-marker",
        html: `
            <div class="relative">
                <div class="w-8 h-8 ${isActive ? "bg-blue-600" : "bg-gray-400"} rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isActive ? "bg-blue-600" : "bg-gray-400"} rotate-45"></div>
            </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    });
};

// Harita merkezini ayarla
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
}

// Props tipi
interface MapViewProps {
    properties: Property[];
    onPropertyClick?: (property: Property) => void;
    selectedPropertyId?: string;
    height?: string;
}

// Ana harita bileşeni
export default function MapView({
    properties,
    onPropertyClick,
    selectedPropertyId,
    height = "600px",
}: MapViewProps) {
    const mapRef = useRef<L.Map | null>(null);

    // Koordinatı olan mülkler
    const propertiesWithLocation = properties.filter(
        (p) => p.latitude && p.longitude
    );

    // Merkez hesapla
    const calculateCenter = (): [number, number] => {
        if (propertiesWithLocation.length === 0) {
            return ISTANBUL_CENTER;
        }

        if (propertiesWithLocation.length === 1) {
            return [
                propertiesWithLocation[0].latitude!,
                propertiesWithLocation[0].longitude!,
            ];
        }

        // Ortalama
        const avgLat =
            propertiesWithLocation.reduce((sum, p) => sum + (p.latitude || 0), 0) /
            propertiesWithLocation.length;
        const avgLng =
            propertiesWithLocation.reduce((sum, p) => sum + (p.longitude || 0), 0) /
            propertiesWithLocation.length;

        return [avgLat, avgLng];
    };

    const center = calculateCenter();
    const zoom = propertiesWithLocation.length <= 1 ? 14 : 10;

    return (
        <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={center} zoom={zoom} />

                {propertiesWithLocation.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.latitude!, property.longitude!]}
                        icon={createPropertyIcon(property.status === "aktif")}
                        eventHandlers={{
                            click: () => onPropertyClick?.(property),
                        }}
                    >
                        <Popup>
                            <div className="min-w-[200px] p-1">
                                <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                                    {property.title}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>{property.district}, {property.city}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="flex items-center gap-1">
                                        <BedDouble className="w-3 h-3" />
                                        {property.room_count || "-"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Maximize2 className="w-3 h-3" />
                                        {property.gross_area || "-"} m²
                                    </span>
                                </div>
                                <div className="text-blue-600 font-bold text-sm">
                                    {formatPrice(property.price, property.currency)}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Bilgi overlay - koordinatı olmayan mülkler için */}
            {properties.length > 0 && propertiesWithLocation.length === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center max-w-sm mx-4">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Konum Bilgisi Yok</h3>
                        <p className="text-sm text-gray-500">
                            Mülklerinize konum bilgisi ekleyerek harita üzerinde görüntüleyebilirsiniz.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
