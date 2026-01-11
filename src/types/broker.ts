// Broker/Müdür Dashboard tipleri

// Danışman performans özeti
export interface AgentPerformance {
    id: string;
    name: string;
    avatar?: string;
    level: string;
    activePortfolio: number;
    activeCustomers: number;
    monthlyShowings: number;
    monthlySales: number;
    monthlySalesAmount: number;
    xp: number;
    trend: "up" | "down" | "stable";
    lastSale?: string;
    lastActivity: string;
}

// Ofis metrikleri
export interface OfficeMetrics {
    totalAgents: number;
    activeAgents: number;
    totalPortfolio: number;
    totalCustomers: number;
    monthlySalesCount: number;
    monthlySalesAmount: number;
    pipelineValue: number;
    pipelineWeighted: number;
}

// Uyarı tipleri
export type AlertType = "no_sale" | "low_activity" | "license_expiry" | "unfollowed_lead";

export interface BrokerAlert {
    id: string;
    type: AlertType;
    agentId?: string;
    agentName?: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    date: string;
}

// Aylık satış trendi
export interface MonthlySalesTrend {
    month: string;
    agents: { name: string; sales: number }[];
}

// Demo danışman performansları
export const DEMO_AGENT_PERFORMANCES: AgentPerformance[] = [
    {
        id: "user-2",
        name: "Ali Yılmaz",
        level: "Master",
        activePortfolio: 18,
        activeCustomers: 45,
        monthlyShowings: 12,
        monthlySales: 4,
        monthlySalesAmount: 18500000,
        xp: 8450,
        trend: "up",
        lastSale: "2026-01-07",
        lastActivity: "2 saat önce",
    },
    {
        id: "user-1",
        name: "Demo Kullanıcı",
        level: "Uzman",
        activePortfolio: 12,
        activeCustomers: 38,
        monthlyShowings: 8,
        monthlySales: 2,
        monthlySalesAmount: 9200000,
        xp: 3250,
        trend: "stable",
        lastSale: "2026-01-05",
        lastActivity: "Şimdi",
    },
    {
        id: "user-4",
        name: "Mehmet Demir",
        level: "Uzman",
        activePortfolio: 15,
        activeCustomers: 52,
        monthlyShowings: 10,
        monthlySales: 3,
        monthlySalesAmount: 12800000,
        xp: 4800,
        trend: "up",
        lastSale: "2026-01-08",
        lastActivity: "5 dakika önce",
    },
    {
        id: "user-5",
        name: "Ayşe Kara",
        level: "Uzman",
        activePortfolio: 10,
        activeCustomers: 28,
        monthlyShowings: 6,
        monthlySales: 2,
        monthlySalesAmount: 7500000,
        xp: 4200,
        trend: "stable",
        lastSale: "2026-01-06",
        lastActivity: "1 saat önce",
    },
    {
        id: "user-3",
        name: "Zeynep Kaya",
        level: "Danışman",
        activePortfolio: 8,
        activeCustomers: 22,
        monthlyShowings: 5,
        monthlySales: 1,
        monthlySalesAmount: 3200000,
        xp: 1850,
        trend: "down",
        lastSale: "2025-12-28",
        lastActivity: "3 saat önce",
    },
    {
        id: "user-6",
        name: "Fatma Şahin",
        level: "Danışman",
        activePortfolio: 6,
        activeCustomers: 18,
        monthlyShowings: 4,
        monthlySales: 1,
        monthlySalesAmount: 2800000,
        xp: 1500,
        trend: "stable",
        lastSale: "2026-01-03",
        lastActivity: "6 saat önce",
    },
    {
        id: "user-7",
        name: "Burak Özkan",
        level: "Danışman",
        activePortfolio: 5,
        activeCustomers: 15,
        monthlyShowings: 3,
        monthlySales: 0,
        monthlySalesAmount: 0,
        xp: 1200,
        trend: "down",
        lastActivity: "1 gün önce",
    },
    {
        id: "user-8",
        name: "Elif Yıldırım",
        level: "Çaylak",
        activePortfolio: 3,
        activeCustomers: 8,
        monthlyShowings: 2,
        monthlySales: 0,
        monthlySalesAmount: 0,
        xp: 450,
        trend: "stable",
        lastActivity: "2 gün önce",
    },
];

// Demo ofis metrikleri
export const DEMO_OFFICE_METRICS: OfficeMetrics = {
    totalAgents: 8,
    activeAgents: 6,
    totalPortfolio: 77,
    totalCustomers: 226,
    monthlySalesCount: 13,
    monthlySalesAmount: 54000000,
    pipelineValue: 185000000,
    pipelineWeighted: 72000000,
};

// Demo uyarılar
export const DEMO_BROKER_ALERTS: BrokerAlert[] = [
    {
        id: "1",
        type: "no_sale",
        agentId: "user-7",
        agentName: "Burak Özkan",
        title: "7+ gündür satış yok",
        description: "Son satış: 12 gün önce",
        severity: "high",
        date: "2026-01-09",
    },
    {
        id: "2",
        type: "low_activity",
        agentId: "user-8",
        agentName: "Elif Yıldırım",
        title: "Düşük aktivite",
        description: "Son 7 günde sadece 2 gösterim",
        severity: "medium",
        date: "2026-01-09",
    },
    {
        id: "3",
        type: "license_expiry",
        agentId: "user-6",
        agentName: "Fatma Şahin",
        title: "Yetki belgesi yakında bitiyor",
        description: "15 gün kaldı",
        severity: "medium",
        date: "2026-01-24",
    },
    {
        id: "4",
        type: "unfollowed_lead",
        title: "Takip edilmeyen leadler",
        description: "12 lead 48+ saattir yanıtlanmadı",
        severity: "high",
        date: "2026-01-09",
    },
];

// Demo aylık satış trendi
export const DEMO_SALES_TREND: MonthlySalesTrend[] = [
    { month: "Eyl", agents: [{ name: "Ali", sales: 3 }, { name: "Mehmet", sales: 2 }, { name: "Demo", sales: 2 }] },
    { month: "Eki", agents: [{ name: "Ali", sales: 4 }, { name: "Mehmet", sales: 3 }, { name: "Demo", sales: 1 }] },
    { month: "Kas", agents: [{ name: "Ali", sales: 3 }, { name: "Mehmet", sales: 2 }, { name: "Demo", sales: 3 }] },
    { month: "Ara", agents: [{ name: "Ali", sales: 5 }, { name: "Mehmet", sales: 4 }, { name: "Demo", sales: 2 }] },
    { month: "Oca", agents: [{ name: "Ali", sales: 4 }, { name: "Mehmet", sales: 3 }, { name: "Demo", sales: 2 }] },
];

// Uyarı renkleri
export const ALERT_SEVERITY_COLORS = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
};

// Uyarı ikonları
export const ALERT_TYPE_LABELS = {
    no_sale: { label: "Satış Yok", icon: "📉" },
    low_activity: { label: "Düşük Aktivite", icon: "⚠️" },
    license_expiry: { label: "Yetki Bitiyor", icon: "📋" },
    unfollowed_lead: { label: "Lead Takibi", icon: "👤" },
};
