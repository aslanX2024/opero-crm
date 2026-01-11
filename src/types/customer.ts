// Müşteri/Lead tipleri ve sabit değerler

// Müşteri tipi
export type CustomerType = "alici" | "satici" | "kiraci" | "yatirimci";

// Müşteri durumu
export type CustomerStatus = "yeni" | "iletisimde" | "aktif" | "donusmus" | "pasif";

// Lead kaynağı
export type LeadSource = "sahibinden" | "hepsiemlak" | "website" | "referans" | "walkin" | "telefon" | "sosyal_medya";

// Müşteri arayüzü
export interface Customer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    customer_type: CustomerType;
    status: CustomerStatus;
    lead_source: LeadSource;
    lead_score: number;

    // Tercihler
    preferred_regions: string[];
    budget_min: number;
    budget_max: number;
    preferred_property_types: string[];
    preferred_room_counts: string[];

    // İletişim
    last_contact_date: string;
    next_follow_up?: string;
    total_showings: number;
    total_offers: number;

    // Notlar
    notes?: string;

    // Meta
    assigned_to?: string;
    created_at: string;
    updated_at: string;
}

// Sabit değerler - Türkçe etiketler
export const CUSTOMER_TYPES: Record<CustomerType, string> = {
    alici: "Alıcı",
    satici: "Satıcı",
    kiraci: "Kiracı",
    yatirimci: "Yatırımcı",
};

export const CUSTOMER_STATUSES: Record<CustomerStatus, string> = {
    yeni: "Yeni",
    iletisimde: "İletişimde",
    aktif: "Aktif",
    donusmus: "Dönüşmüş",
    pasif: "Pasif",
};

export const LEAD_SOURCES: Record<LeadSource, string> = {
    sahibinden: "Sahibinden.com",
    hepsiemlak: "Hepsiemlak.com",
    website: "Website Formu",
    referans: "Referans",
    walkin: "Walk-in",
    telefon: "Telefon",
    sosyal_medya: "Sosyal Medya",
};

// Lead skor kategorileri
export function getLeadScoreCategory(score: number): "hot" | "warm" | "cold" {
    if (score >= 70) return "hot";
    if (score >= 40) return "warm";
    return "cold";
}

export function getLeadScoreLabel(score: number): string {
    if (score >= 70) return "Sıcak";
    if (score >= 40) return "Ilık";
    return "Soğuk";
}

export function getLeadScoreColor(score: number): string {
    if (score >= 70) return "bg-green-500 text-white";
    if (score >= 40) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
}

// Son iletişim uyarısı (7 gün+)
export function isContactOverdue(lastContactDate: string): boolean {
    const last = new Date(lastContactDate);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
}

