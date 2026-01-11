"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, X, ChevronDown, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    TURKEY_LOCATIONS,
    getCityById,
    getDistrictById,
    SelectedLocation,
    formatLocationLabel,
} from "@/types/location";

interface LocationSelectorProps {
    value: SelectedLocation[];
    onChange: (locations: SelectedLocation[]) => void;
    maxSelections?: number;
    placeholder?: string;
    showNeighborhoods?: boolean;
}

export function LocationSelector({
    value = [],
    onChange,
    maxSelections = 10,
    placeholder = "Bölge seçin...",
    showNeighborhoods = true,
}: LocationSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

    // Şehir değiştiğinde ilçeyi sıfırla
    useEffect(() => {
        setSelectedDistrict("");
        setSelectedNeighborhood("");
    }, [selectedCity]);

    // İlçe değiştiğinde mahalleyi sıfırla
    useEffect(() => {
        setSelectedNeighborhood("");
    }, [selectedDistrict]);

    const city = useMemo(() => getCityById(selectedCity), [selectedCity]);
    const district = useMemo(
        () => getDistrictById(selectedCity, selectedDistrict),
        [selectedCity, selectedDistrict]
    );

    // Lokasyon ekle
    const handleAddLocation = useCallback(() => {
        if (!selectedCity) return;

        const cityData = city;
        if (!cityData) return;

        const newLocation: SelectedLocation = {
            cityId: selectedCity,
            cityName: cityData.name,
        };

        if (selectedDistrict) {
            const districtData = getDistrictById(selectedCity, selectedDistrict);
            if (districtData) {
                newLocation.districtId = selectedDistrict;
                newLocation.districtName = districtData.name;
            }
        }

        if (selectedNeighborhood && showNeighborhoods) {
            const neighborhoodData = district?.neighborhoods.find(
                (n) => n.id === selectedNeighborhood
            );
            if (neighborhoodData) {
                newLocation.neighborhoodId = selectedNeighborhood;
                newLocation.neighborhoodName = neighborhoodData.name;
            }
        }

        // Duplicate kontrolü
        const isDuplicate = value.some(
            (loc) =>
                loc.cityId === newLocation.cityId &&
                loc.districtId === newLocation.districtId &&
                loc.neighborhoodId === newLocation.neighborhoodId
        );

        if (!isDuplicate && value.length < maxSelections) {
            onChange([...value, newLocation]);
            // Seçimleri sıfırla
            setSelectedCity("");
            setSelectedDistrict("");
            setSelectedNeighborhood("");
        }
    }, [
        selectedCity,
        selectedDistrict,
        selectedNeighborhood,
        showNeighborhoods,
        value,
        maxSelections,
        onChange,
        city,
        district,
    ]);

    // Lokasyon sil
    const handleRemoveLocation = useCallback((index: number) => {
        const newLocations = [...value];
        newLocations.splice(index, 1);
        onChange(newLocations);
    }, [value, onChange]);

    return (
        <div className="space-y-3">
            {/* Seçili Lokasyonlar */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((location, index) => (
                        <Badge
                            key={`${location.cityId}-${location.districtId}-${location.neighborhoodId}-${index}`}
                            variant="secondary"
                            className="pl-2 pr-1 py-1 text-sm flex items-center gap-1"
                        >
                            <MapPin className="w-3 h-3" />
                            {formatLocationLabel(location)}
                            <button
                                type="button"
                                onClick={() => handleRemoveLocation(index)}
                                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Seçici */}
            {value.length < maxSelections && (
                <Card className="border-dashed">
                    <CardContent className="p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            {/* Şehir */}
                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Şehir" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TURKEY_LOCATIONS.map((city) => (
                                        <SelectItem key={city.id} value={city.id}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* İlçe */}
                            <Select
                                value={selectedDistrict}
                                onValueChange={setSelectedDistrict}
                                disabled={!selectedCity}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="İlçe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {city?.districts.map((district) => (
                                        <SelectItem key={district.id} value={district.id}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Mahalle */}
                            {showNeighborhoods && (
                                <Select
                                    value={selectedNeighborhood}
                                    onValueChange={setSelectedNeighborhood}
                                    disabled={!selectedDistrict}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mahalle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {district?.neighborhoods.map((neighborhood) => (
                                            <SelectItem key={neighborhood.id} value={neighborhood.id}>
                                                {neighborhood.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Ekle Butonu */}
                            <Button
                                type="button"
                                onClick={handleAddLocation}
                                disabled={!selectedCity}
                                className="bg-blue-600"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Ekle
                            </Button>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            {value.length}/{maxSelections} bölge seçildi
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Hızlı seçim için tek lokasyon seçici (dropdown)
interface SingleLocationSelectorProps {
    value: SelectedLocation | null;
    onChange: (location: SelectedLocation | null) => void;
    showNeighborhoods?: boolean;
}

export function SingleLocationSelector({
    value,
    onChange,
    showNeighborhoods = true,
}: SingleLocationSelectorProps) {
    const [selectedCity, setSelectedCity] = useState(value?.cityId || "");
    const [selectedDistrict, setSelectedDistrict] = useState(value?.districtId || "");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(value?.neighborhoodId || "");

    const city = getCityById(selectedCity);
    const district = getDistrictById(selectedCity, selectedDistrict);

    // City değiştiğinde
    useEffect(() => {
        if (selectedCity) {
            const cityData = getCityById(selectedCity);
            if (cityData) {
                onChange({
                    cityId: selectedCity,
                    cityName: cityData.name,
                    districtId: undefined,
                    districtName: undefined,
                    neighborhoodId: undefined,
                    neighborhoodName: undefined,
                });
            }
        } else {
            onChange(null);
        }
        setSelectedDistrict("");
        setSelectedNeighborhood("");
    }, [selectedCity]);

    // District değiştiğinde
    useEffect(() => {
        if (selectedCity && selectedDistrict) {
            const cityData = getCityById(selectedCity);
            const districtData = getDistrictById(selectedCity, selectedDistrict);
            if (cityData && districtData) {
                onChange({
                    cityId: selectedCity,
                    cityName: cityData.name,
                    districtId: selectedDistrict,
                    districtName: districtData.name,
                    neighborhoodId: undefined,
                    neighborhoodName: undefined,
                });
            }
        }
        setSelectedNeighborhood("");
    }, [selectedDistrict]);

    // Neighborhood değiştiğinde
    useEffect(() => {
        if (selectedCity && selectedDistrict && selectedNeighborhood) {
            const cityData = getCityById(selectedCity);
            const districtData = getDistrictById(selectedCity, selectedDistrict);
            const neighborhoodData = districtData?.neighborhoods.find(
                (n) => n.id === selectedNeighborhood
            );
            if (cityData && districtData && neighborhoodData) {
                onChange({
                    cityId: selectedCity,
                    cityName: cityData.name,
                    districtId: selectedDistrict,
                    districtName: districtData.name,
                    neighborhoodId: selectedNeighborhood,
                    neighborhoodName: neighborhoodData.name,
                });
            }
        }
    }, [selectedNeighborhood]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Şehir */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin..." />
                </SelectTrigger>
                <SelectContent>
                    {TURKEY_LOCATIONS.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                            {city.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* İlçe */}
            <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedCity}
            >
                <SelectTrigger>
                    <SelectValue placeholder="İlçe seçin..." />
                </SelectTrigger>
                <SelectContent>
                    {city?.districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                            {district.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Mahalle */}
            {showNeighborhoods && (
                <Select
                    value={selectedNeighborhood}
                    onValueChange={setSelectedNeighborhood}
                    disabled={!selectedDistrict}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Mahalle seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                        {district?.neighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood.id} value={neighborhood.id}>
                                {neighborhood.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}
