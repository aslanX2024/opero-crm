"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// MapLocationPicker'ı SSR olmadan dinamik import et
const MapLocationPicker = dynamic(() => import("./map-location-picker"), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Harita yükleniyor...</p>
            </div>
        </div>
    ),
});

// Props tipi
interface DynamicLocationPickerProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
    height?: string;
}

// Re-export wrapper
export default function DynamicLocationPicker(props: DynamicLocationPickerProps) {
    return <MapLocationPicker {...props} />;
}
