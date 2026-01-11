"use client";

import { useState } from "react";
import {
    Star,
    X,
    Calendar,
    Sparkles,
    MessageSquare,
    TrendingUp,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Feedback arayüzü
export interface ShowingFeedback {
    appointment_id: string;
    customer_interest: number; // 1-5
    property_satisfaction: number; // 1-5
    price_opinion: "uygun" | "pazarlik" | "yuksek";
    customer_comment: string;
    next_step: "teklif" | "dusunuyor" | "baska_mulk" | "ilgilenmiyor";
    follow_up_date?: string;
    created_at: string;
}

// Sonraki adım seçenekleri
const NEXT_STEP_OPTIONS = [
    { value: "teklif", label: "Teklif Yapacak", color: "bg-green-100 text-green-700 border-green-200", icon: "🎯" },
    { value: "dusunuyor", label: "Düşünüyor", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "🤔" },
    { value: "baska_mulk", label: "Başka Mülk Göster", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🏠" },
    { value: "ilgilenmiyor", label: "İlgilenmiyor", color: "bg-gray-100 text-gray-700 border-gray-200", icon: "❌" },
];

// Fiyat görüşü seçenekleri
const PRICE_OPINIONS = [
    { value: "uygun", label: "Uygun", color: "bg-green-500" },
    { value: "pazarlik", label: "Pazarlık Yapılabilir", color: "bg-yellow-500" },
    { value: "yuksek", label: "Yüksek", color: "bg-red-500" },
];

// Star Rating Component
function StarRating({
    value,
    onChange,
    label,
}: {
    value: number;
    onChange: (value: number) => void;
    label: string;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(star)}
                    >
                        <Star
                            className={cn(
                                "w-8 h-8 transition-colors",
                                (hover || value) >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

// Gösterim Feedback Modal
export function ShowingFeedbackModal({
    appointmentId,
    propertyTitle,
    customerName,
    onClose,
    onSubmit,
}: {
    appointmentId: string;
    propertyTitle: string;
    customerName: string;
    onClose: () => void;
    onSubmit: (feedback: ShowingFeedback) => void;
}) {
    const [customerInterest, setCustomerInterest] = useState(0);
    const [propertySatisfaction, setPropertySatisfaction] = useState(0);
    const [priceOpinion, setPriceOpinion] = useState<"uygun" | "pazarlik" | "yuksek" | "">("");
    const [customerComment, setCustomerComment] = useState("");
    const [nextStep, setNextStep] = useState<string>("");
    const [followUpDate, setFollowUpDate] = useState("");
    const [showXpPopup, setShowXpPopup] = useState(false);

    const handleSubmit = () => {
        if (!customerInterest || !propertySatisfaction || !priceOpinion || !nextStep) {
            alert("Lütfen tüm zorunlu alanları doldurun");
            return;
        }

        const feedback: ShowingFeedback = {
            appointment_id: appointmentId,
            customer_interest: customerInterest,
            property_satisfaction: propertySatisfaction,
            price_opinion: priceOpinion as "uygun" | "pazarlik" | "yuksek",
            customer_comment: customerComment,
            next_step: nextStep as "teklif" | "dusunuyor" | "baska_mulk" | "ilgilenmiyor",
            follow_up_date: followUpDate || undefined,
            created_at: new Date().toISOString(),
        };

        // XP popup göster
        setShowXpPopup(true);

        setTimeout(() => {
            onSubmit(feedback);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* XP Popup */}
            {showXpPopup && (
                <div className="absolute inset-0 z-60 flex items-center justify-center pointer-events-none">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
                        <div className="flex items-center gap-3">
                            <Award className="w-12 h-12" />
                            <div>
                                <p className="text-2xl font-bold">+40 XP!</p>
                                <p className="text-sm opacity-90">Gösterim +30 XP, Feedback +10 XP</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Gösterim Feedback
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                        <p>{propertyTitle}</p>
                        <p>Müşteri: {customerName}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Müşteri İlgisi */}
                    <StarRating
                        value={customerInterest}
                        onChange={setCustomerInterest}
                        label="Müşteri İlgisi *"
                    />

                    {/* Mülk Beğenisi */}
                    <StarRating
                        value={propertySatisfaction}
                        onChange={setPropertySatisfaction}
                        label="Mülk Beğenisi *"
                    />

                    {/* Fiyat Görüşü */}
                    <div className="space-y-2">
                        <Label>Fiyat Görüşü *</Label>
                        <div className="flex gap-2">
                            {PRICE_OPINIONS.map(({ value, label, color }) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={priceOpinion === value ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        priceOpinion === value && color + " text-white border-0"
                                    )}
                                    onClick={() => setPriceOpinion(value as typeof priceOpinion)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Müşteri Yorumu */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Müşteri Yorumu</Label>
                        <textarea
                            id="comment"
                            placeholder="Müşterinin görüşleri, istekleri, önerileri..."
                            value={customerComment}
                            onChange={(e) => setCustomerComment(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    {/* Sonraki Adım */}
                    <div className="space-y-2">
                        <Label>Sonraki Adım *</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {NEXT_STEP_OPTIONS.map(({ value, label, color, icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={cn(
                                        "p-3 rounded-lg border-2 text-left transition-all",
                                        nextStep === value
                                            ? color + " border-current"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                    onClick={() => setNextStep(value)}
                                >
                                    <span className="text-lg mr-2">{icon}</span>
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sonraki Randevu Tarihi */}
                    <div className="space-y-2">
                        <Label htmlFor="followUp" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Sonraki Randevu Tarihi (Opsiyonel)
                        </Label>
                        <Input
                            id="followUp"
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                        />
                    </div>

                    {/* XP Bilgisi */}
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">
                                Feedback doldurunca +10 XP kazanacaksınız!
                            </span>
                        </div>
                    </div>

                    {/* Kaydet */}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            İptal
                        </Button>
                        <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Gösterim İstatistikleri Kartı
export function ShowingStatsCard({
    totalShowings,
    averageSatisfaction,
    conversionRate,
    seriesCount,
}: {
    totalShowings: number;
    averageSatisfaction: number;
    conversionRate: number;
    seriesCount: number;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Gösterim İstatistikleri
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{totalShowings}</p>
                        <p className="text-xs text-gray-500">Toplam Gösterim</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-2xl font-bold">{averageSatisfaction.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-500">Ort. Memnuniyet</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
                        <p className="text-xs text-gray-500">Teklif Dönüşümü</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{seriesCount}</p>
                        <p className="text-xs text-gray-500">Art Arda Seri</p>
                        {seriesCount >= 10 && (
                            <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                                🏆 10 Seri Rozeti
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