export function getDaysSinceContact(lastContactDate: string): number {
    const last = new Date(lastContactDate);
    const now = new Date();
    return Math.ceil((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

// Demo müşteriler
export const DEMO_CUSTOMERS: Customer[] = [
    {
        id: "1",
        full_name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "0532 111 22 33",
        customer_type: "alici",
        status: "aktif",
        lead_source: "referans",
        lead_score: 85,
        preferred_regions: ["Kadıköy", "Ataşehir"],
        budget_min: 3000000,
        budget_max: 5000000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["3+1", "4+1"],
        last_contact_date: "2026-01-06",
        next_follow_up: "2026-01-10",
        total_showings: 4,
        total_offers: 1,
        notes: "3+1 veya 4+1 arıyor, asansörlü bina şart",
        created_at: "2025-12-01T10:00:00Z",
        updated_at: "2026-01-06T14:30:00Z",
    },
    {
        id: "2",
        full_name: "Fatma Demir",
        email: "fatma@example.com",
        phone: "0533 222 33 44",
        customer_type: "satici",
        status: "iletisimde",
        lead_source: "website",
        lead_score: 72,
        preferred_regions: ["Beşiktaş"],
        budget_min: 8000000,
        budget_max: 10000000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["2+1"],
        last_contact_date: "2026-01-07",
        total_showings: 0,
        total_offers: 0,
        notes: "Beşiktaş'ta 2+1 dairesi var, satmak istiyor",
        created_at: "2026-01-02T09:00:00Z",
        updated_at: "2026-01-07T11:00:00Z",
    },
    {
        id: "3",
        full_name: "Mehmet Kaya",
        email: "mehmet@example.com",
        phone: "0544 333 44 55",
        customer_type: "kiraci",
        status: "yeni",
        lead_source: "sahibinden",
        lead_score: 45,
        preferred_regions: ["Şişli", "Mecidiyeköy"],
        budget_min: 15000,
        budget_max: 25000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["1+1", "2+1"],
        last_contact_date: "2025-12-28",
        total_showings: 1,
        total_offers: 0,
        notes: "Metro yakını olmalı",
        created_at: "2025-12-28T14:00:00Z",
        updated_at: "2025-12-28T14:00:00Z",
    },
    {
        id: "4",
        full_name: "Ayşe Öztürk",
        email: "ayse@example.com",
        phone: "0555 444 55 66",
        customer_type: "yatirimci",
        status: "aktif",
        lead_source: "referans",
        lead_score: 92,
        preferred_regions: ["Ataşehir", "Fikirtepe"],
        budget_min: 10000000,
        budget_max: 20000000,
        preferred_property_types: ["daire", "residence"],
        preferred_room_counts: ["2+1", "3+1"],
        last_contact_date: "2026-01-08",
        next_follow_up: "2026-01-12",
        total_showings: 8,
        total_offers: 3,
        notes: "Yatırım amaçlı, kira getirisi önemli",
        created_at: "2025-11-15T10:00:00Z",
        updated_at: "2026-01-08T09:00:00Z",
    },
    {
        id: "5",
        full_name: "Ali Çelik",
        email: "ali@example.com",
        phone: "0532 555 66 77",
        customer_type: "alici",
        status: "yeni",
        lead_source: "hepsiemlak",
        lead_score: 35,
        preferred_regions: ["Kartal"],
        budget_min: 2000000,
        budget_max: 3000000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["2+1"],
        last_contact_date: "2025-12-20",
        total_showings: 0,
        total_offers: 0,
        created_at: "2025-12-20T16:00:00Z",
        updated_at: "2025-12-20T16:00:00Z",
    },
    {
        id: "6",
        full_name: "Zeynep Arslan",
        email: "zeynep@example.com",
        phone: "0544 666 77 88",
        customer_type: "alici",
        status: "donusmus",
        lead_source: "referans",
        lead_score: 100,
        preferred_regions: ["Kadıköy"],
        budget_min: 4000000,
        budget_max: 5500000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["3+1"],
        last_contact_date: "2026-01-05",
        total_showings: 6,
        total_offers: 2,
        notes: "Kadıköy Moda'da 3+1 satın aldı!",
        created_at: "2025-10-10T10:00:00Z",
        updated_at: "2026-01-05T15:00:00Z",
    },
    {
        id: "7",
        full_name: "Can Yıldız",
        email: "can@example.com",
        phone: "0533 777 88 99",
        customer_type: "kiraci",
        status: "iletisimde",
        lead_source: "sosyal_medya",
        lead_score: 55,
        preferred_regions: ["Üsküdar", "Çengelköy"],
        budget_min: 20000,
        budget_max: 35000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["2+1", "3+1"],
        last_contact_date: "2026-01-03",
        total_showings: 2,
        total_offers: 0,
        notes: "Bahçeli veya teraslı olursa iyi olur",
        created_at: "2025-12-25T11:00:00Z",
        updated_at: "2026-01-03T10:00:00Z",
    },
    {
        id: "8",
        full_name: "Deniz Koç",
        email: "deniz@example.com",
        phone: "0555 888 99 00",
        customer_type: "satici",
        status: "aktif",
        lead_source: "telefon",
        lead_score: 68,
        preferred_regions: ["Bakırköy"],
        budget_min: 6000000,
        budget_max: 7500000,
        preferred_property_types: ["daire"],
        preferred_room_counts: ["4+1"],
        last_contact_date: "2026-01-07",
        total_showings: 3,
        total_offers: 1,
        notes: "4+1 dairesi var, acil satmak istiyor",
        created_at: "2025-12-15T14:00:00Z",
        updated_at: "2026-01-07T16:00:00Z",
    },
];

// Bütçe formatlama
export function formatBudget(min: number, max: number): string {
    const formatNum = (n: number) => {
        if (n >= 1000000) {
            return `${(n / 1000000).toFixed(1)}M`;
        } else if (n >= 1000) {
            return `${(n / 1000).toFixed(0)}K`;
        }
        return n.toString();
    };
    return `${formatNum(min)} - ${formatNum(max)} ₺`;
}
