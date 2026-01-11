"use client";

import { useState, useMemo } from "react";
import {
    Award,
    Lock,
    Star,
    Trophy,
    Check,
    Share2,
    Filter,
    Sparkles,
    Crown,
    Gem,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    BADGES,
    DEMO_CURRENT_USER,
    BadgeType,
} from "@/types/gamification";

// Rozet ilerleme verileri (demo)
const BADGE_PROGRESS: Record<BadgeType, { current: number; target: number }> = {
    ilk_adim: { current: 1, target: 1 },
    iletisim_ustasi: { current: 62, target: 100 },
    on_gosterim: { current: 10, target: 10 },
    ilk_satis: { current: 1, target: 1 },
    haftalik_sampiyon: { current: 0, target: 1 },
    aylik_yildiz: { current: 0, target: 1 },
    referans_krali: { current: 3, target: 5 },
    foto_ustasi: { current: 45, target: 100 },
    yedi_gun_streak: { current: 12, target: 7 },
    elite_danisman: { current: 3250, target: 15000 },
};

// Kazanılma tarihleri (demo)
const BADGE_EARNED_DATES: Partial<Record<BadgeType, string>> = {
    ilk_adim: "2025-06-20",
    on_gosterim: "2025-09-15",
    ilk_satis: "2025-08-10",
    yedi_gun_streak: "2026-01-05",
};

// Nadir rozetler
const RARE_BADGES: BadgeType[] = ["haftalik_sampiyon", "aylik_yildiz", "elite_danisman"];

type FilterType = "all" | "earned" | "locked";

