/**
 * Demo Mode Utility
 * Kullanıcılara giriş yapmadan demo deneyimi sunmak için
 */

// Demo kullanıcı ID'si
export const DEMO_USER_ID = "demo-user-00000000-0000-0000-0000-000000000000";

// Demo modunda mı kontrol et
export const isDemoMode = (userId: string | null | undefined): boolean => {
    return userId === DEMO_USER_ID;
};

// Demo veri tipleri
export interface DemoProperty {
    id: string;
    title: string;
    property_type: string;
    city: string;
    district: string;
    price: number;
    status: "active" | "sold" | "rented" | "pending";
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    created_at: string;
}

export interface DemoCustomer {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    customer_type: "buyer" | "seller" | "tenant" | "landlord";
    status: "active" | "passive";
    lead_score: number;
    budget_min: number;
    budget_max: number;
    preferred_regions: string[];
    last_contact_date: string;
}

export interface DemoDeal {
    id: string;
    title: string;
    property_title: string;
    customer_name: string;
    expected_value: number;
    stage: "lead" | "viewing" | "offer" | "negotiation" | "contract" | "closed";
    priority: "low" | "normal" | "high" | "urgent";
    updated_at: string;
}

export interface DemoAppointment {
    id: string;
    title: string;
    type: "showing" | "meeting" | "call" | "contract";
    property_title: string;
    customer_name: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
}

// Demo mülkler
export const DEMO_PROPERTIES: DemoProperty[] = [
    {
        id: "demo-prop-1",
        title: "Ataşehir'de Lüks Daire",
        property_type: "apartment",
        city: "İstanbul",
        district: "Ataşehir",
        price: 4500000,
        status: "active",
        bedrooms: 3,
        bathrooms: 2,
        area: 145,
        images: [],
        created_at: "2026-01-10",
    },
    {
        id: "demo-prop-2",
        title: "Kadıköy'de Satılık Ofis",
        property_type: "office",
        city: "İstanbul",
        district: "Kadıköy",
        price: 6200000,
        status: "active",
        bedrooms: 0,
        bathrooms: 2,
        area: 180,
        images: [],
        created_at: "2026-01-08",
    },
    {
        id: "demo-prop-3",
        title: "Beşiktaş'ta Kiralık Daire",
        property_type: "apartment",
        city: "İstanbul",
        district: "Beşiktaş",
        price: 35000,
        status: "rented",
        bedrooms: 2,
        bathrooms: 1,
        area: 95,
        images: [],
        created_at: "2026-01-05",
    },
    {
        id: "demo-prop-4",
        title: "Üsküdar'da Deniz Manzaralı Villa",
        property_type: "villa",
        city: "İstanbul",
        district: "Üsküdar",
        price: 15800000,
        status: "pending",
        bedrooms: 5,
        bathrooms: 4,
        area: 380,
        images: [],
        created_at: "2026-01-02",
    },
    {
        id: "demo-prop-5",
        title: "Çankaya'da Müstakil Ev",
        property_type: "house",
        city: "Ankara",
        district: "Çankaya",
        price: 8500000,
        status: "sold",
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        images: [],
        created_at: "2025-12-28",
    },
];

// Demo müşteriler
export const DEMO_CUSTOMERS: DemoCustomer[] = [
    {
        id: "demo-cust-1",
        full_name: "Ahmet Yılmaz",
        phone: "0532 123 45 67",
        email: "ahmet@email.com",
        customer_type: "buyer",
        status: "active",
        lead_score: 85,
        budget_min: 3000000,
        budget_max: 5000000,
        preferred_regions: ["Ataşehir", "Kadıköy"],
        last_contact_date: "2026-01-12",
    },
    {
        id: "demo-cust-2",
        full_name: "Fatma Demir",
        phone: "0544 987 65 43",
        email: "fatma@email.com",
        customer_type: "seller",
        status: "active",
        lead_score: 72,
        budget_min: 5000000,
        budget_max: 7000000,
        preferred_regions: ["Beşiktaş"],
        last_contact_date: "2026-01-11",
    },
    {
        id: "demo-cust-3",
        full_name: "Mehmet Kaya",
        phone: "0555 456 78 90",
        email: "mehmet@email.com",
        customer_type: "tenant",
        status: "active",
        lead_score: 65,
        budget_min: 20000,
        budget_max: 40000,
        preferred_regions: ["Şişli", "Levent"],
        last_contact_date: "2026-01-10",
    },
    {
        id: "demo-cust-4",
        full_name: "Ayşe Öztürk",
        phone: "0542 321 65 87",
        email: "ayse@email.com",
        customer_type: "buyer",
        status: "passive",
        lead_score: 45,
        budget_min: 2000000,
        budget_max: 3500000,
        preferred_regions: ["Maltepe"],
        last_contact_date: "2025-12-25",
    },
];

