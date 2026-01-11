// Pipeline/Deal tipleri ve sabit değerler

export type PipelineStage =
    | "yeni_lead"
    | "iletisim_kuruldu"
    | "kalifikasyon"
    | "gosterim_planlandi"
    | "gosterim_yapildi"
    | "teklif"
    | "muzakere"
    | "sozlesme"
    | "kapanis"
    | "tamamlandi";

export type DealPriority = "low" | "normal" | "high" | "urgent";

// Deal (Fırsat) arayüzü
export interface Deal {
    id: string;
    title: string;
    property_id: string;
    property_title: string;
    property_price: number;
    property_image?: string;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    stage: PipelineStage;
    priority: DealPriority;
    expected_value: number;
    probability: number; // 0-100
    stage_entered_at: string;
    last_activity_at: string;
    next_action?: string;
    notes?: string;
    assigned_to: string;
    created_at: string;
    updated_at: string;
}

// Pipeline aşamaları
export const PIPELINE_STAGES: Record<PipelineStage, { label: string; color: string; probability: number }> = {
    yeni_lead: { label: "Yeni Lead", color: "bg-gray-500", probability: 10 },
    iletisim_kuruldu: { label: "İletişim Kuruldu", color: "bg-blue-500", probability: 20 },
    kalifikasyon: { label: "Kalifikasyon", color: "bg-indigo-500", probability: 30 },
    gosterim_planlandi: { label: "Gösterim Planlandı", color: "bg-purple-500", probability: 40 },
    gosterim_yapildi: { label: "Gösterim Yapıldı", color: "bg-pink-500", probability: 50 },
    teklif: { label: "Teklif", color: "bg-orange-500", probability: 60 },
    muzakere: { label: "Müzakere", color: "bg-amber-500", probability: 70 },
    sozlesme: { label: "Sözleşme", color: "bg-lime-500", probability: 85 },
    kapanis: { label: "Kapanış", color: "bg-emerald-500", probability: 95 },
    tamamlandi: { label: "Tamamlandı", color: "bg-green-600", probability: 100 },
};

// Aşama sırası
export const STAGE_ORDER: PipelineStage[] = [
    "yeni_lead",
    "iletisim_kuruldu",
    "kalifikasyon",
    "gosterim_planlandi",
    "gosterim_yapildi",
    "teklif",
    "muzakere",
    "sozlesme",
    "kapanis",
    "tamamlandi",
];

// Öncelik sabitleri
export const DEAL_PRIORITIES: Record<DealPriority, { label: string; color: string }> = {
    low: { label: "Düşük", color: "bg-gray-100 text-gray-700" },
    normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
    high: { label: "Yüksek", color: "bg-orange-100 text-orange-700" },
    urgent: { label: "Acil", color: "bg-red-100 text-red-700" },
};

// Aşamada kalma süresi hesaplama
export function getDaysInStage(stageEnteredAt: string): number {
    const entered = new Date(stageEnteredAt);
    const now = new Date();
    return Math.ceil((now.getTime() - entered.getTime()) / (1000 * 60 * 60 * 24));
}

// Weighted pipeline değer hesaplama
export function calculateWeightedValue(deals: Deal[]): number {
    return deals.reduce((total, deal) => {
        const stage = PIPELINE_STAGES[deal.stage];
        return total + (deal.expected_value * (stage.probability / 100));
    }, 0);
}

// Aşama değiştirme XP hesaplama
export function getStageChangeXP(fromStage: PipelineStage, toStage: PipelineStage): number {
    const fromIndex = STAGE_ORDER.indexOf(fromStage);
    const toIndex = STAGE_ORDER.indexOf(toStage);

    if (toIndex > fromIndex) {
        // İlerleme
        if (toStage === "tamamlandi") return 100; // Satış tamamlandı
        if (toStage === "sozlesme") return 50; // Sözleşme aşaması
        if (toStage === "teklif") return 30; // Teklif alındı
        if (toStage === "gosterim_yapildi") return 20; // Gösterim yapıldı
        return 10; // Diğer aşamalar
    }

    return 0; // Geri gitme XP vermez
}

