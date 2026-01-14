"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Property } from "@/lib/services/properties";

// MapView'i SSR olmadan dinamik import et
// Leaflet window nesnesine ihtiyaç duyar, bu yüzden sadece client-side'da yüklenmeli
const MapView = dynamic(() => import("./map-view"), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Harita yükleniyor...</p>
            </div>
        </div>
    ),
});

// Props tipi
interface DynamicMapProps {
    properties: Property[];
    onPropertyClick?: (property: Property) => void;
    selectedPropertyId?: string;
    height?: string;
}

// Re-export wrapper
export default function DynamicMap(props: DynamicMapProps) {
    return <MapView {...props} />;
}
