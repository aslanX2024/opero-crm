"use client";

import { useState, useMemo } from "react";
import {
    CheckCircle2,
    Circle,
    Flame,
    Trophy,
    Star,
    Calendar,
    Gift,
    Sparkles,
    Target,
    Phone,
    Home,
    BookOpen,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Günlük görev tipi
interface DailyTask {
    id: string;
    title: string;
    description: string;
    xp: number;
    icon: React.ElementType;
    target: number;
    current: number;
    completed: boolean;
}

// Streak çarpanları
const STREAK_MULTIPLIERS = {
    3: { multiplier: 1.5, label: "x1.5 XP" },
    7: { multiplier: 2, label: "x2 XP", badge: "yedi_gun_streak" },
    30: { multiplier: 3, label: "x3 XP", badge: "30_gun_streak" },
};

// Demo günlük görevler
const generateDailyTasks = (): DailyTask[] => [
    {
        id: "task-1",
        title: "Müşteri Araması",
        description: "3 müşteri ara",
        xp: 30,
        icon: Phone,
        target: 3,
        current: 2,
        completed: false,
    },
    {
        id: "task-2",
        title: "Gösterim Yap",
        description: "1 mülk gösterimi gerçekleştir",
        xp: 30,
        icon: Home,
        target: 1,
        current: 0,
        completed: false,
    },
    {
        id: "task-3",
        title: "Mülk Güncelle",
        description: "1 mülk bilgilerini güncelle",
        xp: 20,
        icon: RefreshCw,
        target: 1,
        current: 1,
        completed: true,
    },
    {
        id: "task-4",
        title: "Eğitim İzle",
        description: "5 dakika eğitim videosu izle",
        xp: 10,
        icon: BookOpen,
        target: 5,
        current: 5,
        completed: true,
    },
];

// Demo tamamlanan günler (son 30 günden)
const generateCompletedDays = (): Set<string> => {
    const days = new Set<string>();
    const today = new Date();

    // Son 12 gün streak
    for (let i = 1; i <= 12; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.add(date.toISOString().split("T")[0]);
    }

    // Daha eski bazı günler
    [15, 18, 20, 22, 25].forEach((d) => {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        days.add(date.toISOString().split("T")[0]);
    });

    return days;
};

interface DailyTasksCardProps {
    compact?: boolean;
}

export function DailyTasksCard({ compact = false }: DailyTasksCardProps) {
    const [tasks, setTasks] = useState<DailyTask[]>(generateDailyTasks);
    const [streak] = useState(12);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // Tamamlanan görev sayısı
    const completedCount = tasks.filter((t) => t.completed).length;
    const allCompleted = completedCount === tasks.length;

    // Toplam kazanılacak XP
    const totalXP = tasks.reduce((sum, t) => sum + t.xp, 0);
    const earnedXP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.xp, 0);
    const bonusXP = allCompleted ? 50 : 0;

    // Streak çarpanı
    const streakMultiplier = streak >= 30 ? 3 : streak >= 7 ? 2 : streak >= 3 ? 1.5 : 1;
    const streakLabel = streak >= 30 ? "x3" : streak >= 7 ? "x2" : streak >= 3 ? "x1.5" : "";

    // Görevi tamamla
    const completeTask = (taskId: string) => {
        setTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === taskId ? { ...t, current: t.target, completed: true } : t
            );

            // Tümü tamamlandı mı kontrol et
            if (updated.every((t) => t.completed)) {
                setTimeout(() => setShowCelebration(true), 300);
            }

            return updated;
        });
    };

    if (compact) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            Günün Görevleri
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700">
                                <Flame className="w-3 h-3 mr-1" />
                                {streak} gün
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* İlerleme */}
                    <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span>{completedCount}/{tasks.length} görev</span>
                            <span className="text-blue-600 font-medium">{earnedXP} XP</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Görevler */}
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={cn(
                                    "flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer",
                                    task.completed
                                        ? "bg-green-50 dark:bg-green-900/20"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                                onClick={() => !task.completed && completeTask(task.id)}
                            >
                                {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-sm font-medium", task.completed && "line-through text-gray-400")}>
                                        {task.title}
                                    </p>
                                    {!task.completed && task.current > 0 && (
                                        <p className="text-xs text-gray-500">{task.current}/{task.target}</p>
                                    )}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    +{task.xp}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    {/* Bonus */}
                    {allCompleted && (
                        <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg text-center">
                            <p className="text-sm font-medium flex items-center justify-center gap-1">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Bonus: +50 XP
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            Günün Görevleri
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {streakLabel && (
                                <Badge className="bg-purple-100 text-purple-700">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {streakLabel} XP
                                </Badge>
                            )}
                            <Badge className="bg-orange-100 text-orange-700">
                                <Flame className="w-3 h-3 mr-1" />
                                {streak} gün streak
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => setShowCalendar(!showCalendar)}>
                                <Calendar className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* İlerleme */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">{completedCount}/{tasks.length} görev tamamlandı</span>
                            <span className="text-sm font-medium text-blue-600">
                                {earnedXP}{bonusXP > 0 && ` + ${bonusXP}`} XP
                                {streakMultiplier > 1 && ` (${streakLabel})`}
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    allCompleted
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                                )}
                                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Görevler */}
                    <div className="space-y-3">
                        {tasks.map((task) => {
                            const Icon = task.icon;
                            const progress = (task.current / task.target) * 100;

                            return (
                                <div
                                    key={task.id}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl border transition-all",
                                        task.completed
                                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
                                    )}
                                    onClick={() => !task.completed && completeTask(task.id)}
                                >
                                    {/* Checkbox */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                        task.completed
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    )}>
                                        {task.completed ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* İçerik */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={cn(
                                                "font-medium",
                                                task.completed && "line-through text-gray-400"
                                            )}>
                                                {task.title}
                                            </p>
                                            <Badge
                                                className={cn(
                                                    task.completed
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                )}
                                            >
                                                +{task.xp} XP
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">{task.description}</p>

                                        {/* İlerleme çubuğu */}
                                        {!task.completed && task.target > 1 && (
                                            <div className="mt-2">
                                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {task.current}/{task.target}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Günlük Bonus */}
                    <div className={cn(
                        "p-4 rounded-xl text-center transition-all",
                        allCompleted
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30"
                            : "bg-gray-50 dark:bg-gray-800/50"
                    )}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Gift className={cn("w-5 h-5", allCompleted ? "text-yellow-600" : "text-gray-400")} />
                            <span className={cn("font-medium", allCompleted ? "text-yellow-700" : "text-gray-400")}>
                                Günlük Tamamlama Bonusu
                            </span>
                        </div>
                        <p className={cn(
                            "text-2xl font-bold",
                            allCompleted ? "text-yellow-600" : "text-gray-300"
                        )}>
                            +50 XP
                        </p>
                        {!allCompleted && (
                            <p className="text-xs text-gray-500 mt-1">Tüm görevleri tamamlayın</p>
                        )}
                    </div>

                    {/* Streak Bilgisi */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className={cn(
                            "p-3 rounded-lg",
                            streak >= 3 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-800"
                        )}>
                            <p className={cn("text-lg font-bold", streak >= 3 ? "text-orange-600" : "text-gray-400")}>3 Gün</p>
                            <p className="text-xs text-gray-500">x1.5 XP</p>
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg",
                            streak >= 7 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-800"
                        )}>
                            <p className={cn("text-lg font-bold", streak >= 7 ? "text-orange-600" : "text-gray-400")}>7 Gün</p>
                            <p className="text-xs text-gray-500">x2 XP + Rozet</p>
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg",
                            streak >= 30 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-800"
                        )}>
                            <p className={cn("text-lg font-bold", streak >= 30 ? "text-orange-600" : "text-gray-400")}>30 Gün</p>
                            <p className="text-xs text-gray-500">x3 XP + Özel</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Takvim Modal */}
            {showCalendar && (
                <TaskCalendarModal onClose={() => setShowCalendar(false)} />
            )}

            {/* Kutlama Modal */}
            {showCelebration && (
                <CelebrationModal onClose={() => setShowCelebration(false)} streak={streak} />
            )}
        </>
    );
}

