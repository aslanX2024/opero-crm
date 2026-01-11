"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    Calendar,
    Edit,
    Eye,
    Clock,
    DollarSign,
    User,
    Building2,
    FileText,
    Upload,
    Download,
    Plus,
    X,
    CheckCircle,
    XCircle,
    Sparkles,
    Trophy,
    TrendingUp,
    MapPin,
    AlertCircle,
    ChevronDown,
    PartyPopper,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Deal,
    DEMO_DEALS,
    PIPELINE_STAGES,
    STAGE_ORDER,
    DEAL_PRIORITIES,
    getDaysInStage,
    getStageChangeXP,
    formatDealPrice,
    PipelineStage,
} from "@/types/pipeline";

// Demo aktiviteler
const DEMO_ACTIVITIES = [
    { id: "1", type: "stage_change", title: "Aşama değişti", description: "İletişim Kuruldu → Kalifikasyon", date: "2026-01-06", user: "Demo Kullanıcı" },
    { id: "2", type: "call", title: "Telefon görüşmesi", description: "Müşteri ile 15 dk görüşme, bütçe netleştirildi", date: "2026-01-05", user: "Demo Kullanıcı" },
    { id: "3", type: "showing", title: "Gösterim yapıldı", description: "Mülk gösterimi tamamlandı, müşteri beğendi", date: "2026-01-04", user: "Demo Kullanıcı" },
    { id: "4", type: "note", title: "Not eklendi", description: "Müşteri 3+1 tercih ediyor, balkon şart", date: "2026-01-03", user: "Demo Kullanıcı" },
    { id: "5", type: "document", title: "Belge yüklendi", description: "Tapu fotokopisi", date: "2026-01-02", user: "Demo Kullanıcı" },
];

// Demo belgeler
const DEMO_DOCUMENTS = [
    { id: "1", name: "Tapu Fotokopisi.pdf", size: "2.4 MB", date: "2026-01-02" },
    { id: "2", name: "Kimlik Fotokopisi.pdf", size: "1.1 MB", date: "2026-01-03" },
];

// Kaybetme sebepleri
const LOSS_REASONS = [
    "Fiyat uyuşmazlığı",
    "Müşteri vazgeçti",
    "Rakip kazandı",
    "Mülk satıldı",
    "Kredi onaylanmadı",
    "Diğer",
];

// Deal detay sayfası
export default async function DealDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <DealDetailContent id={id} />;
}