// Demo fırsatlar
export const DEMO_DEALS: DemoDeal[] = [
    {
        id: "demo-deal-1",
        title: "Ataşehir Daire Satışı",
        property_title: "Ataşehir'de Lüks Daire",
        customer_name: "Ahmet Yılmaz",
        expected_value: 4500000,
        stage: "negotiation",
        priority: "high",
        updated_at: "2026-01-12",
    },
    {
        id: "demo-deal-2",
        title: "Kadıköy Ofis Satışı",
        property_title: "Kadıköy'de Satılık Ofis",
        customer_name: "ABC Şirketi",
        expected_value: 6200000,
        stage: "offer",
        priority: "normal",
        updated_at: "2026-01-11",
    },
    {
        id: "demo-deal-3",
        title: "Villa Görüşmesi",
        property_title: "Üsküdar'da Deniz Manzaralı Villa",
        customer_name: "Fatma Demir",
        expected_value: 15800000,
        stage: "viewing",
        priority: "urgent",
        updated_at: "2026-01-10",
    },
    {
        id: "demo-deal-4",
        title: "Beşiktaş Kiralama",
        property_title: "Beşiktaş'ta Kiralık Daire",
        customer_name: "Mehmet Kaya",
        expected_value: 420000,
        stage: "contract",
        priority: "high",
        updated_at: "2026-01-09",
    },
    {
        id: "demo-deal-5",
        title: "Yeni Lead",
        property_title: "Çankaya'da Müstakil Ev",
        customer_name: "Yeni Müşteri",
        expected_value: 8500000,
        stage: "lead",
        priority: "normal",
        updated_at: "2026-01-08",
    },
];

// Demo randevular (bugün ve yakın tarihler)
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

export const DEMO_APPOINTMENTS: DemoAppointment[] = [
    {
        id: "demo-apt-1",
        title: "Daire Gösterimi - Ataşehir",
        type: "showing",
        property_title: "Ataşehir'de Lüks Daire",
        customer_name: "Ahmet Yılmaz",
        date: formatDate(today),
        time: "14:00",
        status: "scheduled",
    },
    {
        id: "demo-apt-2",
        title: "Ofis Tanıtımı",
        type: "meeting",
        property_title: "Kadıköy'de Satılık Ofis",
        customer_name: "ABC Şirketi",
        date: formatDate(new Date(today.getTime() + 86400000)),
        time: "10:30",
        status: "scheduled",
    },
    {
        id: "demo-apt-3",
        title: "Telefon Görüşmesi",
        type: "call",
        property_title: "",
        customer_name: "Fatma Demir",
        date: formatDate(new Date(today.getTime() + 86400000 * 2)),
        time: "16:00",
        status: "scheduled",
    },
    {
        id: "demo-apt-4",
        title: "Sözleşme İmzası",
        type: "contract",
        property_title: "Beşiktaş'ta Kiralık Daire",
        customer_name: "Mehmet Kaya",
        date: formatDate(new Date(today.getTime() - 86400000)),
        time: "11:00",
        status: "completed",
    },
];

// Demo istatistikleri
export const DEMO_STATS = {
    totalProperties: 5,
    activeListings: 2,
    totalCustomers: 4,
    hotLeads: 2,
    totalDeals: 5,
    pipelineValue: 35420000,
    todayAppointments: 1,
    weekAppointments: 3,
    monthlyRevenue: 12500000,
    conversionRate: 32,
};

// Demo görevleri
export const DEMO_TASKS = [
    { id: "demo-task-1", text: "Ahmet Bey'i aramak", completed: false, dueDate: formatDate(today) },
    { id: "demo-task-2", text: "Kadıköy ofis fotoğraflarını güncellemek", completed: false, dueDate: formatDate(new Date(today.getTime() + 86400000)) },
    { id: "demo-task-3", text: "Villa ekspertiz raporunu hazırlamak", completed: true, dueDate: formatDate(new Date(today.getTime() - 86400000)) },
    { id: "demo-task-4", text: "Portföy raporunu göndermek", completed: false, dueDate: formatDate(new Date(today.getTime() + 86400000 * 3)) },
];
