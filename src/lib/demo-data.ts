// Tüm demo verileri merkezi dosya
// Bu dosya demo modunda kullanılır, production'da Supabase'den veri çekilir

// =============================================================================
// DEMO MODE FLAG
// =============================================================================

export const isDemoMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (
        new URLSearchParams(window.location.search).get('demo') === 'true' ||
        localStorage.getItem('demo_mode') === 'true' ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );
};

// =============================================================================
// DEMO USER
// =============================================================================

export const DEMO_USER = {
    id: "demo-user-id",
    email: "demo@opero.tr",
    full_name: "Demo Kullanıcı",
    phone: "0532 123 45 67",
    role: "danisman" as const,
    xp: 450,
    workspace_id: "demo-workspace-id",
    avatar_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export const DEMO_WORKSPACE = {
    id: "demo-workspace-id",
    name: "Demo Ofis",
    slug: "demo-ofis",
    plan_type: "office" as const,
    billing_mode: "broker" as const,
    owner_id: "demo-user-id",
    max_members: 10,
    created_at: new Date().toISOString(),
};

// =============================================================================
// DEMO AGENTS
// =============================================================================

export const DEMO_AGENTS = [
    { id: "user-1", name: "Demo Kullanıcı", region: "Kadıköy", role: "danisman" },
    { id: "user-2", name: "Ali Yılmaz", region: "Beşiktaş", role: "danisman" },
    { id: "user-3", name: "Zeynep Kaya", region: "Ataşehir", role: "danisman" },
];

// =============================================================================
// DEMO PROPERTIES
// =============================================================================

export { DEMO_PROPERTIES } from "@/types/property";

// =============================================================================
// DEMO CUSTOMERS
// =============================================================================

export { DEMO_CUSTOMERS } from "@/types/customer";

// =============================================================================
// DEMO DEALS (PIPELINE)
// =============================================================================

export { DEMO_DEALS } from "@/types/pipeline";

// =============================================================================
// DEMO APPOINTMENTS
// =============================================================================

export { DEMO_APPOINTMENTS } from "@/types/appointment";

// =============================================================================
// DEMO SIGNBOARDS
// =============================================================================

export { DEMO_SIGNBOARDS } from "@/types/signboard";

// =============================================================================
// DEMO PORTALS
// =============================================================================

export { DEMO_PORTALS, DEMO_PORTAL_LISTINGS, DEMO_SYNC_LOGS } from "@/types/portal";

// =============================================================================
// DEMO MARKETING
// =============================================================================

export {
    DEMO_CHANNELS,
    DEMO_BROCHURES,
    DEMO_CAMPAIGNS,
    DEMO_WEEKLY_TRENDS,
} from "@/types/marketing";

// =============================================================================
// DEMO LEADS
// =============================================================================

export { DEMO_LEADS } from "@/types/lead";

// =============================================================================
// DEMO GAMIFICATION
// =============================================================================

export {
    DEMO_CURRENT_USER,
    DEMO_LEADERBOARD,
    DEMO_WEEKLY_CONTEST,
} from "@/types/gamification";

// =============================================================================
// DEMO FINANCE
// =============================================================================

export {
    DEMO_AGENT_SUMMARIES,
    DEMO_TRANSACTIONS,
    DEMO_MONTHLY_REVENUES,
} from "@/types/finance";

// =============================================================================
// DEMO BROKER
// =============================================================================

export {
    DEMO_AGENT_PERFORMANCES,
    DEMO_OFFICE_METRICS,
    DEMO_BROKER_ALERTS,
    DEMO_SALES_TREND,
} from "@/types/broker";

// =============================================================================
// DEMO MODE RESTRICTIONS
// =============================================================================

export type DemoAction =
    | "delete"
    | "export"
    | "payment"
    | "integration"
    | "invite"
    | "settings";

export const RESTRICTED_ACTIONS: DemoAction[] = [
    "delete",
    "export",
    "payment",
    "integration",
];

export const canPerformAction = (action: DemoAction): boolean => {
    if (!isDemoMode()) return true;
    return !RESTRICTED_ACTIONS.includes(action);
};

export const getDemoRestrictionMessage = (action: DemoAction): string => {
    const messages: Record<DemoAction, string> = {
        delete: "Demo modunda silme işlemi yapılamaz",
        export: "Demo modunda dışa aktarma yapılamaz",
        payment: "Demo modunda ödeme işlemi yapılamaz",
        integration: "Demo modunda entegrasyon bağlanamaz",
        invite: "Demo modunda davet gönderilemez",
        settings: "Demo modunda ayarlar değiştirilemez",
    };
    return messages[action];
};
