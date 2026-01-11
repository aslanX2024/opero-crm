// Lead tipleri ve sabit değerler

export type LeadStatus = "yeni" | "atandi" | "iletisimde" | "donustu" | "kayip";
export type LeadSource = "sahibinden" | "hepsiemlak" | "emlakjet" | "website" | "manual";

// Lead arayüzü
export interface Lead {
    id: string;
    source: LeadSource;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    property_id?: string;
    property_title?: string;
    message: string;
    status: LeadStatus;
    assigned_to?: string;
    assigned_to_name?: string;
    response_time?: number; // dakika
    created_at: string;
    updated_at: string;
}

// Lead durumları
export const LEAD_STATUSES: Record<LeadStatus, { label: string; color: string }> = {
    yeni: { label: "Yeni", color: "bg-blue-100 text-blue-700" },
    atandi: { label: "Atandı", color: "bg-purple-100 text-purple-700" },
    iletisimde: { label: "İletişimde", color: "bg-yellow-100 text-yellow-700" },
    donustu: { label: "Dönüştü", color: "bg-green-100 text-green-700" },
    kayip: { label: "Kayıp", color: "bg-red-100 text-red-700" },
};

// Lead kaynakları
export const LEAD_SOURCES: Record<LeadSource, { label: string; logo: string; color: string }> = {
    sahibinden: { label: "Sahibinden.com", logo: "🏠", color: "bg-yellow-500" },
    hepsiemlak: { label: "Hepsiemlak", logo: "🏢", color: "bg-red-500" },
    emlakjet: { label: "Emlakjet", logo: "✈️", color: "bg-blue-500" },
    website: { label: "Website", logo: "🌐", color: "bg-green-500" },
    manual: { label: "Manuel", logo: "✏️", color: "bg-gray-500" },
};

// Atama kuralları
export type AssignmentRule = "manual" | "region" | "property_type" | "round_robin";

export const ASSIGNMENT_RULES: Record<AssignmentRule, { label: string; description: string }> = {
    manual: { label: "Manuel Atama", description: "Leadleri kendiniz atayın" },
    region: { label: "Bölgeye Göre", description: "Danışmanın uzmanlık bölgesine göre" },
    property_type: { label: "Mülk Tipine Göre", description: "Danışmanın uzmanlık alanına göre" },
    round_robin: { label: "Sıralı Dağıtım", description: "Tüm danışmanlara eşit dağıt" },
};

// Demo leadler
export const DEMO_LEADS: Lead[] = [
    {
        id: "1",
        source: "sahibinden",
        customer_name: "Fatih Demir",
        customer_phone: "0532 999 88 77",
        customer_email: "fatih@email.com",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        message: "Merhaba, bu daire hala satılık mı? Fiyatta pazarlık payı var mı? Hafta sonu görmek isterim.",
        status: "yeni",
        created_at: "2026-01-09T07:15:00Z",
        updated_at: "2026-01-09T07:15:00Z",
    },
    {
        id: "2",
        source: "hepsiemlak",
        customer_name: "Selin Aydın",
        customer_phone: "0544 111 22 33",
        property_id: "2",
        property_title: "Merkezi Konumda Satılık Ofis",
        message: "Ofis için bilgi almak istiyorum. Kira getirisi ne kadar?",
        status: "yeni",
        created_at: "2026-01-09T06:45:00Z",
        updated_at: "2026-01-09T06:45:00Z",
    },
    {
        id: "3",
        source: "sahibinden",
        customer_name: "Burak Özkan",
        customer_phone: "0555 444 55 66",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        message: "Villa çok güzel görünüyor. Bahçe metrekaresi ne kadar?",
        status: "atandi",
        assigned_to: "user-1",
        assigned_to_name: "Demo Kullanıcı",
        response_time: 15,
        created_at: "2026-01-09T05:30:00Z",
        updated_at: "2026-01-09T05:45:00Z",
    },
    {
        id: "4",
        source: "website",
        customer_name: "Elif Yıldırım",
        customer_phone: "0533 777 88 99",
        customer_email: "elif@test.com",
        message: "3+1 daire arıyorum, Kadıköy veya Ataşehir bölgesinde. Bütçem 3-4 milyon arası.",
        status: "iletisimde",
        assigned_to: "user-1",
        assigned_to_name: "Demo Kullanıcı",
        response_time: 8,
        created_at: "2026-01-08T14:00:00Z",
        updated_at: "2026-01-08T14:08:00Z",
    },
    {
        id: "5",
        source: "hepsiemlak",
        customer_name: "Murat Şahin",
        customer_phone: "0544 222 33 44",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        message: "Kiralık daire için bilgi istiyorum.",
        status: "donustu",
        assigned_to: "user-1",
        assigned_to_name: "Demo Kullanıcı",
        response_time: 5,
        created_at: "2026-01-07T10:00:00Z",
        updated_at: "2026-01-07T10:05:00Z",
    },
    {
        id: "6",
        source: "emlakjet",
        customer_name: "Ayşe Korkmaz",
        customer_phone: "0555 666 77 88",
        property_id: "5",
        property_title: "Yatırımlık Kiralık Daire",
        message: "Bu daire müsait mi?",
        status: "kayip",
        assigned_to: "user-1",
        assigned_to_name: "Demo Kullanıcı",
        response_time: 120,
        created_at: "2026-01-05T09:00:00Z",
        updated_at: "2026-01-06T11:00:00Z",
    },
];

// Demo danışmanlar
export const DEMO_AGENTS = [
    { id: "user-1", name: "Demo Kullanıcı", region: "Kadıköy", specialty: "Satılık Daire" },
    { id: "user-2", name: "Ali Yılmaz", region: "Beşiktaş", specialty: "Villa" },
    { id: "user-3", name: "Zeynep Kaya", region: "Ataşehir", specialty: "Ofis" },
];

// Kaynak istatistikleri hesaplama
export function calculateSourceStats(leads: Lead[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: Record<LeadSource, { today: number; week: number; month: number; converted: number; avgResponseTime: number }> = {
        sahibinden: { today: 0, week: 0, month: 0, converted: 0, avgResponseTime: 0 },
        hepsiemlak: { today: 0, week: 0, month: 0, converted: 0, avgResponseTime: 0 },
        emlakjet: { today: 0, week: 0, month: 0, converted: 0, avgResponseTime: 0 },
        website: { today: 0, week: 0, month: 0, converted: 0, avgResponseTime: 0 },
        manual: { today: 0, week: 0, month: 0, converted: 0, avgResponseTime: 0 },
    };

    leads.forEach((lead) => {
        const created = new Date(lead.created_at);
        const source = lead.source;

        if (created >= today) stats[source].today++;
        if (created >= weekAgo) stats[source].week++;
        if (created >= monthAgo) stats[source].month++;
        if (lead.status === "donustu") stats[source].converted++;
    });

    // Ortalama yanıt süresi
    Object.keys(stats).forEach((source) => {
        const sourceLeads = leads.filter((l) => l.source === source && l.response_time);
        if (sourceLeads.length > 0) {
            const totalTime = sourceLeads.reduce((sum, l) => sum + (l.response_time || 0), 0);
            stats[source as LeadSource].avgResponseTime = Math.round(totalTime / sourceLeads.length);
        }
    });

    return stats;
}