// Demo deal'lar
export const DEMO_DEALS: Deal[] = [
    {
        id: "1",
        title: "Kadıköy 3+1 Satış",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        property_price: 4500000,
        customer_id: "1",
        customer_name: "Ahmet Yılmaz",
        customer_phone: "0532 111 22 33",
        stage: "teklif",
        priority: "high",
        expected_value: 4200000,
        probability: 60,
        stage_entered_at: "2026-01-05",
        last_activity_at: "2026-01-08",
        next_action: "Karşı teklif hazırla",
        notes: "Müşteri 4.2M teklif verdi, mal sahibi 4.4M istiyor",
        assigned_to: "demo-user-id",
        created_at: "2025-12-20T10:00:00Z",
        updated_at: "2026-01-08T09:00:00Z",
    },
    {
        id: "2",
        title: "Ataşehir 2+1 Satış",
        property_id: "2",
        property_title: "Merkezi Konumda Satılık Ofis",
        property_price: 3200000,
        customer_id: "4",
        customer_name: "Ayşe Öztürk",
        customer_phone: "0555 444 55 66",
        stage: "muzakere",
        priority: "urgent",
        expected_value: 3100000,
        probability: 70,
        stage_entered_at: "2026-01-07",
        last_activity_at: "2026-01-08",
        next_action: "Kaparo için tarih belirle",
        assigned_to: "demo-user-id",
        created_at: "2025-12-15T10:00:00Z",
        updated_at: "2026-01-08T14:00:00Z",
    },
    {
        id: "3",
        title: "Beşiktaş 4+1 Satış",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        property_price: 15000000,
        customer_id: "4",
        customer_name: "Ayşe Öztürk",
        customer_phone: "0555 444 55 66",
        stage: "gosterim_yapildi",
        priority: "normal",
        expected_value: 14500000,
        probability: 50,
        stage_entered_at: "2026-01-06",
        last_activity_at: "2026-01-07",
        next_action: "Geri bildirim al",
        assigned_to: "demo-user-id",
        created_at: "2025-12-28T10:00:00Z",
        updated_at: "2026-01-07T16:00:00Z",
    },
    {
        id: "4",
        title: "Şişli 1+1 Kiralama",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        property_price: 18000,
        customer_id: "3",
        customer_name: "Mehmet Kaya",
        customer_phone: "0544 333 44 55",
        stage: "gosterim_planlandi",
        priority: "normal",
        expected_value: 18000,
        probability: 40,
        stage_entered_at: "2026-01-08",
        last_activity_at: "2026-01-08",
        next_action: "Pazartesi 14:00 gösterim",
        assigned_to: "demo-user-id",
        created_at: "2026-01-05T10:00:00Z",
        updated_at: "2026-01-08T10:00:00Z",
    },
    {
        id: "5",
        title: "Kartal 2+1 Satış",
        property_id: "5",
        property_title: "Yatırımlık Kiralık Daire",
        property_price: 2800000,
        customer_id: "5",
        customer_name: "Ali Çelik",
        customer_phone: "0532 555 66 77",
        stage: "kalifikasyon",
        priority: "low",
        expected_value: 2700000,
        probability: 30,
        stage_entered_at: "2026-01-04",
        last_activity_at: "2026-01-06",
        next_action: "Bütçe onayı al",
        assigned_to: "demo-user-id",
        created_at: "2026-01-02T10:00:00Z",
        updated_at: "2026-01-06T11:00:00Z",
    },
    {
        id: "6",
        title: "Üsküdar 3+1 Kiralama",
        property_id: "6",
        property_title: "Boğaz Manzaralı Residence",
        property_price: 35000,
        customer_id: "7",
        customer_name: "Can Yıldız",
        customer_phone: "0533 777 88 99",
        stage: "iletisim_kuruldu",
        priority: "normal",
        expected_value: 35000,
        probability: 20,
        stage_entered_at: "2026-01-07",
        last_activity_at: "2026-01-07",
        next_action: "Tercihleri netleştir",
        assigned_to: "demo-user-id",
        created_at: "2026-01-06T10:00:00Z",
        updated_at: "2026-01-07T09:00:00Z",
    },
    {
        id: "7",
        title: "Bakırköy 4+1 Satış",
        property_id: "8",
        property_title: "Deniz Manzaralı Dublex",
        property_price: 6500000,
        customer_id: "8",
        customer_name: "Deniz Koç",
        customer_phone: "0555 888 99 00",
        stage: "yeni_lead",
        priority: "normal",
        expected_value: 6300000,
        probability: 10,
        stage_entered_at: "2026-01-08",
        last_activity_at: "2026-01-08",
        assigned_to: "demo-user-id",
        created_at: "2026-01-08T14:00:00Z",
        updated_at: "2026-01-08T14:00:00Z",
    },
    {
        id: "8",
        title: "Kadıköy 3+1 Satış - Zeynep",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        property_price: 4500000,
        customer_id: "6",
        customer_name: "Zeynep Arslan",
        customer_phone: "0544 666 77 88",
        stage: "tamamlandi",
        priority: "high",
        expected_value: 4400000,
        probability: 100,
        stage_entered_at: "2026-01-05",
        last_activity_at: "2026-01-05",
        notes: "Satış tamamlandı! Tapu devri yapıldı.",
        assigned_to: "demo-user-id",
        created_at: "2025-10-15T10:00:00Z",
        updated_at: "2026-01-05T15:00:00Z",
    },
];

// Fiyat formatlama
export function formatDealPrice(price: number): string {
    if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1)}M ₺`;
    } else if (price >= 1000) {
        return `${(price / 1000).toFixed(0)}K ₺`;
    }
    return `${price} ₺`;
}