export default function BadgesPage() {
    const [currentUser] = useState(DEMO_CURRENT_USER);
    const [filter, setFilter] = useState<FilterType>("all");
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
    const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

    // Kazanılmış rozetler
    const earnedBadges = currentUser.badges;

    // Filtrelenmiş rozetler
    const filteredBadges = useMemo(() => {
        const allBadges = Object.keys(BADGES) as BadgeType[];

        switch (filter) {
            case "earned":
                return allBadges.filter((b) => earnedBadges.includes(b));
            case "locked":
                return allBadges.filter((b) => !earnedBadges.includes(b));
            default:
                return allBadges;
        }
    }, [filter, earnedBadges]);

    // İstatistikler
    const stats = {
        total: Object.keys(BADGES).length,
        earned: earnedBadges.length,
        rare: earnedBadges.filter((b) => RARE_BADGES.includes(b)).length,
    };

    // Rozet kartına tıklama
    const handleBadgeClick = (badgeKey: BadgeType) => {
        setSelectedBadge(badgeKey);
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Award className="w-7 h-7 text-yellow-500" />
                        Rozet Koleksiyonu
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Başarılarınızı sergileyin
                    </p>
                </div>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.earned}</p>
                        <p className="text-sm text-gray-500">Kazanılan</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-gray-600">{stats.total - stats.earned}</p>
                        <p className="text-sm text-gray-500">Kilitli</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">{stats.rare}</p>
                        <p className="text-sm text-gray-500">Nadir</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtre */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <TabsList>
                    <TabsTrigger value="all">
                        Tümü ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="earned">
                        Kazanılanlar ({stats.earned})
                    </TabsTrigger>
                    <TabsTrigger value="locked">
                        Kilitli ({stats.total - stats.earned})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Nadir Rozetler Bölümü */}
            {filter !== "earned" && (
                <div className="space-y-3">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Gem className="w-5 h-5 text-purple-500" />
                        Nadir Rozetler
                        <Badge variant="secondary" className="text-xs">Sadece %5 kazandı</Badge>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {RARE_BADGES.map((badgeKey) => {
                            const badge = BADGES[badgeKey];
                            const isEarned = earnedBadges.includes(badgeKey);
                            const progress = BADGE_PROGRESS[badgeKey];
                            const earnedDate = BADGE_EARNED_DATES[badgeKey];

                            return (
                                <BadgeCard
                                    key={badgeKey}
                                    badgeKey={badgeKey}
                                    badge={badge}
                                    isEarned={isEarned}
                                    isRare={true}
                                    progress={progress}
                                    earnedDate={earnedDate}
                                    onClick={() => handleBadgeClick(badgeKey)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Rozet Grid'i */}
            <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {filter === "all" ? "Tüm Rozetler" : filter === "earned" ? "Kazanılan Rozetler" : "Kilitli Rozetler"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBadges
                        .filter((b) => !RARE_BADGES.includes(b) || filter === "earned")
                        .map((badgeKey) => {
                            const badge = BADGES[badgeKey];
                            const isEarned = earnedBadges.includes(badgeKey);
                            const progress = BADGE_PROGRESS[badgeKey];
                            const earnedDate = BADGE_EARNED_DATES[badgeKey];

                            return (
                                <BadgeCard
                                    key={badgeKey}
                                    badgeKey={badgeKey}
                                    badge={badge}
                                    isEarned={isEarned}
                                    isRare={RARE_BADGES.includes(badgeKey)}
                                    progress={progress}
                                    earnedDate={earnedDate}
                                    onClick={() => handleBadgeClick(badgeKey)}
                                />
                            );
                        })}
                </div>
            </div>

            {/* Rozet Detay Modal */}
            {selectedBadge && (
                <BadgeDetailModal
                    badgeKey={selectedBadge}
                    badge={BADGES[selectedBadge]}
                    isEarned={earnedBadges.includes(selectedBadge)}
                    isRare={RARE_BADGES.includes(selectedBadge)}
                    progress={BADGE_PROGRESS[selectedBadge]}
                    earnedDate={BADGE_EARNED_DATES[selectedBadge]}
                    onClose={() => setSelectedBadge(null)}
                />
            )}

            {/* Rozet Kazandı Animasyonu (Demo için buton) */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Demo: Rozet Kazanma Animasyonu</p>
                            <p className="text-sm text-gray-500">Animasyonu test etmek için tıklayın</p>
                        </div>
                        <Button onClick={() => setShowUnlockAnimation(true)}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Test Et
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Unlock Animation Modal */}
            {showUnlockAnimation && (
                <BadgeUnlockAnimation
                    badge={BADGES.referans_krali}
                    onClose={() => setShowUnlockAnimation(false)}
                />
            )}
        </div>
    );
}

// Rozet Kartı
function BadgeCard({
    badgeKey,
    badge,
    isEarned,
    isRare,
    progress,
    earnedDate,
    onClick,
}: {
    badgeKey: BadgeType;
    badge: typeof BADGES[BadgeType];
    isEarned: boolean;
    isRare: boolean;
    progress: { current: number; target: number };
    earnedDate?: string;
    onClick: () => void;
}) {
    const progressPercent = Math.min((progress.current / progress.target) * 100, 100);

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:scale-105",
                isEarned
                    ? isRare
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 ring-2 ring-purple-300"
                        : "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                    : "bg-gray-50 dark:bg-gray-800/50 opacity-60"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 text-center">
                {/* Rozet İkonu */}
                <div className={cn(
                    "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 relative",
                    isEarned
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700"
                )}>
                    {isEarned ? (
                        <span className="text-3xl">{badge.icon}</span>
                    ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                    )}
                    {isRare && isEarned && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Gem className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/* Rozet Adı */}
                <p className={cn("font-semibold text-sm", !isEarned && "text-gray-400")}>
                    {badge.label}
                </p>

                {/* XP Bonus */}
                <Badge
                    variant="secondary"
                    className={cn(
                        "mt-2 text-xs",
                        isEarned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}
                >
                    +{badge.xpBonus} XP
                </Badge>

                {/* İlerleme veya Tarih */}
                {isEarned ? (
                    <p className="text-xs text-gray-500 mt-2">
                        {earnedDate && new Date(earnedDate).toLocaleDateString("tr-TR")}
                    </p>
                ) : (
                    <div className="mt-3">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {progress.current} / {progress.target}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Rozet Detay Modal
function BadgeDetailModal({
    badgeKey,
    badge,
    isEarned,
    isRare,
    progress,
    earnedDate,
    onClose,
}: {
    badgeKey: BadgeType;
    badge: typeof BADGES[BadgeType];
    isEarned: boolean;
    isRare: boolean;
    progress: { current: number; target: number };
    earnedDate?: string;
    onClose: () => void;
}) {
    const progressPercent = Math.min((progress.current / progress.target) * 100, 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className={cn(
                "relative w-full max-w-sm",
                isRare && "ring-2 ring-purple-400"
            )}>
                <CardContent className="p-6 text-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {/* Büyük İkon */}
                    <div className={cn(
                        "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 relative",
                        isEarned
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl"
                            : "bg-gray-200 dark:bg-gray-700"
                    )}>
                        {isEarned ? (
                            <span className="text-5xl">{badge.icon}</span>
                        ) : (
                            <Lock className="w-10 h-10 text-gray-400" />
                        )}
                        {isRare && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <Gem className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Rozet Adı */}
                    <h2 className="text-xl font-bold">{badge.label}</h2>

                    {isRare && (
                        <Badge className="mt-1 bg-purple-100 text-purple-700">Nadir Rozet</Badge>
                    )}

                    {/* Açıklama */}
                    <p className="text-gray-500 mt-3">{badge.description}</p>

                    {/* Kazanılma Koşulu */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                        <p className="text-sm text-gray-500">Koşul:</p>
                        <p className="font-medium">{badge.condition}</p>
                    </div>

                    {/* XP Bonus */}
                    <div className="flex justify-center mt-4">
                        <Badge className="bg-green-100 text-green-700 text-lg px-4 py-1">
                            +{badge.xpBonus} XP
                        </Badge>
                    </div>

                    {/* İlerleme veya Kazanılma Tarihi */}
                    {isEarned ? (
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <Check className="w-5 h-5" />
                                <span>Kazanıldı!</span>
                            </div>
                            {earnedDate && (
                                <p className="text-sm text-gray-500">
                                    {new Date(earnedDate).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            )}
                            <Button variant="outline" className="w-full">
                                <Share2 className="w-4 h-4 mr-2" />
                                Paylaş
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-sm font-medium">
                                {progress.current} / {progress.target}
                            </p>
                            <p className="text-xs text-gray-500">
                                {progress.target - progress.current} kaldı
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Rozet Kazanma Animasyonu
function BadgeUnlockAnimation({
    badge,
    onClose,
}: {
    badge: typeof BADGES[BadgeType];
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Konfeti Efekti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10%`,
                            backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
                                Math.floor(Math.random() * 6)
                            ],
                            borderRadius: Math.random() > 0.5 ? "50%" : "0",
                            animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                            animationDelay: `${Math.random() * 1}s`,
                        }}
                    />
                ))}
            </div>

            <Card className="relative w-full max-w-sm animate-pulse">
                <CardContent className="p-8 text-center">
                    <div className="relative">
                        {/* Parlama efekti */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-yellow-400/30 rounded-full animate-ping" />
                        </div>

                        {/* Rozet */}
                        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
                            <span className="text-6xl">{badge.icon}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="text-sm text-yellow-600 font-medium">🎉 YENİ ROZET!</p>
                        <h2 className="text-2xl font-bold">{badge.label}</h2>
                        <p className="text-gray-500">{badge.description}</p>

                        <div className="flex justify-center mt-4">
                            <Badge className="bg-green-100 text-green-700 text-lg px-6 py-2">
                                +{badge.xpBonus} XP
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Kapat
                        </Button>
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Share2 className="w-4 h-4 mr-2" />
                            Paylaş
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(720deg);
          }
        }
      `}</style>
        </div>
    );
}