// Takvim Modal
function TaskCalendarModal({ onClose }: { onClose: () => void }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const completedDays = useMemo(() => generateCompletedDays(), []);

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={() => {
                            const prev = new Date(currentMonth);
                            prev.setMonth(prev.getMonth() - 1);
                            setCurrentMonth(prev);
                        }}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <CardTitle>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => {
                            const next = new Date(currentMonth);
                            next.setMonth(next.getMonth() + 1);
                            setCurrentMonth(next);
                        }}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Gün başlıkları */}
                    <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-500">
                        {["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"].map((d) => (
                            <div key={d} className="p-2">{d}</div>
                        ))}
                    </div>

                    {/* Günler */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            if (!day) return <div key={index} />;

                            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const isCompleted = completedDays.has(dateStr);
                            const isToday = new Date().toISOString().split("T")[0] === dateStr;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "aspect-square flex items-center justify-center rounded-lg text-sm",
                                        isCompleted && "bg-green-100 dark:bg-green-900/30 text-green-700",
                                        isToday && !isCompleted && "ring-2 ring-blue-500",
                                        !isCompleted && !isToday && "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        day
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Tamamlandı
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded ring-2 ring-blue-500" />
                            Bugün
                        </div>
                    </div>

                    <Button onClick={onClose} className="w-full mt-4">Kapat</Button>
                </CardContent>
            </Card>
        </div>
    );
}

// Kutlama Modal
function CelebrationModal({ onClose, streak }: { onClose: () => void; streak: number }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Konfeti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10%`,
                            backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][
                                Math.floor(Math.random() * 5)
                            ],
                            borderRadius: Math.random() > 0.5 ? "50%" : "0",
                            animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                            animationDelay: `${Math.random() * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            <Card className="relative w-full max-w-sm text-center">
                <CardContent className="p-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Tebrikler! 🎉</h2>
                    <p className="text-gray-500 mb-4">Tüm günlük görevleri tamamladınız!</p>

                    <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="font-bold text-green-600">+50 XP Bonus</p>
                        </div>

                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="flex items-center justify-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <span className="font-bold text-orange-600">{streak + 1} Gün Streak!</span>
                            </div>
                        </div>

                        {(streak + 1) >= 7 && (streak + 1) < 8 && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <p className="text-purple-600">🏆 7 Gün Streak Rozeti Kazandınız!</p>
                            </div>
                        )}
                    </div>

                    <Button onClick={onClose} className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Star className="w-4 h-4 mr-2" />
                        Harika!
                    </Button>
                </CardContent>
            </Card>

            <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(110vh) rotate(720deg);
          }
        }
      `}</style>
        </div>
    );
}

export default DailyTasksCard;
