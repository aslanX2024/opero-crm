// Portal entegrasyon tipleri ve sabit değerler

export type PortalStatus = "connected" | "disconnected" | "error";
export type ListingStatus = "yayinda" | "beklemede" | "hata" | "bulunamadi";
export type SyncFrequency = "hourly" | "daily" | "manual";

// Portal arayüzü
export interface Portal {
    id: string;
    name: string;
    slug: string;
    logo: string;
    website: string;
    status: PortalStatus;
    api_key?: string;
    active_listings: number;
    total_listings: number;
    last_sync?: string;
    auto_sync: boolean;
    sync_frequency: SyncFrequency;
    is_available: boolean;
    description: string;
}

// Portal ilan eşleştirmesi
export interface PortalListing {
    id: string;
    property_id: string;
    property_title: string;
    portal_id: string;
    portal_name: string;
    portal_listing_id?: string;
    status: ListingStatus;
    last_updated?: string;
    error_message?: string;
    views?: number;
    inquiries?: number;
}

// Portal durumları
export const PORTAL_STATUSES: Record<PortalStatus, { label: string; color: string }> = {
    connected: { label: "Bağlı", color: "bg-green-100 text-green-700" },
    disconnected: { label: "Bağlı Değil", color: "bg-gray-100 text-gray-700" },
    error: { label: "Hata", color: "bg-red-100 text-red-700" },
};

// İlan durumları
export const LISTING_STATUSES: Record<ListingStatus, { label: string; color: string }> = {
    yayinda: { label: "Yayında", color: "bg-green-100 text-green-700" },
    beklemede: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
    hata: { label: "Hata", color: "bg-red-100 text-red-700" },
    bulunamadi: { label: "Bulunamadı", color: "bg-gray-100 text-gray-700" },
};

// Senkronizasyon sıklıkları
export const SYNC_FREQUENCIES: Record<SyncFrequency, { label: string }> = {
    hourly: { label: "Saatlik" },
    daily: { label: "Günlük" },
    manual: { label: "Manuel" },
};

// Demo portallar
export const DEMO_PORTALS: Portal[] = [
    {
        id: "sahibinden",
        name: "Sahibinden.com",
        slug: "sahibinden",
        logo: "/portals/sahibinden.png",
        website: "https://www.sahibinden.com",
        status: "connected",
        api_key: "sk_live_xxxx...xxxx",
        active_listings: 45,
        total_listings: 52,
        last_sync: "2026-01-09T06:30:00Z",
        auto_sync: true,
        sync_frequency: "hourly",
        is_available: true,
        description: "Türkiye'nin en büyük emlak portalı. Veri Taşıma API ile kurumsal entegrasyon.",
    },
    {
        id: "hepsiemlak",
        name: "Hepsiemlak",
        slug: "hepsiemlak",
        logo: "/portals/hepsiemlak.png",
        website: "https://www.hepsiemlak.com",
        status: "connected",
        api_key: "he_api_xxxx...xxxx",
        active_listings: 38,
        total_listings: 52,
        last_sync: "2026-01-09T05:45:00Z",
        auto_sync: true,
        sync_frequency: "daily",
        is_available: true,
        description: "Resmi API desteği ile tam entegrasyon. Otomatik ilan yayını.",
    },
    {
        id: "emlakjet",
        name: "Emlakjet",
        slug: "emlakjet",
        logo: "/portals/emlakjet.png",
        website: "https://www.emlakjet.com",
        status: "disconnected",
        active_listings: 0,
        total_listings: 52,
        auto_sync: false,
        sync_frequency: "manual",
        is_available: true,
        description: "Resmi API ile kolay entegrasyon. Hızlı ilan yayını.",
    },
    {
        id: "zingat",
        name: "Zingat",
        slug: "zingat",
        logo: "/portals/zingat.png",
        website: "https://www.zingat.com",
        status: "disconnected",
        active_listings: 0,
        total_listings: 52,
        auto_sync: false,
        sync_frequency: "manual",
        is_available: false,
        description: "Partner API - Başvuru gerektirir. Kısıtlı erişim.",
    },
];

// Demo portal ilanları
export const DEMO_PORTAL_LISTINGS: PortalListing[] = [
    {
        id: "1",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        portal_id: "sahibinden",
        portal_name: "Sahibinden.com",
        portal_listing_id: "1045789632",
        status: "yayinda",
        last_updated: "2026-01-08T10:00:00Z",
        views: 1250,
        inquiries: 8,
    },
    {
        id: "2",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        portal_id: "hepsiemlak",
        portal_name: "Hepsiemlak",
        portal_listing_id: "HE-45789",
        status: "yayinda",
        last_updated: "2026-01-08T09:00:00Z",
        views: 890,
        inquiries: 5,
    },
    {
        id: "3",
        property_id: "2",
        property_title: "Merkezi Konumda Satılık Ofis",
        portal_id: "sahibinden",
        portal_name: "Sahibinden.com",
        portal_listing_id: "1045789633",
        status: "yayinda",
        last_updated: "2026-01-07T14:00:00Z",
        views: 560,
        inquiries: 3,
    },
    {
        id: "4",
        property_id: "2",
        property_title: "Merkezi Konumda Satılık Ofis",
        portal_id: "hepsiemlak",
        portal_name: "Hepsiemlak",
        portal_listing_id: "HE-45790",
        status: "beklemede",
        last_updated: "2026-01-07T14:00:00Z",
    },
    {
        id: "5",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        portal_id: "sahibinden",
        portal_name: "Sahibinden.com",
        portal_listing_id: "1045789634",
        status: "hata",
        last_updated: "2026-01-06T10:00:00Z",
        error_message: "Fotoğraf boyutu çok büyük",
    },
    {
        id: "6",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        portal_id: "sahibinden",
        portal_name: "Sahibinden.com",
        status: "bulunamadi",
    },
];

// Senkronizasyon log
export interface SyncLog {
    id: string;
    portal_id: string;
    timestamp: string;
    action: "sync" | "publish" | "update" | "delete";
    status: "success" | "error";
    message: string;
    items_affected: number;
}

export const DEMO_SYNC_LOGS: SyncLog[] = [
    {
        id: "1",
        portal_id: "sahibinden",
        timestamp: "2026-01-09T06:30:00Z",
        action: "sync",
        status: "success",
        message: "45 ilan senkronize edildi",
        items_affected: 45,
    },
    {
        id: "2",
        portal_id: "sahibinden",
        timestamp: "2026-01-09T05:30:00Z",
        action: "update",
        status: "success",
        message: "3 ilan güncellendi",
        items_affected: 3,
    },
    {
        id: "3",
        portal_id: "hepsiemlak",
        timestamp: "2026-01-09T05:45:00Z",
        action: "sync",
        status: "success",
        message: "38 ilan senkronize edildi",
        items_affected: 38,
    },
    {
        id: "4",
        portal_id: "sahibinden",
        timestamp: "2026-01-08T18:00:00Z",
        action: "publish",
        status: "error",
        message: "2 ilan yayınlanamadı - fotoğraf hatası",
        items_affected: 2,
    },
];
