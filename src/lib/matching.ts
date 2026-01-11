// Müşteri-Mülk Eşleştirme Algoritması

import { Customer } from "@/types/customer";
import { Property } from "@/types/property";

// Eşleştirme kriterleri ve ağırlıkları
export const MATCHING_WEIGHTS = {
    budget: 0.30,      // Bütçe aralığı (%30)
    region: 0.25,      // Tercih edilen bölge (%25)
    propertyType: 0.20, // Mülk tipi (%20)
    roomCount: 0.15,    // Oda sayısı (%15)
    features: 0.10,     // İstenen özellikler (%10)
};

// Eşleştirme sonucu arayüzü
export interface MatchResult {
    property: Property;
    matchScore: number;
    matchDetails: {
        budget: { matched: boolean; score: number; details: string };
        region: { matched: boolean; score: number; details: string };
        propertyType: { matched: boolean; score: number; details: string };
        roomCount: { matched: boolean; score: number; details: string };
        features: { matched: boolean; score: number; details: string };
    };
}

// Bütçe eşleştirme
function matchBudget(customer: Customer, property: Property): { matched: boolean; score: number; details: string } {
    const price = property.price;
    const min = customer.budget_min;
    const max = customer.budget_max;

    if (price >= min && price <= max) {
        return { matched: true, score: 100, details: "Bütçe aralığında" };
    }

    // Bütçeye yakınlık hesapla
    if (price < min) {
        const diff = ((min - price) / min) * 100;
        if (diff <= 10) return { matched: true, score: 80, details: "Bütçenin %10 altında" };
        if (diff <= 20) return { matched: false, score: 50, details: "Bütçenin %20 altında" };
        return { matched: false, score: 0, details: "Bütçenin çok altında" };
    }

    if (price > max) {
        const diff = ((price - max) / max) * 100;
        if (diff <= 10) return { matched: true, score: 70, details: "Bütçeyi %10 aşıyor" };
        if (diff <= 20) return { matched: false, score: 40, details: "Bütçeyi %20 aşıyor" };
        return { matched: false, score: 0, details: "Bütçenin çok üstünde" };
    }

    return { matched: false, score: 0, details: "Bütçe uyumsuz" };
}

// Bölge eşleştirme
function matchRegion(customer: Customer, property: Property): { matched: boolean; score: number; details: string } {
    const preferredRegions = customer.preferred_regions.map(r => r.toLowerCase());
    const propertyDistrict = property.district.toLowerCase();
    const propertyCity = property.city.toLowerCase();

    // Tam eşleşme
    if (preferredRegions.some(r => propertyDistrict.includes(r) || r.includes(propertyDistrict))) {
        return { matched: true, score: 100, details: `${property.district} tercih edilen bölgede` };
    }

    // Şehir eşleşmesi
    if (preferredRegions.some(r => propertyCity.includes(r) || r.includes(propertyCity))) {
        return { matched: true, score: 60, details: `${property.city} şehrinde` };
    }

    return { matched: false, score: 0, details: "Tercih edilen bölgede değil" };
}

// Mülk tipi eşleştirme
function matchPropertyType(customer: Customer, property: Property): { matched: boolean; score: number; details: string } {
    const preferredTypes = customer.preferred_property_types;

    if (preferredTypes.length === 0) {
        return { matched: true, score: 50, details: "Tip tercihi belirtilmemiş" };
    }

    if (preferredTypes.includes(property.property_type)) {
        return { matched: true, score: 100, details: "Mülk tipi uyuşuyor" };
    }

    return { matched: false, score: 0, details: "Mülk tipi uyuşmuyor" };
}

// Oda sayısı eşleştirme
function matchRoomCount(customer: Customer, property: Property): { matched: boolean; score: number; details: string } {
    const preferredRooms = customer.preferred_room_counts;

    if (preferredRooms.length === 0) {
        return { matched: true, score: 50, details: "Oda tercihi belirtilmemiş" };
    }

    if (preferredRooms.includes(property.room_count)) {
        return { matched: true, score: 100, details: `${property.room_count} tercih ediliyor` };
    }

    // Yakın oda sayısı kontrolü (örn: 3+1 istiyorsa 2+1 veya 4+1 de kabul edilebilir)
    const roomNumber = parseInt(property.room_count.split("+")[0]);
    const hasClose = preferredRooms.some(r => {
        const prefNum = parseInt(r.split("+")[0]);
        return Math.abs(roomNumber - prefNum) === 1;
    });

    if (hasClose) {
        return { matched: true, score: 60, details: `${property.room_count} yakın değer` };
    }

    return { matched: false, score: 0, details: "Oda sayısı uyuşmuyor" };
}

