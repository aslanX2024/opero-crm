// Mülk tipleri ve sabit değerler

// Mülk tipi
export type PropertyType = "daire" | "villa" | "arsa" | "isyeri" | "mustakil" | "residence";

// Mülk türü (satılık/kiralık)
export type ListingType = "satilik" | "kiralik";

// Mülk durumu
export type PropertyStatus = "aktif" | "satildi" | "kiralandi" | "pasif";

// Mülk arayüzü
export interface Property {
    id: string;
    title: string;
    listing_type: ListingType;
    property_type: PropertyType;
    status: PropertyStatus;
    price: number;
    currency: "TRY" | "USD" | "EUR";
    commission_rate: number;

    // Konum
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    latitude?: number;
    longitude?: number;

    // Özellikler
    gross_area: number;
    net_area: number;
    room_count: string;
    floor: number;
    total_floors: number;
    building_age: number;
    heating_type: string;

    // Ek özellikler
    has_elevator: boolean;
    has_parking: boolean;
    has_balcony: boolean;
    is_in_complex: boolean;
    is_furnished: boolean;
    is_credit_eligible: boolean;
    is_exchange_eligible: boolean;

    // Görseller
    images: string[];
    main_image_index: number;
    video_url?: string;

    // Mal sahibi
    owner_name: string;
    owner_phone: string;
    authorization_start: string;
    authorization_end: string;
    owner_notes?: string;

    // Açıklama
    description: string;
    portal_ids?: Record<string, string>;

    // Meta
    views: number;
    created_at: string;
    updated_at: string;
    created_by: string;
}

// Sabit değerler - Türkçe etiketler
export const LISTING_TYPES: Record<ListingType, string> = {
    satilik: "Satılık",
    kiralik: "Kiralık",
};

export const PROPERTY_TYPES: Record<PropertyType, string> = {
    daire: "Daire",
    villa: "Villa",
    arsa: "Arsa",
    isyeri: "İşyeri",
    mustakil: "Müstakil Ev",
    residence: "Residence",
};

export const PROPERTY_STATUSES: Record<PropertyStatus, string> = {
    aktif: "Aktif",
    satildi: "Satıldı",
    kiralandi: "Kiralandı",
    pasif: "Pasif",
};

export const ROOM_COUNTS = [
    "1+0", "1+1", "2+1", "2+2", "3+1", "3+2", "4+1", "4+2", "5+1", "5+2", "6+", "10+"
];

export const HEATING_TYPES = [
    "Doğalgaz (Kombi)",
    "Doğalgaz (Merkezi)",
    "Klima",
    "Soba",
    "Yerden Isıtma",
    "Güneş Enerjisi",
    "Yok",
];

export const CITIES = [
    "İstanbul", "Ankara", "İzmir", "Antalya", "Bursa", "Adana", "Konya", "Gaziantep"
];

