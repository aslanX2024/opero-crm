// Bildirim tipleri ve sabitleri

export type NotificationType =
    | "deal_stage_change"    // Deal aşama değişimi
    | "new_lead"             // Yeni lead/müşteri
    | "appointment_reminder" // Randevu hatırlatma
    | "property_update"      // Mülk güncelleme
    | "commission"           // Komisyon bildirimi
    | "xp_earned"            // XP kazanıldı
    | "level_up"             // Seviye atladı
    | "badge_earned"         // Rozet kazandı
    | "system"               // Sistem bildirimi
    | "message";             // Mesaj bildirimi

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    link?: string;           // Tıklandığında yönlendirilecek URL
    metadata?: Record<string, unknown>;
    is_read: boolean;
    created_at: string;
    read_at?: string;
}

// Bildirim tipi ikonları
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
    deal_stage_change: "🔄",
    new_lead: "👤",
    appointment_reminder: "📅",
    property_update: "🏠",
    commission: "💰",
    xp_earned: "⭐",
    level_up: "🎉",
    badge_earned: "🏅",
    system: "🔔",
    message: "💬",
};

// Bildirim tipi renkleri (Tailwind classes)
export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
    deal_stage_change: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    new_lead: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    appointment_reminder: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    property_update: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    commission: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    xp_earned: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    level_up: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    badge_earned: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    system: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    message: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
};

// Demo bildirimler
export const DEMO_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        user_id: "demo-user-id",
        type: "deal_stage_change",
        title: "Fırsat aşaması değişti",
        message: "Kadıköy 3+1 Satış fırsatı 'Müzakere' aşamasına taşındı",
        link: "/dashboard/pipeline",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 dk önce
    },
    {
        id: "2",
        user_id: "demo-user-id",
        type: "appointment_reminder",
        title: "Randevu hatırlatması",
        message: "Bugün 14:00'te Ahmet Yılmaz ile gösterim randevunuz var",
        link: "/dashboard/appointments",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 dk önce
    },
    {
        id: "3",
        user_id: "demo-user-id",
        type: "xp_earned",
        title: "+50 XP kazandınız!",
        message: "Yeni mülk ekleyerek 50 XP kazandınız",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 saat önce
    },
    {
        id: "4",
        user_id: "demo-user-id",
        type: "new_lead",
        title: "Yeni müşteri adayı",
        message: "Web sitenizden yeni bir müşteri adayı formu dolduruld",
        link: "/dashboard/marketing/leads",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 saat önce
    },
    {
        id: "5",
        user_id: "demo-user-id",
        type: "commission",
        title: "Komisyon onaylandı",
        message: "Beşiktaş 4+1 Satış için ₺45.000 komisyon onaylandı",
        link: "/dashboard/finance",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 gün önce
    },
];

// Zaman formatla
export function formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;

    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}
