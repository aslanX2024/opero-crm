// Tabela takip tipleri ve sabit değerler

export type SignboardType = "satilik" | "kiralik" | "yon" | "banner";
export type SignboardStatus = "aktif" | "kaldirildi" | "bakimda";

// Tabela arayüzü
export interface Signboard {
    id: string;
    property_id?: string;
    property_title?: string;
    type: SignboardType;
    location: string;
    address: string;
    lat: number;
    lng: number;
    start_date: string;
    end_date?: string;
    responsible_id: string;
    responsible_name: string;
    status: SignboardStatus;
    photo_url?: string;
    notes?: string;
    last_check?: string;
    next_check?: string;
    leads_count: number;
    created_at: string;
    updated_at: string;
}

// Tabela kontrol kaydı
export interface SignboardCheck {
    id: string;
    signboard_id: string;
    check_date: string;
    status: "iyi" | "hasar" | "kayip" | "bakimda";
    photo_url?: string;
    notes?: string;
    checked_by: string;
}

// Tabela tipleri
export const SIGNBOARD_TYPES: Record<SignboardType, { label: string; icon: string; color: string }> = {
    satilik: { label: "Satılık", icon: "🏷️", color: "bg-green-100 text-green-700" },
    kiralik: { label: "Kiralık", icon: "🔑", color: "bg-blue-100 text-blue-700" },
    yon: { label: "Yön Tabelası", icon: "➡️", color: "bg-yellow-100 text-yellow-700" },
    banner: { label: "Banner", icon: "🎯", color: "bg-purple-100 text-purple-700" },
};

// Tabela durumları
export const SIGNBOARD_STATUSES: Record<SignboardStatus, { label: string; color: string }> = {
    aktif: { label: "Aktif", color: "bg-green-100 text-green-700" },
    kaldirildi: { label: "Kaldırıldı", color: "bg-gray-100 text-gray-700" },
    bakimda: { label: "Bakımda", color: "bg-yellow-100 text-yellow-700" },
};

// Demo tabelalar (İstanbul koordinatları)
export const DEMO_SIGNBOARDS: Signboard[] = [
    {
        id: "1",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        type: "satilik",
        location: "Kadıköy Moda Caddesi",
        address: "Moda Caddesi No:45, Kadıköy/İstanbul",
        lat: 40.9847,
        lng: 29.0252,
        start_date: "2026-01-01",
        responsible_id: "user-1",
        responsible_name: "Demo Kullanıcı",
        status: "aktif",
        last_check: "2026-01-05",
        next_check: "2026-01-12",
        leads_count: 8,
        created_at: "2026-01-01T10:00:00Z",
        updated_at: "2026-01-05T14:00:00Z",
    },
    {
        id: "2",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        type: "satilik",
        location: "Beykoz Ana Cadde",
        address: "Çubuklu Caddesi No:120, Beykoz/İstanbul",
        lat: 41.1082,
        lng: 29.0892,
        start_date: "2025-12-15",
        responsible_id: "user-2",
        responsible_name: "Ali Yılmaz",
        status: "aktif",
        last_check: "2026-01-02",
        next_check: "2026-01-09",
        leads_count: 5,
        created_at: "2025-12-15T09:00:00Z",
        updated_at: "2026-01-02T11:00:00Z",
    },
    {
        id: "3",
        property_id: "2",
        property_title: "Merkezi Konumda Ofis",
        type: "kiralik",
        location: "Levent Plaza Önü",
        address: "Büyükdere Caddesi No:185, Levent/İstanbul",
        lat: 41.0821,
        lng: 29.0115,
        start_date: "2025-11-20",
        responsible_id: "user-1",
        responsible_name: "Demo Kullanıcı",
        status: "aktif",
        last_check: "2026-01-03",
        next_check: "2026-01-10",
        leads_count: 10,
        created_at: "2025-11-20T08:00:00Z",
        updated_at: "2026-01-03T16:00:00Z",
    },
    {
        id: "4",
        type: "yon",
        location: "Bağdat Caddesi Kavşak",
        address: "Bağdat Caddesi, Suadiye/İstanbul",
        lat: 40.9612,
        lng: 29.0712,
        start_date: "2025-12-01",
        responsible_id: "user-1",
        responsible_name: "Demo Kullanıcı",
        status: "aktif",
        last_check: "2025-12-28",
        next_check: "2026-01-11",
        leads_count: 3,
        notes: "Ana yola bakan yön tabelası",
        created_at: "2025-12-01T10:00:00Z",
        updated_at: "2025-12-28T09:00:00Z",
    },
    {
        id: "5",
        type: "banner",
        location: "Ataşehir Alışveriş Merkezi",
        address: "Ataşehir Bulvarı, Ataşehir/İstanbul",
        lat: 40.9922,
        lng: 29.1152,
        start_date: "2025-11-01",
        end_date: "2025-12-31",
        responsible_id: "user-3",
        responsible_name: "Zeynep Kaya",
        status: "kaldirildi",
        last_check: "2025-12-31",
        leads_count: 15,
        notes: "Kampanya sonu kaldırıldı",
        created_at: "2025-11-01T08:00:00Z",
        updated_at: "2025-12-31T17:00:00Z",
    },
    {
        id: "6",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        type: "kiralik",
        location: "Üsküdar Metro Çıkışı",
        address: "Üsküdar Meydanı, Üsküdar/İstanbul",
        lat: 41.0262,
        lng: 29.0152,
        start_date: "2026-01-05",
        responsible_id: "user-1",
        responsible_name: "Demo Kullanıcı",
        status: "bakimda",
        last_check: "2026-01-08",
        next_check: "2026-01-15",
        leads_count: 2,
        notes: "Rüzgar hasarı, onarımda",
        created_at: "2026-01-05T11:00:00Z",
        updated_at: "2026-01-08T10:00:00Z",
    },
];

// Demo danışmanlar
export const DEMO_AGENTS = [
    { id: "user-1", name: "Demo Kullanıcı" },
    { id: "user-2", name: "Ali Yılmaz" },
    { id: "user-3", name: "Zeynep Kaya" },
];

// Kontrol durumları
export const CHECK_STATUSES = {
    iyi: { label: "İyi Durumda", color: "bg-green-100 text-green-700" },
    hasar: { label: "Hasarlı", color: "bg-orange-100 text-orange-700" },
    kayip: { label: "Kayıp/Çalındı", color: "bg-red-100 text-red-700" },
    bakimda: { label: "Bakımda", color: "bg-yellow-100 text-yellow-700" },
};

// Kontrol gereken tabelaları bul
export function getSignboardsNeedingCheck(signboards: Signboard[]): Signboard[] {
    const today = new Date();
    return signboards.filter((s) => {
        if (s.status !== "aktif") return false;
        if (!s.next_check) return true;
        return new Date(s.next_check) <= today;
    });
}

// Gün farkı hesapla
export function getDaysDiff(dateStr: string): number {
    const date = new Date(dateStr);
    const today = new Date();
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
