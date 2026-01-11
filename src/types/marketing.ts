// Pazarlama tipleri ve sabit değerler

export type MarketingChannelType = "dijital" | "fiziksel" | "iliski";
export type CampaignStatus = "aktif" | "duraklatildi" | "tamamlandi" | "planlanmis";

// Pazarlama kanalı
export interface MarketingChannel {
    id: string;
    name: string;
    type: MarketingChannelType;
    leads_count: number;
    cost: number;
    conversions: number;
    color: string;
}

// Fiziksel pazarlama - Tabela
export interface Signboard {
    id: string;
    property_id: string;
    property_title: string;
    location: string;
    start_date: string;
    responsible: string;
    leads_count: number;
    status: "aktif" | "kaldirildi";
}

// Fiziksel pazarlama - Broşür
export interface BrochureStock {
    id: string;
    name: string;
    quantity: number;
    min_quantity: number;
    last_reorder?: string;
}

// Dijital kampanya
export interface DigitalCampaign {
    id: string;
    name: string;
    platform: "google" | "meta" | "portal";
    status: CampaignStatus;
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    leads: number;
    start_date: string;
    end_date?: string;
}

// Haftalık trend verisi
export interface WeeklyTrend {
    week: string;
    leads: number;
    conversions: number;
}

// Kanal tipleri renkleri
export const CHANNEL_TYPE_COLORS: Record<MarketingChannelType, { label: string; color: string; bgColor: string }> = {
    dijital: { label: "Dijital", color: "text-blue-600", bgColor: "bg-blue-500" },
    fiziksel: { label: "Fiziksel", color: "text-green-600", bgColor: "bg-green-500" },
    iliski: { label: "İlişki", color: "text-purple-600", bgColor: "bg-purple-500" },
};

// Kampanya durumları
export const CAMPAIGN_STATUSES: Record<CampaignStatus, { label: string; color: string }> = {
    aktif: { label: "Aktif", color: "bg-green-100 text-green-700" },
    duraklatildi: { label: "Duraklatıldı", color: "bg-yellow-100 text-yellow-700" },
    tamamlandi: { label: "Tamamlandı", color: "bg-gray-100 text-gray-700" },
    planlanmis: { label: "Planlanmış", color: "bg-blue-100 text-blue-700" },
};

// Demo pazarlama kanalları
export const DEMO_CHANNELS: MarketingChannel[] = [
    { id: "1", name: "Portal İlanları", type: "dijital", leads_count: 145, cost: 5000, conversions: 12, color: "#3B82F6" },
    { id: "2", name: "Google Ads", type: "dijital", leads_count: 89, cost: 12000, conversions: 8, color: "#EF4444" },
    { id: "3", name: "Meta Ads", type: "dijital", leads_count: 67, cost: 8000, conversions: 5, color: "#8B5CF6" },
    { id: "4", name: "Tabelalar", type: "fiziksel", leads_count: 23, cost: 3000, conversions: 4, color: "#22C55E" },
    { id: "5", name: "Broşürler", type: "fiziksel", leads_count: 12, cost: 1500, conversions: 1, color: "#F97316" },
    { id: "6", name: "Direct Mail", type: "fiziksel", leads_count: 8, cost: 2000, conversions: 1, color: "#14B8A6" },
    { id: "7", name: "Referanslar", type: "iliski", leads_count: 34, cost: 0, conversions: 15, color: "#EC4899" },
];

// Demo tabelalar
export const DEMO_SIGNBOARDS: Signboard[] = [
    {
        id: "1",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        location: "Kadıköy Moda Caddesi",
        start_date: "2026-01-01",
        responsible: "Demo Kullanıcı",
        leads_count: 8,
        status: "aktif",
    },
    {
        id: "2",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        location: "Beykoz Ana Cadde",
        start_date: "2025-12-15",
        responsible: "Ali Yılmaz",
        leads_count: 5,
        status: "aktif",
    },
    {
        id: "3",
        property_id: "2",
        property_title: "Merkezi Konumda Ofis",
        location: "Levent Plaza Önü",
        start_date: "2025-11-20",
        responsible: "Demo Kullanıcı",
        leads_count: 10,
        status: "aktif",
    },
];

// Demo broşür stoku
export const DEMO_BROCHURES: BrochureStock[] = [
    { id: "1", name: "Genel Şirket Broşürü", quantity: 500, min_quantity: 100 },
    { id: "2", name: "Lüks Konut Kataloğu", quantity: 80, min_quantity: 50, last_reorder: "2025-12-20" },
    { id: "3", name: "Yatırımcı Paketi", quantity: 25, min_quantity: 30, last_reorder: "2025-12-01" },
    { id: "4", name: "Kiralık Daire Broşürü", quantity: 200, min_quantity: 50 },
];

// Demo dijital kampanyalar
export const DEMO_CAMPAIGNS: DigitalCampaign[] = [
    {
        id: "1",
        name: "Kış Kampanyası - Satılık Daireler",
        platform: "google",
        status: "aktif",
        budget: 15000,
        spent: 8500,
        impressions: 125000,
        clicks: 3200,
        leads: 45,
        start_date: "2026-01-01",
        end_date: "2026-01-31",
    },
    {
        id: "2",
        name: "Lüks Villa Tanıtımı",
        platform: "meta",
        status: "aktif",
        budget: 10000,
        spent: 4200,
        impressions: 85000,
        clicks: 1800,
        leads: 28,
        start_date: "2026-01-05",
        end_date: "2026-02-05",
    },
    {
        id: "3",
        name: "Sahibinden Doping",
        platform: "portal",
        status: "aktif",
        budget: 5000,
        spent: 2800,
        impressions: 45000,
        clicks: 890,
        leads: 32,
        start_date: "2026-01-01",
    },
    {
        id: "4",
        name: "Yeni Yıl Özel Kampanyası",
        platform: "google",
        status: "tamamlandi",
        budget: 8000,
        spent: 8000,
        impressions: 95000,
        clicks: 2400,
        leads: 35,
        start_date: "2025-12-20",
        end_date: "2025-12-31",
    },
];

// Demo haftalık trend
export const DEMO_WEEKLY_TRENDS: WeeklyTrend[] = [
    { week: "45", leads: 28, conversions: 3 },
    { week: "46", leads: 35, conversions: 4 },
    { week: "47", leads: 42, conversions: 5 },
    { week: "48", leads: 38, conversions: 4 },
    { week: "49", leads: 52, conversions: 6 },
    { week: "50", leads: 48, conversions: 5 },
    { week: "51", leads: 55, conversions: 7 },
    { week: "52", leads: 45, conversions: 5 },
    { week: "1", leads: 62, conversions: 8 },
    { week: "2", leads: 58, conversions: 6 },
    { week: "3", leads: 71, conversions: 9 },
    { week: "4", leads: 65, conversions: 7 },
];

// Yardımcı fonksiyonlar
export function calculateCPL(cost: number, leads: number): number {
    return leads > 0 ? Math.round(cost / leads) : 0;
}

export function calculateConversionRate(leads: number, conversions: number): number {
    return leads > 0 ? Math.round((conversions / leads) * 100) : 0;
}

export function calculateCTR(clicks: number, impressions: number): number {
    return impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
}
