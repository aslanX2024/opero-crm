// Oyunlaştırma tipleri ve sabit değerler

export type ActivityType =
    | "mulk_ekleme"
    | "tam_dolu_mulk"
    | "foto_ekleme"
    | "musteri_ekleme"
    | "ilk_iletisim"
    | "gosterim"
    | "feedback"
    | "teklif_alma"
    | "satis_kapama"
    | "gunluk_giris"
    | "haftalik_hedef";

export type BadgeType =
    | "ilk_adim"
    | "iletisim_ustasi"
    | "on_gosterim"
    | "ilk_satis"
    | "haftalik_sampiyon"
    | "aylik_yildiz"
    | "referans_krali"
    | "foto_ustasi"
    | "yedi_gun_streak"
    | "elite_danisman";

export type LevelName = "caylak" | "danisman" | "uzman" | "master" | "elite";

// XP değerleri
export const XP_VALUES: Record<ActivityType, { xp: number; label: string }> = {
    mulk_ekleme: { xp: 50, label: "Mülk ekleme" },
    tam_dolu_mulk: { xp: 25, label: "Tam dolu mülk" },
    foto_ekleme: { xp: 10, label: "Fotoğraf ekleme" },
    musteri_ekleme: { xp: 30, label: "Müşteri ekleme" },
    ilk_iletisim: { xp: 10, label: "İlk iletişim" },
    gosterim: { xp: 30, label: "Gösterim yapma" },
    feedback: { xp: 10, label: "Feedback doldurma" },
    teklif_alma: { xp: 50, label: "Teklif alma" },
    satis_kapama: { xp: 500, label: "Satış kapama" },
    gunluk_giris: { xp: 5, label: "Günlük giriş" },
    haftalik_hedef: { xp: 100, label: "Haftalık hedef" },
};

// Seviye sistemi
export const LEVELS: Record<LevelName, {
    minXP: number;
    maxXP: number;
    label: string;
    icon: string;
    color: string;
    advantage: string;
}> = {
    caylak: { minXP: 0, maxXP: 500, label: "Çaylak", icon: "🌱", color: "bg-gray-500", advantage: "Eğitim içerikleri" },
    danisman: { minXP: 500, maxXP: 2000, label: "Danışman", icon: "⭐", color: "bg-blue-500", advantage: "Temel özellikler" },
    uzman: { minXP: 2000, maxXP: 5000, label: "Uzman", icon: "💎", color: "bg-purple-500", advantage: "Gelişmiş raporlar" },
    master: { minXP: 5000, maxXP: 15000, label: "Master", icon: "👑", color: "bg-yellow-500", advantage: "Öncelikli lead" },
    elite: { minXP: 15000, maxXP: Infinity, label: "Elite", icon: "🏆", color: "bg-gradient-to-r from-yellow-400 to-orange-500", advantage: "VIP müşteri havuzu" },
};

// Rozet sistemi
export const BADGES: Record<BadgeType, {
    label: string;
    icon: string;
    description: string;
    xpBonus: number;
    condition: string;
}> = {
    ilk_adim: { label: "İlk Adım", icon: "🎯", description: "İlk mülk eklendi", xpBonus: 50, condition: "1 mülk ekle" },
    iletisim_ustasi: { label: "İletişim Ustası", icon: "📞", description: "100 müşteri araması", xpBonus: 100, condition: "100 arama yap" },
    on_gosterim: { label: "10 Gösterim", icon: "🏠", description: "10 gösterim tamamlandı", xpBonus: 150, condition: "10 gösterim yap" },
    ilk_satis: { label: "İlk Satış", icon: "🎉", description: "İlk deal kapandı", xpBonus: 200, condition: "1 satış kapa" },
    haftalik_sampiyon: { label: "Haftalık Şampiyon", icon: "🥇", description: "Haftanın en çok XP'si", xpBonus: 250, condition: "Haftalık 1. ol" },
    aylik_yildiz: { label: "Aylık Yıldız", icon: "⭐", description: "Ayın en çok satışı", xpBonus: 500, condition: "Aylık 1. ol" },
    referans_krali: { label: "Referans Kralı", icon: "👥", description: "5 referans müşteri", xpBonus: 200, condition: "5 referans getir" },
    foto_ustasi: { label: "Fotoğraf Ustası", icon: "📷", description: "100 mülk fotoğrafı", xpBonus: 100, condition: "100 fotoğraf yükle" },
    yedi_gun_streak: { label: "7 Gün Streak", icon: "⚡", description: "7 gün üst üste giriş", xpBonus: 100, condition: "7 gün streak" },
    elite_danisman: { label: "Elite Danışman", icon: "🏆", description: "Seviye 5'e ulaştı", xpBonus: 1000, condition: "Elite seviyesine ulaş" },
};

