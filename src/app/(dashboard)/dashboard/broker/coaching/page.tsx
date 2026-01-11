"use client";

import { useState, useMemo } from "react";
import {
    Users,
    Target,
    TrendingUp,
    TrendingDown,
    Award,
    Calendar,
    MessageSquare,
    Plus,
    ChevronRight,
    Star,
    BarChart3,
    Clock,
    Phone,
    Home,
    Percent,
    CheckCircle2,
    Edit,
    Save,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DEMO_AGENT_PERFORMANCES, AgentPerformance } from "@/types/broker";

// Danışman detaylı metrikleri
interface AgentDetailedMetrics {
    dailyLoginRate: number; // %
    avgShowingsPerWeek: number;
    leadConversionRate: number; // %
    avgSalesCycle: number; // gün
    strengths: string[];
    improvements: string[];
}

// Hedef
interface AgentGoal {
    id: string;
    type: "sales" | "showings" | "custom";
    title: string;
    target: number;
    current: number;
    deadline: string;
}

// 1-1 Toplantı notu
interface MeetingNote {
    id: string;
    date: string;
    topics: string[];
    actions: string[];
    nextMeeting?: string;
}

// Ofis ortalamaları (demo)
const OFFICE_AVERAGES = {
    dailyLoginRate: 75,
    avgShowingsPerWeek: 3.5,
    leadConversionRate: 12,
    avgSalesCycle: 45,
    monthlyShowings: 6,
    monthlySales: 1.5,
    activePortfolio: 10,
    activeCustomers: 28,
};

// Demo danışman detayları
const DEMO_AGENT_DETAILS: Record<string, AgentDetailedMetrics> = {
    "user-2": {
        dailyLoginRate: 92,
        avgShowingsPerWeek: 4.5,
        leadConversionRate: 18,
        avgSalesCycle: 35,
        strengths: ["Yüksek gösterim sayısı", "İyi lead dönüşümü", "Düzenli giriş"],
        improvements: ["Sosyal medya paylaşımları", "Mülk fotoğraf kalitesi"],
    },
    "user-1": {
        dailyLoginRate: 85,
        avgShowingsPerWeek: 3.2,
        leadConversionRate: 14,
        avgSalesCycle: 42,
        strengths: ["Müşteri ilişkileri", "Detaylı mülk açıklamaları"],
        improvements: ["Gösterim sayısını artır", "Lead takip hızı"],
    },
    "user-3": {
        dailyLoginRate: 65,
        avgShowingsPerWeek: 2.0,
        leadConversionRate: 8,
        avgSalesCycle: 55,
        strengths: ["Mülk çeşitliliği"],
        improvements: ["Giriş sıklığı", "Lead dönüşümü", "Satış döngüsü"],
    },
};

// Demo hedefler
const DEMO_GOALS: Record<string, AgentGoal[]> = {
    "user-2": [
        { id: "1", type: "sales", title: "Aylık Satış", target: 5, current: 4, deadline: "2026-01-31" },
        { id: "2", type: "showings", title: "Aylık Gösterim", target: 15, current: 12, deadline: "2026-01-31" },
    ],
    "user-1": [
        { id: "1", type: "sales", title: "Aylık Satış", target: 3, current: 2, deadline: "2026-01-31" },
        { id: "2", type: "showings", title: "Aylık Gösterim", target: 10, current: 8, deadline: "2026-01-31" },
        { id: "3", type: "custom", title: "Yeni Mülk Ekleme", target: 5, current: 3, deadline: "2026-01-31" },
    ],
    "user-3": [
        { id: "1", type: "sales", title: "Aylık Satış", target: 2, current: 1, deadline: "2026-01-31" },
        { id: "2", type: "showings", title: "Aylık Gösterim", target: 8, current: 5, deadline: "2026-01-31" },
    ],
};

// Demo toplantı notları
const DEMO_MEETINGS: Record<string, MeetingNote[]> = {
    "user-1": [
        {
            id: "1",
            date: "2026-01-06",
            topics: ["Haftalık performans değerlendirmesi", "Yeni lead kaynakları", "Gösterim teknikleri"],
            actions: ["Sosyal medya paylaşımlarını artır", "Haftada en az 3 gösterim", "CRM'i düzenli güncelle"],
            nextMeeting: "2026-01-13",
        },
        {
            id: "2",
            date: "2025-12-30",
            topics: ["Yılsonu hedef değerlendirmesi", "2026 hedefleri"],
            actions: ["Hedef belirleme toplantısı planla", "Eğitim takvimi oluştur"],
            nextMeeting: "2026-01-06",
        },
    ],
    "user-3": [
        {
            id: "1",
            date: "2026-01-08",
            topics: ["Düşük performans değerlendirmesi", "Motivasyon görüşmesi"],
            actions: ["Günlük giriş hatırlatması", "Mentor eşleştirmesi", "Haftalık takip"],
            nextMeeting: "2026-01-15",
        },
    ],
};