// Client component
function DealDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const [deal, setDeal] = useState<Deal | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showXpPopup, setShowXpPopup] = useState(false);
    const [earnedXp, setEarnedXp] = useState(0);
    const [showLossModal, setShowLossModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);
    const [newActivity, setNewActivity] = useState("");
    const [activities, setActivities] = useState(DEMO_ACTIVITIES);

    // Deal yükle
    useEffect(() => {
        const foundDeal = DEMO_DEALS.find((d) => d.id === id) || DEMO_DEALS[0];
        setDeal(foundDeal);
    }, [id]);

    if (!deal) return <div>Yükleniyor...</div>;

    const stageInfo = PIPELINE_STAGES[deal.stage];
    const currentStageIndex = STAGE_ORDER.indexOf(deal.stage);
    const progressPercent = ((currentStageIndex + 1) / STAGE_ORDER.length) * 100;
    const daysInStage = getDaysInStage(deal.stage_entered_at);

    // Komisyon hesaplama
    const commissionRate = 2; // %2
    const commissionAmount = deal.expected_value * (commissionRate / 100);

    // Aşama değiştir
    const changeStage = (newStage: PipelineStage) => {
        const xp = getStageChangeXP(deal.stage, newStage);

        if (newStage === "tamamlandi") {
            // Satış tamamlandı!
            setEarnedXp(500);
            setShowConfetti(true);
            setShowXpPopup(true);
            setShowCommissionModal(true);

            setTimeout(() => {
                setShowConfetti(false);
                setShowXpPopup(false);
            }, 5000);
        } else if (xp > 0) {
            setEarnedXp(xp);
            setShowXpPopup(true);
            setTimeout(() => setShowXpPopup(false), 3000);
        }

        setDeal({
            ...deal,
            stage: newStage,
            stage_entered_at: new Date().toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
        });

        // Aktivite ekle
        setActivities([
            {
                id: Date.now().toString(),
                type: "stage_change",
                title: "Aşama değişti",
                description: `${PIPELINE_STAGES[deal.stage].label} → ${PIPELINE_STAGES[newStage].label}`,
                date: new Date().toISOString().split("T")[0],
                user: "Demo Kullanıcı",
            },
            ...activities,
        ]);
    };

    // Aktivite ekle
    const addActivity = () => {
        if (!newActivity.trim()) return;

        setActivities([
            {
                id: Date.now().toString(),
                type: "note",
                title: "Not eklendi",
                description: newActivity,
                date: new Date().toISOString().split("T")[0],
                user: "Demo Kullanıcı",
            },
            ...activities,
        ]);
        setNewActivity("");
    };

    // Kaybedildi işaretle
    const markAsLost = (reason: string) => {
        setDeal({
            ...deal,
            stage: "pasif" as any, // Kayıp aşaması
            notes: `Kaybedildi: ${reason}`,
        });
        setShowLossModal(false);
        router.push("/dashboard/pipeline");
    };

    return (
        <div className="space-y-6">
            {/* Konfeti Animasyonu */}
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: "-20px",
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{
                                    backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
                                        Math.floor(Math.random() * 6)
                                    ],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* XP Popup */}
            {showXpPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-12 h-12" />
                            <div>
                                <p className="text-2xl font-bold">+{earnedXp} XP!</p>
                                <p className="text-sm opacity-90">
                                    {earnedXp >= 500 ? "Satış Tamamlandı! 🎉" : "Harika ilerleme!"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Üst Bar */}
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Pipeline'a Dön
            </Button>

            {/* Üst Banner */}
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Mülk görseli ve bilgi */}
                        <div className="flex gap-4 flex-1">
                            <div className="w-24 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-10 h-10 text-white/80" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{deal.title}</h1>
                                <p className="text-white/80">{deal.property_title}</p>
                                <p className="text-2xl font-bold mt-1">{formatDealPrice(deal.expected_value)}</p>
                            </div>
                        </div>

                        {/* Müşteri */}
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-white/30">
                                <AvatarFallback className="bg-white/20 text-white">
                                    {deal.customer_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{deal.customer_name}</p>
                                <p className="text-sm text-white/80">{deal.customer_phone}</p>
                            </div>
                        </div>

                        {/* Aşama badge */}
                        <div className="flex items-center gap-2">
                            <Badge className={cn("text-base px-4 py-2", stageInfo.color, "text-white")}>
                                {stageInfo.label}
                            </Badge>
                            <Badge className={DEAL_PRIORITIES[deal.priority].color}>
                                {DEAL_PRIORITIES[deal.priority].label}
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-white/60 mb-2">
                            <span>Yeni Lead</span>
                            <span>Tamamlandı</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-white/80">Aşamada: {daysInStage} gün</span>
                            <span className="text-white/80">İlerleme: %{Math.round(progressPercent)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Ana İçerik */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Panel - İşlem Bilgileri */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Mülk ve Müşteri Linkleri */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Bağlantılar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href={`/dashboard/portfolio/${deal.property_id}`}>
                                <Button variant="outline" className="w-full justify-start">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Mülk Detayı
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                            </Link>
                            <Link href={`/dashboard/customers/${deal.customer_id}`}>
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="w-4 h-4 mr-2" />
                                    Müşteri Profili
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* İşlem Bilgileri */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">İşlem Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Başlangıç</span>
                                <span className="text-sm font-medium">
                                    {new Date(deal.created_at).toLocaleDateString("tr-TR")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Mülk Fiyatı</span>
                                <span className="text-sm font-medium">{formatDealPrice(deal.property_price)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Teklif Fiyatı</span>
                                <span className="text-sm font-medium text-blue-600">{formatDealPrice(deal.expected_value)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Olasılık</span>
                                <span className="text-sm font-medium">{stageInfo.probability}%</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Komisyon Önizleme */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Komisyon Önizlemesi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Satış Fiyatı</span>
                                    <span>{formatDealPrice(deal.expected_value)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Komisyon Oranı</span>
                                    <span>%{commissionRate}</span>
                                </div>
                                <div className="flex justify-between font-bold text-green-600 border-t pt-2">
                                    <span>Komisyon</span>
                                    <span>{formatDealPrice(commissionAmount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Belgeler */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Belgeler
                                </span>
                                <Button size="sm" variant="outline">
                                    <Upload className="w-3 h-3 mr-1" />
                                    Yükle
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {DEMO_DOCUMENTS.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div>
                                        <p className="text-sm font-medium">{doc.name}</p>
                                        <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sağ Panel - Aktivite Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Aktivite Ekleme */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Aktivite veya not ekle..."
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addActivity()}
                                />
                                <Button onClick={addActivity}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Ekle
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Aktivite Geçmişi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-6">
                                    {activities.map((activity) => {
                                        const getIcon = () => {
                                            switch (activity.type) {
                                                case "stage_change": return <TrendingUp className="w-4 h-4 text-blue-500" />;
                                                case "call": return <Phone className="w-4 h-4 text-green-500" />;
                                                case "showing": return <Eye className="w-4 h-4 text-purple-500" />;
                                                case "document": return <FileText className="w-4 h-4 text-orange-500" />;
                                                default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
                                            }
                                        };

                                        return (
                                            <div key={activity.id} className="relative flex gap-4 pl-2">
                                                <div className="relative z-10 w-8 h-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                                                    {getIcon()}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-sm">{activity.title}</p>
                                                        <span className="text-xs text-gray-400">{activity.date}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{activity.user}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Alt Aksiyonlar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                        {/* Aşama değiştir */}
                        <Select
                            value={deal.stage}
                            onValueChange={(v) => changeStage(v as PipelineStage)}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Aşama değiştir" />
                            </SelectTrigger>
                            <SelectContent>
                                {STAGE_ORDER.map((stage) => (
                                    <SelectItem key={stage} value={stage}>
                                        {PIPELINE_STAGES[stage].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Gösterim Planla
                        </Button>

                        <Button variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Ara
                        </Button>

                        <Button variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                        </Button>

                        <div className="flex-1" />

                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setShowLossModal(true)}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Kaybedildi
                        </Button>

                        {deal.stage !== "tamamlandi" && (
                            <Button
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                onClick={() => changeStage("tamamlandi")}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Satışı Tamamla
                                <Sparkles className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* XP Bilgisi */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">XP Kazanımları</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-2 bg-white/50 rounded-lg">
                            <p className="text-lg font-bold text-green-600">+20 XP</p>
                            <p className="text-xs text-gray-500">Aşama İlerletme</p>
                        </div>
                        <div className="text-center p-2 bg-white/50 rounded-lg">
                            <p className="text-lg font-bold text-blue-600">+50 XP</p>
                            <p className="text-xs text-gray-500">Teklif Alma</p>
                        </div>
                        <div className="text-center p-2 bg-white/50 rounded-lg">
                            <p className="text-lg font-bold text-purple-600">+100 XP</p>
                            <p className="text-xs text-gray-500">Sözleşme</p>
                        </div>
                        <div className="text-center p-2 bg-white/50 rounded-lg">
                            <p className="text-lg font-bold text-yellow-600">+500 XP</p>
                            <p className="text-xs text-gray-500">Satış Kapama</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kaybedildi Modal */}
            {showLossModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowLossModal(false)} />
                    <Card className="relative w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-5 h-5" />
                                Fırsat Kaybedildi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-500">Kaybetme sebebini seçin:</p>
                            <div className="space-y-2">
                                {LOSS_REASONS.map((reason) => (
                                    <Button
                                        key={reason}
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => markAsLost(reason)}
                                    >
                                        {reason}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full" onClick={() => setShowLossModal(false)}>
                                İptal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Komisyon Modal */}
            {showCommissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCommissionModal(false)} />
                    <Card className="relative w-full max-w-md">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <PartyPopper className="w-6 h-6" />
                                Tebrikler! Satış Tamamlandı!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{formatDealPrice(deal.expected_value)}</p>
                                <p className="text-gray-500">Satış Tutarı</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Komisyon Oranı</span>
                                    <span>%{commissionRate}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-green-600">
                                    <span>Kazancınız</span>
                                    <span>{formatDealPrice(commissionAmount)}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                                <Trophy className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
                                <p className="text-2xl font-bold text-purple-600">+500 XP</p>
                                <p className="text-sm text-gray-500">kazandınız!</p>
                            </div>
                            <Button className="w-full" onClick={() => setShowCommissionModal(false)}>
                                Harika!
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Konfeti Animasyon CSS */}
            <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