// Kullanıcı profili
export interface UserProfile {
    id: string;
    name: string;
    avatar?: string;
    totalXP: number;
    level: LevelName;
    badges: BadgeType[];
    streak: number;
    lastLogin: string;
    joinDate: string;
    stats: {
        totalSales: number;
        totalShowings: number;
        totalProperties: number;
        totalCustomers: number;
    };
}

// Liderlik tablosu girişi
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    avatar?: string;
    level: LevelName;
    totalXP: number;
    periodXP: number;
    lastActivity: string;
    isCurrentUser?: boolean;
}

// Haftalık yarışma
export interface WeeklyContest {
    id: string;
    title: string;
    description: string;
    prize: string;
    startDate: string;
    endDate: string;
    participants: number;
    currentLeader?: string;
}

// Demo kullanıcı profili
export const DEMO_CURRENT_USER: UserProfile = {
    id: "user-1",
    name: "Demo Kullanıcı",
    totalXP: 3250,
    level: "uzman",
    badges: ["ilk_adim", "on_gosterim", "ilk_satis", "yedi_gun_streak"],
    streak: 12,
    lastLogin: "2026-01-09T08:00:00Z",
    joinDate: "2025-06-15",
    stats: {
        totalSales: 8,
        totalShowings: 45,
        totalProperties: 28,
        totalCustomers: 62,
    },
};

// Demo liderlik tablosu
export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, userId: "user-2", name: "Ali Yılmaz", level: "master", totalXP: 8450, periodXP: 1250, lastActivity: "2 saat önce" },
    { rank: 2, userId: "user-4", name: "Mehmet Demir", level: "uzman", totalXP: 4800, periodXP: 980, lastActivity: "5 dakika önce" },
    { rank: 3, userId: "user-5", name: "Ayşe Kara", level: "uzman", totalXP: 4200, periodXP: 750, lastActivity: "1 saat önce" },
    { rank: 4, userId: "user-1", name: "Demo Kullanıcı", level: "uzman", totalXP: 3250, periodXP: 620, lastActivity: "Şimdi", isCurrentUser: true },
    { rank: 5, userId: "user-3", name: "Zeynep Kaya", level: "danisman", totalXP: 1850, periodXP: 480, lastActivity: "3 saat önce" },
    { rank: 6, userId: "user-6", name: "Fatma Şahin", level: "danisman", totalXP: 1500, periodXP: 350, lastActivity: "6 saat önce" },
    { rank: 7, userId: "user-7", name: "Burak Özkan", level: "danisman", totalXP: 1200, periodXP: 280, lastActivity: "1 gün önce" },
    { rank: 8, userId: "user-8", name: "Elif Yıldırım", level: "caylak", totalXP: 450, periodXP: 150, lastActivity: "2 gün önce" },
    { rank: 9, userId: "user-9", name: "Can Arslan", level: "caylak", totalXP: 320, periodXP: 120, lastActivity: "3 gün önce" },
    { rank: 10, userId: "user-10", name: "Selin Aydın", level: "caylak", totalXP: 180, periodXP: 80, lastActivity: "1 hafta önce" },
];

// Demo haftalık yarışma
export const DEMO_WEEKLY_CONTEST: WeeklyContest = {
    id: "w-2026-02",
    title: "Ocak 2. Hafta Şampiyonası",
    description: "En çok XP kazanan danışman!",
    prize: "500 ₺ Hediye Çeki + Özel Rozet",
    startDate: "2026-01-06",
    endDate: "2026-01-12",
    participants: 10,
    currentLeader: "Ali Yılmaz",
};

// Yardımcı fonksiyonlar
export function getLevelFromXP(xp: number): LevelName {
    if (xp >= 15000) return "elite";
    if (xp >= 5000) return "master";
    if (xp >= 2000) return "uzman";
    if (xp >= 500) return "danisman";
    return "caylak";
}

export function getXPProgress(xp: number): { current: number; target: number; percentage: number } {
    const level = getLevelFromXP(xp);
    const levelInfo = LEVELS[level];

    if (level === "elite") {
        return { current: xp, target: xp, percentage: 100 };
    }

    const nextLevel = Object.entries(LEVELS).find(([_, info]) => info.minXP > levelInfo.minXP);
    if (!nextLevel) {
        return { current: xp, target: xp, percentage: 100 };
    }

    const [_, nextInfo] = nextLevel;
    const progressXP = xp - levelInfo.minXP;
    const requiredXP = nextInfo.minXP - levelInfo.minXP;
    const percentage = Math.min(Math.round((progressXP / requiredXP) * 100), 100);

    return { current: xp, target: nextInfo.minXP, percentage };
}

export function formatTimeRemaining(endDate: string): string {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Sona erdi";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
}
