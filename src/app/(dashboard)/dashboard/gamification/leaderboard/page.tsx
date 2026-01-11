"use client";

import { useState, useMemo } from "react";
import {
    Trophy,
    Medal,
    Award,
    Star,
    Zap,
    Crown,
    Target,
    Clock,
    TrendingUp,
    Users,
    Gift,
    Calendar,
    ChevronRight,
    Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    DEMO_LEADERBOARD,
    DEMO_CURRENT_USER,
    DEMO_WEEKLY_CONTEST,
    LEVELS,
    BADGES,
    getXPProgress,
    formatTimeRemaining,
    LeaderboardEntry,
} from "@/types/gamification";

type Period = "daily" | "weekly" | "monthly" | "allTime";

export default function LeaderboardPage() {
    const [period, setPeriod] = useState<Period>("weekly");
    const [leaderboard] = useState(DEMO_LEADERBOARD);
    const [currentUser] = useState(DEMO_CURRENT_USER);
    const [contest] = useState(DEMO_WEEKLY_CONTEST);

    // Kullanıcının seviye bilgisi
    const userLevel = LEVELS[currentUser.level];
    const xpProgress = getXPProgress(currentUser.totalXP);

    // Kullanıcının sırası
    const userRank = leaderboard.find((e) => e.isCurrentUser)?.rank || 0;

    // Sıra ikonları
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <span className="text-2xl">🥇</span>;
            case 2: return <span className="text-2xl">🥈</span>;
            case 3: return <span className="text-2xl">🥉</span>;
            default: return <span className="text-lg font-bold text-gray-400">{rank}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        Liderlik Tablosu
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        En yüksek performans gösteren danışmanlar
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ana Liderlik Tablosu */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Dönem Seçici */}
                    <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                        <TabsList className="grid grid-cols-4">
                            <TabsTrigger value="daily">Günlük</TabsTrigger>
                            <TabsTrigger value="weekly">Haftalık</TabsTrigger>
                            <TabsTrigger value="monthly">Aylık</TabsTrigger>
                            <TabsTrigger value="allTime">Tüm Zamanlar</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Top 3 - Öne Çıkan */}
                    <div className="grid grid-cols-3 gap-4">
                        {leaderboard.slice(0, 3).map((entry, index) => {
                            const levelInfo = LEVELS[entry.level];
                            const positions = [1, 0, 2]; // 2., 1., 3. sıralama için
                            const position = positions[index];
                            const realEntry = leaderboard[position];

                            return (
                                <Card
                                    key={realEntry.userId}
                                    className={cn(
                                        "text-center transition-all",
                                        position === 0 && "ring-2 ring-yellow-400 shadow-lg scale-105",
                                        realEntry.isCurrentUser && "bg-blue-50 dark:bg-blue-900/20"
                                    )}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-center mb-2">
                                            {getRankIcon(realEntry.rank)}
                                        </div>
                                        <Avatar className={cn("w-16 h-16 mx-auto mb-2 ring-2",
                                            realEntry.rank === 1 && "ring-yellow-400",
                                            realEntry.rank === 2 && "ring-gray-400",
                                            realEntry.rank === 3 && "ring-orange-400"
                                        )}>
                                            <AvatarFallback className="text-xl">{realEntry.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold text-sm">{realEntry.name}</p>
                                        <div className="flex justify-center mt-1">
                                            <Badge className={cn("text-xs", levelInfo.color, "text-white")}>
                                                {levelInfo.icon} {levelInfo.label}
                                            </Badge>
                                        </div>
                                        <p className="text-xl font-bold mt-2 text-blue-600">{realEntry.periodXP.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">XP bu dönem</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Tam Liderlik Listesi */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {leaderboard.map((entry) => {
                                    const levelInfo = LEVELS[entry.level];

                                    return (
                                        <div
                                            key={entry.userId}
                                            className={cn(
                                                "flex items-center gap-4 p-4 transition-colors",
                                                entry.isCurrentUser
                                                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            )}
                                        >
                                            {/* Sıra */}
                                            <div className="w-10 flex justify-center">
                                                {getRankIcon(entry.rank)}
                                            </div>

                                            {/* Avatar */}
                                            <Avatar>
                                                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                            </Avatar>

                                            {/* İsim ve Seviye */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className={cn("font-medium", entry.isCurrentUser && "text-blue-600")}>
                                                        {entry.name}
                                                        {entry.isCurrentUser && <span className="text-xs ml-1">(Siz)</span>}
                                                    </p>
                                                    <Badge className={cn("text-xs", levelInfo.color, "text-white")}>
                                                        {levelInfo.icon}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500">{entry.lastActivity}</p>
                                            </div>

                                            {/* XP */}
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">{entry.periodXP.toLocaleString()} XP</p>
                                                <p className="text-xs text-gray-500">Toplam: {entry.totalXP.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sağ Sidebar */}
                <div className="space-y-4">
                    {/* Kullanıcı Profili */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                Profiliniz
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-4">
                                <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-blue-300">
                                    <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{currentUser.name}</p>
                                <Badge className={cn("mt-1", userLevel.color, "text-white")}>
                                    {userLevel.icon} {userLevel.label}
                                </Badge>
                            </div>

                            {/* XP ve Seviye Progress */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>XP</span>
                                    <span className="font-bold">{currentUser.totalXP.toLocaleString()}</span>
                                </div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                        style={{ width: `${xpProgress.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Sonraki seviye: {xpProgress.target.toLocaleString()} XP ({xpProgress.target - currentUser.totalXP} kaldı)
                                </p>
                            </div>

                            {/* Sıralama */}
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">#{userRank}</p>
                                <p className="text-xs text-gray-500">Bu dönem sıralamanız</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Streak */}
                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">{currentUser.streak} Gün</p>
                                    <p className="text-sm text-gray-500">Aktif Streak 🔥</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Son Kazanılan Rozetler */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Rozetleriniz
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-2">
                                {currentUser.badges.map((badgeKey) => {
                                    const badge = BADGES[badgeKey];
                                    return (
                                        <div
                                            key={badgeKey}
                                            className="aspect-square flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                                            title={badge.label}
                                        >
                                            <span className="text-2xl">{badge.icon}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                {currentUser.badges.length} / {Object.keys(BADGES).length} rozet
                            </p>
                        </CardContent>
                    </Card>

                    {/* Haftalık Yarışma */}
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Gift className="w-4 h-4 text-purple-600" />
                                Haftalık Yarışma
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-semibold">{contest.title}</p>
                                <p className="text-sm text-gray-500">{contest.description}</p>
                            </div>

                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-500">Ödül:</p>
                                <p className="font-bold text-purple-600">{contest.prize}</p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTimeRemaining(contest.endDate)} kaldı</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <Users className="w-4 h-4" />
                                    <span>{contest.participants} katılımcı</span>
                                </div>
                            </div>

                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-between">
                                <span className="text-sm">Lider:</span>
                                <span className="font-medium flex items-center gap-1">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    {contest.currentLeader}
                                </span>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                                <Target className="w-4 h-4 mr-2" />
                                Yarışmayı Görüntüle
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