// Demo mülkler
export const DEMO_PROPERTIES: Property[] = [
    {
        id: "1",
        title: "Deniz Manzaralı Lüks Daire",
        listing_type: "satilik",
        property_type: "daire",
        status: "aktif",
        price: 4500000,
        currency: "TRY",
        commission_rate: 2,
        city: "İstanbul",
        district: "Kadıköy",
        neighborhood: "Caferağa",
        address: "Moda Cad. No:25",
        latitude: 40.9876,
        longitude: 29.0283,
        gross_area: 180,
        net_area: 160,
        room_count: "3+1",
        floor: 8,
        total_floors: 12,
        building_age: 5,
        heating_type: "Doğalgaz (Kombi)",
        has_elevator: true,
        has_parking: true,
        has_balcony: true,
        is_in_complex: false,
        is_furnished: false,
        is_credit_eligible: true,
        is_exchange_eligible: false,
        images: ["/demo/property1.jpg"],
        main_image_index: 0,
        owner_name: "Ahmet Yılmaz",
        owner_phone: "0532 111 22 33",
        authorization_start: "2024-01-01",
        authorization_end: "2024-12-31",
        description: "Kadıköy Moda'da deniz manzaralı, yüksek katta, bakımlı daire.",
        views: 245,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-20T14:30:00Z",
        created_by: "demo-user-id",
    },
    {
        id: "2",
        title: "Merkezi Konumda Satılık Ofis",
        listing_type: "satilik",
        property_type: "isyeri",
        status: "aktif",
        price: 8500000,
        currency: "TRY",
        commission_rate: 3,
        city: "İstanbul",
        district: "Şişli",
        neighborhood: "Mecidiyeköy",
        address: "Büyükdere Cad. Plaza",
        gross_area: 250,
        net_area: 230,
        room_count: "5+2",
        floor: 15,
        total_floors: 25,
        building_age: 3,
        heating_type: "Klima",
        has_elevator: true,
        has_parking: true,
        has_balcony: false,
        is_in_complex: true,
        is_furnished: true,
        is_credit_eligible: true,
        is_exchange_eligible: true,
        images: ["/demo/property2.jpg"],
        main_image_index: 0,
        owner_name: "XYZ Holding",
        owner_phone: "0212 333 44 55",
        authorization_start: "2024-02-01",
        authorization_end: "2024-08-01",
        description: "Merkezi konumda, metro yakını, A+ plaza ofis.",
        views: 189,
        created_at: "2024-02-10T09:00:00Z",
        updated_at: "2024-02-10T09:00:00Z",
        created_by: "demo-user-id",
    },
    {
        id: "3",
        title: "Bahçeli Müstakil Villa",
        listing_type: "satilik",
        property_type: "villa",
        status: "aktif",
        price: 25000000,
        currency: "TRY",
        commission_rate: 2,
        city: "İstanbul",
        district: "Beykoz",
        neighborhood: "Kavacık",
        address: "Orman Cad. No:10",
        gross_area: 450,
        net_area: 400,
        room_count: "6+",
        floor: 0,
        total_floors: 3,
        building_age: 10,
        heating_type: "Doğalgaz (Merkezi)",
        has_elevator: false,
        has_parking: true,
        has_balcony: true,
        is_in_complex: true,
        is_furnished: false,
        is_credit_eligible: true,
        is_exchange_eligible: true,
        images: ["/demo/property3.jpg"],
        main_image_index: 0,
        owner_name: "Mehmet Kaya",
        owner_phone: "0533 222 33 44",
        authorization_start: "2024-01-01",
        authorization_end: "2025-01-01",
        description: "Geniş bahçeli, havuzlu, orman manzaralı villa.",
        views: 567,
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-03-01T16:00:00Z",
        created_by: "demo-user-id",
    },
    {
        id: "4",
        title: "Kiralık 2+1 Daire",
        listing_type: "kiralik",
        property_type: "daire",
        status: "aktif",
        price: 25000,
        currency: "TRY",
        commission_rate: 100,
        city: "İstanbul",
        district: "Ataşehir",
        neighborhood: "Küçükbakkalköy",
        address: "Finans Merkezi Yakını",
        gross_area: 110,
        net_area: 95,
        room_count: "2+1",
        floor: 5,
        total_floors: 15,
        building_age: 2,
        heating_type: "Doğalgaz (Kombi)",
        has_elevator: true,
        has_parking: true,
        has_balcony: true,
        is_in_complex: true,
        is_furnished: true,
        is_credit_eligible: false,
        is_exchange_eligible: false,
        images: ["/demo/property4.jpg"],
        main_image_index: 0,
        owner_name: "Ayşe Demir",
        owner_phone: "0544 555 66 77",
        authorization_start: "2024-03-01",
        authorization_end: "2024-09-01",
        description: "Finans merkezi yakınında, eşyalı, site içi daire.",
        views: 423,
        created_at: "2024-03-15T08:00:00Z",
        updated_at: "2024-03-15T08:00:00Z",
        created_by: "demo-user-id",
    },
    {
        id: "5",
        title: "Yatırımlık Arsa",
        listing_type: "satilik",
        property_type: "arsa",
        status: "aktif",
        price: 15000000,
        currency: "TRY",
        commission_rate: 2,
        city: "İstanbul",
        district: "Çekmeköy",
        neighborhood: "Alemdağ",
        address: "Alemdağ Yolu Üzeri",
        gross_area: 1500,
        net_area: 1500,
        room_count: "1+0",
        floor: 0,
        total_floors: 0,
        building_age: 0,
        heating_type: "Yok",
        has_elevator: false,
        has_parking: false,
        has_balcony: false,
        is_in_complex: false,
        is_furnished: false,
        is_credit_eligible: true,
        is_exchange_eligible: true,
        images: ["/demo/property5.jpg"],
        main_image_index: 0,
        owner_name: "Ali Veli",
        owner_phone: "0555 888 99 00",
        authorization_start: "2024-01-01",
        authorization_end: "2024-12-31",
        description: "İmar durumu: Konut, TAKS:0.25, KAKS:1.5. Yola cepheli arsa.",
        views: 312,
        created_at: "2024-02-20T12:00:00Z",
        updated_at: "2024-02-20T12:00:00Z",
        created_by: "demo-user-id",
    },
    {
        id: "6",
        title: "Boğaz Manzaralı Residence",
        listing_type: "satilik",
        property_type: "residence",
        status: "satildi",
        price: 35000000,
        currency: "TRY",
        commission_rate: 2,
        city: "İstanbul",
        district: "Beşiktaş",
        neighborhood: "Levent",
        address: "Levent Residence",
        gross_area: 220,
        net_area: 200,
        room_count: "4+1",
        floor: 35,
        total_floors: 45,
        building_age: 1,
        heating_type: "Klima",
        has_elevator: true,
        has_parking: true,
        has_balcony: true,
        is_in_complex: true,
        is_furnished: true,
        is_credit_eligible: true,
        is_exchange_eligible: false,
        images: ["/demo/property6.jpg"],
        main_image_index: 0,
        owner_name: "Holding A.Ş.",
        owner_phone: "0212 444 55 66",
        authorization_start: "2023-06-01",
        authorization_end: "2024-06-01",
        description: "Boğaz manzaralı, 7/24 güvenlikli, havuzlu, spa'lı residence.",
        views: 892,
        created_at: "2023-06-10T10:00:00Z",
        updated_at: "2024-01-15T09:00:00Z",
        created_by: "demo-user-id",
    },
];

// Fiyat formatlama
export function formatPrice(price: number, currency: "TRY" | "USD" | "EUR" = "TRY"): string {
    const formatter = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(price);
}

// Kısa fiyat formatlama (örn: 4.5M)
export function formatPriceShort(price: number): string {
    if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1)}M ₺`;
    } else if (price >= 1000) {
        return `${(price / 1000).toFixed(0)}K ₺`;
    }
    return `${price} ₺`;
}
