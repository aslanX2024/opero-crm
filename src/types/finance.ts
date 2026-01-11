// Finans ve komisyon tipleri

export type CommissionStatus = "bekleyen" | "onaylandi" | "tahsil_edildi" | "iptal";
export type CommissionModel = "baslangic" | "standart" | "yuksek" | "elite" | "cap";

// Komisyon hesaplama modelleri
export const COMMISSION_MODELS: Record<CommissionModel, {
    label: string;
    agentShare: number;
    officeShare: number;
    requirement: string;
}> = {
    baslangic: { label: "Başlangıç", agentShare: 50, officeShare: 50, requirement: "Yeni danışmanlar" },
    standart: { label: "Standart", agentShare: 60, officeShare: 40, requirement: "Normal performans" },
    yuksek: { label: "Yüksek Performans", agentShare: 70, officeShare: 30, requirement: "10+ satış/yıl" },
    elite: { label: "Elite", agentShare: 80, officeShare: 20, requirement: "20+ satış/yıl" },
    cap: { label: "Cap Sistemi", agentShare: 100, officeShare: 0, requirement: "Yıllık ofis payı tamamlandı" },
};

// Komisyon işlemi
export interface CommissionTransaction {
    id: string;
    date: string;
    property_id: string;
    property_title: string;
    customer_name: string;
    sale_price: number;
    commission_rate: number;
    total_commission: number;
    vat: number;
    gross_commission: number;
    agent_id: string;
    agent_name: string;
    agent_share: number;
    agent_amount: number;
    office_amount: number;
    co_broker_id?: string;
    co_broker_name?: string;
    co_broker_amount?: number;
    status: CommissionStatus;
    collected_amount: number;
    due_date?: string;
    collected_date?: string;
}

// Danışman komisyon özeti
export interface AgentCommissionSummary {
    agent_id: string;
    agent_name: string;
    model: CommissionModel;
    sales_count: number;
    total_sales_volume: number;
    total_commission: number;
    collected: number;
    pending: number;
}

// Aylık gelir verisi
export interface MonthlyRevenue {
    month: string;
    year: number;
    total: number;
    collected: number;
    agents: { name: string; amount: number }[];
}

// Komisyon durumları
export const COMMISSION_STATUSES: Record<CommissionStatus, { label: string; color: string }> = {
    bekleyen: { label: "Bekleyen", color: "bg-yellow-100 text-yellow-700" },
    onaylandi: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
    tahsil_edildi: { label: "Tahsil Edildi", color: "bg-green-100 text-green-700" },
    iptal: { label: "İptal", color: "bg-red-100 text-red-700" },
};

// Demo danışman komisyon özetleri
export const DEMO_AGENT_SUMMARIES: AgentCommissionSummary[] = [
    {
        agent_id: "user-1",
        agent_name: "Demo Kullanıcı",
        model: "standart",
        sales_count: 8,
        total_sales_volume: 28500000,
        total_commission: 684000,
        collected: 450000,
        pending: 234000,
    },
    {
        agent_id: "user-2",
        agent_name: "Ali Yılmaz",
        model: "yuksek",
        sales_count: 12,
        total_sales_volume: 45000000,
        total_commission: 945000,
        collected: 720000,
        pending: 225000,
    },
    {
        agent_id: "user-3",
        agent_name: "Zeynep Kaya",
        model: "baslangic",
        sales_count: 3,
        total_sales_volume: 8500000,
        total_commission: 170000,
        collected: 85000,
        pending: 85000,
    },
];

// Demo komisyon işlemleri
export const DEMO_TRANSACTIONS: CommissionTransaction[] = [
    {
        id: "1",
        date: "2026-01-08",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        customer_name: "Mehmet Yılmaz",
        sale_price: 4500000,
        commission_rate: 4,
        total_commission: 180000,
        vat: 36000,
        gross_commission: 216000,
        agent_id: "user-1",
        agent_name: "Demo Kullanıcı",
        agent_share: 60,
        agent_amount: 108000,
        office_amount: 72000,
        status: "bekleyen",
        collected_amount: 0,
        due_date: "2026-01-20",
    },
    {
        id: "2",
        date: "2026-01-05",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        customer_name: "Ayşe Demir",
        sale_price: 8500000,
        commission_rate: 4,
        total_commission: 340000,
        vat: 68000,
        gross_commission: 408000,
        agent_id: "user-2",
        agent_name: "Ali Yılmaz",
        agent_share: 70,
        agent_amount: 238000,
        office_amount: 102000,
        co_broker_id: "user-1",
        co_broker_name: "Demo Kullanıcı",
        co_broker_amount: 119000,
        status: "onaylandi",
        collected_amount: 204000,
        due_date: "2026-01-15",
    },
    {
        id: "3",
        date: "2025-12-28",
        property_id: "2",
        property_title: "Merkezi Konumda Ofis",
        customer_name: "ABC Şirketi",
        sale_price: 6200000,
        commission_rate: 3,
        total_commission: 186000,
        vat: 37200,
        gross_commission: 223200,
        agent_id: "user-1",
        agent_name: "Demo Kullanıcı",
        agent_share: 60,
        agent_amount: 111600,
        office_amount: 74400,
        status: "tahsil_edildi",
        collected_amount: 223200,
        collected_date: "2025-12-30",
    },
    {
        id: "4",
        date: "2025-12-20",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        customer_name: "Fatma Korkmaz",
        sale_price: 2800000,
        commission_rate: 4,
        total_commission: 112000,
        vat: 22400,
        gross_commission: 134400,
        agent_id: "user-3",
        agent_name: "Zeynep Kaya",
        agent_share: 50,
        agent_amount: 56000,
        office_amount: 56000,
        status: "tahsil_edildi",
        collected_amount: 134400,
        collected_date: "2025-12-25",
    },
    {
        id: "5",
        date: "2025-12-15",
        property_id: "5",
        property_title: "Yatırımlık Kiralık Daire",
        customer_name: "Burak Şahin",
        sale_price: 3200000,
        commission_rate: 4,
        total_commission: 128000,
        vat: 25600,
        gross_commission: 153600,
        agent_id: "user-2",
        agent_name: "Ali Yılmaz",
        agent_share: 70,
        agent_amount: 89600,
        office_amount: 38400,
        status: "tahsil_edildi",
        collected_amount: 153600,
        collected_date: "2025-12-20",
    },
];