export default function CoachingPage() {
    const [agents] = useState(DEMO_AGENT_PERFORMANCES);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showAddMeeting, setShowAddMeeting] = useState(false);

    // Seçili danışman
    const selectedAgent = agents.find((a) => a.id === selectedAgentId);
    const agentDetails = selectedAgentId ? DEMO_AGENT_DETAILS[selectedAgentId] : null;
    const agentGoals = selectedAgentId ? DEMO_GOALS[selectedAgentId] || [] : [];
    const agentMeetings = selectedAgentId ? DEMO_MEETINGS[selectedAgentId] || [] : [];

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-500" />
                        Koçluk & Yönetim
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Danışman performansı ve gelişim takibi
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sol - Danışman Listesi */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Danışmanlar</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className={cn(
                                        "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                                        selectedAgentId === agent.id
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    )}
                                    onClick={() => setSelectedAgentId(agent.id)}
                                >
                                    <Avatar>
                                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{agent.name}</p>
                                        <p className="text-xs text-gray-500">{agent.level}</p>
                                    </div>
                                    {agent.trend === "down" && (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sağ - Danışman Detayı */}
                <div className="lg:col-span-3 space-y-6">
                    {!selectedAgent ? (
                        <Card className="h-64 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Detayları görmek için bir danışman seçin</p>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Performans Özeti */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-16 h-16">
                                                <AvatarFallback className="text-2xl">{selectedAgent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge>{selectedAgent.level}</Badge>
                                                    <span className="text-sm text-gray-500">XP: {selectedAgent.xp.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Toplantı Planla
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-blue-600">{selectedAgent.activePortfolio}</p>
                                            <p className="text-xs text-gray-500">Portföy</p>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600">{selectedAgent.monthlyShowings}</p>
                                            <p className="text-xs text-gray-500">Gösterim (Ay)</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-orange-600">{selectedAgent.monthlySales}</p>
                                            <p className="text-xs text-gray-500">Satış (Ay)</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-purple-600">{selectedAgent.activeCustomers}</p>
                                            <p className="text-xs text-gray-500">Müşteri</p>
                                        </div>
                                    </div>

                                    {/* Güçlü Yönler ve Gelişim Alanları */}
                                    {agentDetails && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <p className="font-medium text-green-700 mb-2 flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" /> Güçlü Yönler
                                                </p>
                                                <ul className="space-y-1">
                                                    {agentDetails.strengths.map((s, i) => (
                                                        <li key={i} className="text-sm flex items-center gap-2">
                                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <p className="font-medium text-orange-700 mb-2 flex items-center gap-1">
                                                    <Target className="w-4 h-4" /> Gelişim Alanları
                                                </p>
                                                <ul className="space-y-1">
                                                    {agentDetails.improvements.map((s, i) => (
                                                        <li key={i} className="text-sm flex items-center gap-2">
                                                            <span className="w-3 h-3 rounded-full bg-orange-400" />
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Aktivite Analizi & Karşılaştırma */}
                            {agentDetails && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5" />
                                            Aktivite Analizi (Ofis Ortalaması vs Danışman)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Günlük Giriş */}
                                            <ComparisonBar
                                                label="Günlük Giriş Sıklığı"
                                                icon={<Clock className="w-4 h-4" />}
                                                agentValue={agentDetails.dailyLoginRate}
                                                officeValue={OFFICE_AVERAGES.dailyLoginRate}
                                                unit="%"
                                            />
                                            {/* Haftalık Gösterim */}
                                            <ComparisonBar
                                                label="Ort. Gösterim/Hafta"
                                                icon={<Home className="w-4 h-4" />}
                                                agentValue={agentDetails.avgShowingsPerWeek}
                                                officeValue={OFFICE_AVERAGES.avgShowingsPerWeek}
                                                unit=""
                                            />
                                            {/* Lead Dönüşüm */}
                                            <ComparisonBar
                                                label="Lead Dönüşüm Oranı"
                                                icon={<Percent className="w-4 h-4" />}
                                                agentValue={agentDetails.leadConversionRate}
                                                officeValue={OFFICE_AVERAGES.leadConversionRate}
                                                unit="%"
                                            />
                                            {/* Satış Süresi */}
                                            <ComparisonBar
                                                label="Ort. Satış Süresi"
                                                icon={<Calendar className="w-4 h-4" />}
                                                agentValue={agentDetails.avgSalesCycle}
                                                officeValue={OFFICE_AVERAGES.avgSalesCycle}
                                                unit=" gün"
                                                lowerIsBetter
                                            />
                                        </div>

                                        <div className="flex justify-center gap-6 mt-4 pt-4 border-t text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded" />
                                                Danışman
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-gray-300 rounded" />
                                                Ofis Ortalaması
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Hedefler */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Hedefler
                                        </CardTitle>
                                        <Button size="sm" onClick={() => setShowAddGoal(true)}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Hedef Ekle
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {agentGoals.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">Henüz hedef belirlenmedi</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {agentGoals.map((goal) => {
                                                const progress = Math.min((goal.current / goal.target) * 100, 100);
                                                return (
                                                    <div key={goal.id} className="p-4 border rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary">{goal.type === "sales" ? "Satış" : goal.type === "showings" ? "Gösterim" : "Özel"}</Badge>
                                                                <span className="font-medium">{goal.title}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                Bitiş: {new Date(goal.deadline).toLocaleDateString("tr-TR")}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn(
                                                                            "h-full transition-all",
                                                                            progress >= 100 ? "bg-green-500" : progress >= 75 ? "bg-blue-500" : progress >= 50 ? "bg-yellow-500" : "bg-red-500"
                                                                        )}
                                                                        style={{ width: `${progress}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-medium w-20 text-right">
                                                                {goal.current} / {goal.target}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* 1-1 Toplantı Notları */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5" />
                                            1-1 Toplantı Notları
                                        </CardTitle>
                                        <Button size="sm" onClick={() => setShowAddMeeting(true)}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Yeni Not
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {agentMeetings.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">Henüz toplantı notu yok</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {agentMeetings.map((meeting) => (
                                                <div key={meeting.id} className="p-4 border rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">
                                                                {new Date(meeting.date).toLocaleDateString("tr-TR", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Konuşulan Konular</p>
                                                            <ul className="space-y-1">
                                                                {meeting.topics.map((topic, i) => (
                                                                    <li key={i} className="text-sm flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                                        {topic}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Aksiyon Maddeleri</p>
                                                            <ul className="space-y-1">
                                                                {meeting.actions.map((action, i) => (
                                                                    <li key={i} className="text-sm flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                                        {action}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {meeting.nextMeeting && (
                                                            <div className="pt-2 border-t text-sm text-gray-500">
                                                                Sonraki Toplantı: {new Date(meeting.nextMeeting).toLocaleDateString("tr-TR")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            {/* Hedef Ekleme Modal */}
            {showAddGoal && selectedAgent && (
                <AddGoalModal
                    agentName={selectedAgent.name}
                    onClose={() => setShowAddGoal(false)}
                />
            )}

            {/* Toplantı Notu Ekleme Modal */}
            {showAddMeeting && selectedAgent && (
                <AddMeetingModal
                    agentName={selectedAgent.name}
                    onClose={() => setShowAddMeeting(false)}
                />
            )}
        </div>
    );
}

// Karşılaştırma Bar
function ComparisonBar({
    label,
    icon,
    agentValue,
    officeValue,
    unit,
    lowerIsBetter = false,
}: {
    label: string;
    icon: React.ReactNode;
    agentValue: number;
    officeValue: number;
    unit: string;
    lowerIsBetter?: boolean;
}) {
    const maxValue = Math.max(agentValue, officeValue) * 1.2;
    const isBetter = lowerIsBetter ? agentValue < officeValue : agentValue > officeValue;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-2">
                    {icon} {label}
                </span>
                <span className={cn("text-sm font-medium", isBetter ? "text-green-600" : "text-orange-600")}>
                    {agentValue}{unit}
                </span>
            </div>
            <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                {/* Ofis ortalaması */}
                <div
                    className="absolute top-0 h-full bg-gray-300 dark:bg-gray-600"
                    style={{ width: `${(officeValue / maxValue) * 100}%` }}
                />
                {/* Danışman değeri */}
                <div
                    className={cn(
                        "absolute top-0 h-full",
                        isBetter ? "bg-blue-500" : "bg-orange-400"
                    )}
                    style={{ width: `${(agentValue / maxValue) * 100}%`, opacity: 0.9 }}
                />
                {/* Ofis çizgisi */}
                <div
                    className="absolute top-0 h-full w-0.5 bg-gray-500"
                    style={{ left: `${(officeValue / maxValue) * 100}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">Ofis Ort: {officeValue}{unit}</p>
        </div>
    );
}

// Hedef Ekleme Modal
function AddGoalModal({ agentName, onClose }: { agentName: string; onClose: () => void }) {
    const [goalType, setGoalType] = useState("sales");
    const [target, setTarget] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Hedef Belirle - {agentName}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Hedef Tipi</Label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={goalType}
                            onChange={(e) => setGoalType(e.target.value)}
                        >
                            <option value="sales">Aylık Satış</option>
                            <option value="showings">Aylık Gösterim</option>
                            <option value="custom">Özel Hedef</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Hedef Değeri</Label>
                        <Input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="örn: 5"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">İptal</Button>
                        <Button onClick={onClose} className="flex-1 bg-blue-600">
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Toplantı Notu Ekleme Modal
function AddMeetingModal({ agentName, onClose }: { agentName: string; onClose: () => void }) {
    const [topics, setTopics] = useState("");
    const [actions, setActions] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Toplantı Notu - {agentName}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Konuşulan Konular</Label>
                        <Textarea
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            placeholder="Her satıra bir konu..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Aksiyon Maddeleri</Label>
                        <Textarea
                            value={actions}
                            onChange={(e) => setActions(e.target.value)}
                            placeholder="Her satıra bir aksiyon..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sonraki Toplantı</Label>
                        <Input type="date" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">İptal</Button>
                        <Button onClick={onClose} className="flex-1 bg-blue-600">
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