// Özellik eşleştirme
function matchFeatures(customer: Customer, property: Property): { matched: boolean; score: number; details: string } {
    // Müşterinin istediği özellikler ile mülkün özellikleri
    const customerFeatures: Record<string, boolean> = {
        elevator: property.has_elevator,
        parking: property.has_parking,
        balcony: property.has_balcony,
        complex: property.is_in_complex,
        furnished: property.is_furnished,
        credit: property.is_credit_eligible,
    };

    // Varsayılan olarak tüm özellikleri kontrol et
    const matchedFeatures: string[] = [];
    const missingFeatures: string[] = [];

    if (property.has_elevator) matchedFeatures.push("Asansör");
    if (property.has_parking) matchedFeatures.push("Otopark");
    if (property.has_balcony) matchedFeatures.push("Balkon");
    if (property.is_in_complex) matchedFeatures.push("Site İçi");

    const totalFeatures = Object.values(customerFeatures).filter(v => v).length;
    const score = totalFeatures > 0 ? (matchedFeatures.length / 6) * 100 : 50;

    if (matchedFeatures.length >= 3) {
        return { matched: true, score: Math.min(score, 100), details: `${matchedFeatures.length} özellik mevcut` };
    }

    if (matchedFeatures.length > 0) {
        return { matched: true, score: score, details: `${matchedFeatures.join(", ")}` };
    }

    return { matched: false, score: 30, details: "Az özellik mevcut" };
}

// Ana eşleştirme fonksiyonu
export function calculateMatch(customer: Customer, property: Property): MatchResult {
    const budgetMatch = matchBudget(customer, property);
    const regionMatch = matchRegion(customer, property);
    const propertyTypeMatch = matchPropertyType(customer, property);
    const roomCountMatch = matchRoomCount(customer, property);
    const featuresMatch = matchFeatures(customer, property);

    // Ağırlıklı skor hesaplama
    const matchScore = Math.round(
        budgetMatch.score * MATCHING_WEIGHTS.budget +
        regionMatch.score * MATCHING_WEIGHTS.region +
        propertyTypeMatch.score * MATCHING_WEIGHTS.propertyType +
        roomCountMatch.score * MATCHING_WEIGHTS.roomCount +
        featuresMatch.score * MATCHING_WEIGHTS.features
    );

    return {
        property,
        matchScore,
        matchDetails: {
            budget: budgetMatch,
            region: regionMatch,
            propertyType: propertyTypeMatch,
            roomCount: roomCountMatch,
            features: featuresMatch,
        },
    };
}

// Müşteri için eşleşen mülkleri bul
export function findMatchingProperties(customer: Customer, properties: Property[]): MatchResult[] {
    // Sadece aktif mülkleri kontrol et
    const activeProperties = properties.filter(p => p.status === "aktif");

    // Tüm mülkler için eşleştirme yap
    const matches = activeProperties.map(property => calculateMatch(customer, property));

    // Skora göre sırala (yüksekten düşüğe)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches;
}

// Mülk için eşleşen müşterileri bul
export function findMatchingCustomers(property: Property, customers: Customer[]): Array<{ customer: Customer; matchScore: number }> {
    const matches = customers
        .filter(c => c.status !== "donusmus" && c.status !== "pasif")
        .map(customer => {
            const result = calculateMatch(customer, property);
            return { customer, matchScore: result.matchScore };
        });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches;
}

// Eşleşme skoru rengi
export function getMatchScoreColor(score: number): string {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-emerald-500 text-white";
    if (score >= 40) return "bg-yellow-500 text-white";
    if (score >= 20) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
}

// Eşleşme skoru etiketi
export function getMatchScoreLabel(score: number): string {
    if (score >= 80) return "Mükemmel Eşleşme";
    if (score >= 60) return "İyi Eşleşme";
    if (score >= 40) return "Orta Eşleşme";
    if (score >= 20) return "Düşük Eşleşme";
    return "Zayıf Eşleşme";
}
