// Workspace ve Multi-Tenant tipleri

export type PlanType = 'solo' | 'office';
export type BillingMode = 'self' | 'broker';
export type WorkspaceRole = 'broker' | 'danisman';

// Workspace (Ofis/Tenant)
export interface Workspace {
    id: string;
    name: string;
    slug: string;
    plan_type: PlanType;
    billing_mode: BillingMode;
    owner_id: string;
    max_members: number;
    logo_url?: string;
    created_at: string;
    updated_at?: string;
}

// Workspace üyeliği
export interface WorkspaceMember {
    id: string;
    workspace_id: string;
    user_id: string;
    role: WorkspaceRole;
    invited_at: string;
    joined_at?: string;
    invited_by?: string;
}

// Workspace daveti
export interface WorkspaceInvite {
    id: string;
    workspace_id: string;
    email?: string;
    invite_code: string;
    role: WorkspaceRole;
    expires_at: string;
    used_at?: string;
    created_by: string;
}

// Plan özellikleri
export const PLAN_FEATURES: Record<PlanType, {
    label: string;
    maxMembers: number;
    features: string[];
    price: string;
}> = {
    solo: {
        label: "Danışman Planı",
        maxMembers: 1,
        features: [
            "Portföy yönetimi",
            "Müşteri takibi",
            "Randevu yönetimi",
            "Temel raporlar",
        ],
        price: "199 ₺/ay",
    },
    office: {
        label: "Ofis Planı",
        maxMembers: 50,
        features: [
            "Tüm danışman özellikleri",
            "Ekip yönetimi",
            "Danışman performans takibi",
            "Gelişmiş raporlar",
            "Komisyon yönetimi",
            "Lead dağıtımı",
        ],
        price: "599 ₺/ay + 99 ₺/danışman",
    },
};

// Faturalama modları
export const BILLING_MODES: Record<BillingMode, {
    label: string;
    description: string;
}> = {
    self: {
        label: "Bireysel Ödeme",
        description: "Her danışman kendi ücretini öder",
    },
    broker: {
        label: "Merkezi Ödeme",
        description: "Broker tüm ekibin ücretini öder",
    },
};

// Rol yetkileri
export const ROLE_PERMISSIONS: Record<WorkspaceRole, {
    label: string;
    permissions: string[];
}> = {
    broker: {
        label: "Broker / Yönetici",
        permissions: [
            "Tüm verileri görüntüle",
            "Danışman ekle/çıkar",
            "Faturalama yönetimi",
            "Ayarları değiştir",
            "Raporları görüntüle",
        ],
    },
    danisman: {
        label: "Danışman",
        permissions: [
            "Kendi verilerini yönet",
            "Kendi raporlarını gör",
        ],
    },
};