// Demo aylık gelir
export const DEMO_MONTHLY_REVENUES: MonthlyRevenue[] = [
    { month: "Şub", year: 2025, total: 180000, collected: 180000, agents: [{ name: "Demo", amount: 108000 }, { name: "Ali", amount: 72000 }] },
    { month: "Mar", year: 2025, total: 220000, collected: 220000, agents: [{ name: "Demo", amount: 88000 }, { name: "Ali", amount: 132000 }] },
    { month: "Nis", year: 2025, total: 350000, collected: 350000, agents: [{ name: "Demo", amount: 175000 }, { name: "Ali", amount: 105000 }, { name: "Zeynep", amount: 70000 }] },
    { month: "May", year: 2025, total: 280000, collected: 280000, agents: [{ name: "Demo", amount: 140000 }, { name: "Ali", amount: 140000 }] },
    { month: "Haz", year: 2025, total: 420000, collected: 420000, agents: [{ name: "Demo", amount: 168000 }, { name: "Ali", amount: 210000 }, { name: "Zeynep", amount: 42000 }] },
    { month: "Tem", year: 2025, total: 380000, collected: 380000, agents: [{ name: "Demo", amount: 152000 }, { name: "Ali", amount: 190000 }, { name: "Zeynep", amount: 38000 }] },
    { month: "Ağu", year: 2025, total: 290000, collected: 290000, agents: [{ name: "Demo", amount: 145000 }, { name: "Ali", amount: 145000 }] },
    { month: "Eyl", year: 2025, total: 450000, collected: 450000, agents: [{ name: "Demo", amount: 180000 }, { name: "Ali", amount: 225000 }, { name: "Zeynep", amount: 45000 }] },
    { month: "Eki", year: 2025, total: 520000, collected: 520000, agents: [{ name: "Demo", amount: 208000 }, { name: "Ali", amount: 260000 }, { name: "Zeynep", amount: 52000 }] },
    { month: "Kas", year: 2025, total: 480000, collected: 480000, agents: [{ name: "Demo", amount: 192000 }, { name: "Ali", amount: 240000 }, { name: "Zeynep", amount: 48000 }] },
    { month: "Ara", year: 2025, total: 510800, collected: 510800, agents: [{ name: "Demo", amount: 204320 }, { name: "Ali", amount: 243000 }, { name: "Zeynep", amount: 63480 }] },
    { month: "Oca", year: 2026, total: 624000, collected: 204000, agents: [{ name: "Demo", amount: 108000 }, { name: "Ali", amount: 238000 }, { name: "Zeynep", amount: 0 }] },
];

// Yardımcı fonksiyonlar
export function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M ₺`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K ₺`;
    }
    return `${amount.toLocaleString("tr-TR")} ₺`;
}

export function calculateCommission(
    salePrice: number,
    commissionRate: number,
    agentShare: number,
    hasCoBroker: boolean = false
): {
    totalCommission: number;
    vat: number;
    grossCommission: number;
    agentAmount: number;
    officeAmount: number;
    coBrokerAmount?: number;
} {
    const totalCommission = salePrice * (commissionRate / 100);
    const vat = totalCommission * 0.20;
    const grossCommission = totalCommission + vat;

    let agentAmount = grossCommission * (agentShare / 100);
    const officeAmount = grossCommission - agentAmount;

    let coBrokerAmount: number | undefined;
    if (hasCoBroker) {
        coBrokerAmount = agentAmount / 2;
        agentAmount = agentAmount / 2;
    }

    return {
        totalCommission,
        vat,
        grossCommission,
        agentAmount,
        officeAmount,
        coBrokerAmount,
    };
}
