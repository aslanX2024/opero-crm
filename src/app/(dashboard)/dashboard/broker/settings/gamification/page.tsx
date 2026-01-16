"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Trophy,
    Save,
    Star,
    Gift,
    Settings,
    Users,
    Target,
    Award,
    Zap,
    Calendar,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

// XP Kuralları
const DEFAULT_XP_RULES = {
    property_added: 50,
    customer_added: 30,
    showing_completed: 25,
    deal_closed: 200,
    referral: 100,
    five_star_review: 75,
};

// XP Kural Açıklamaları
const XP_RULE_LABELS: Record<string, { label: string; icon: any }> = {
    property_added: { label: "Mülk Ekleme", icon: "🏠" },
    customer_added: { label: "Müşteri Ekleme", icon: "👤" },
    showing_completed: { label: "Gösterim Tamamlama", icon: "🚶" },
    deal_closed: { label: "Satış/Kiralama Kapama", icon: "🎯" },
    referral: { label: "Referans Getirme", icon: "🤝" },
    five_star_review: { label: "5 Yıldız Değerlendirme", icon: "⭐" },
};

interface GamificationSettings {
    id?: string;
    is_competition_enabled: boolean;
    competition_name: string;
    competition_description: string;
    competition_prize: string;
    competition_start?: string;
    competition_end?: string;
    xp_rules: Record<string, number>;
    show_leaderboard: boolean;
    leaderboard_public: boolean;
}

export default function GamificationSettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [settings, setSettings] = useState<GamificationSettings>({
        is_competition_enabled: true,
        competition_name: "",
        competition_description: "",
        competition_prize: "",
        competition_start: "",
        competition_end: "",
        xp_rules: DEFAULT_XP_RULES,
        show_leaderboard: true,
        leaderboard_public: false,
    });

    // Ayarları yükle
    useEffect(() => {
        async function loadSettings() {
            if (!user) return;
            setLoading(true);

            const { data, error } = await supabase
                .from("gamification_settings")
                .select("*")
                .eq("broker_id", user.id)
                .single();

            if (!error && data) {
                setSettings({
                    id: data.id,
                    is_competition_enabled: data.is_competition_enabled ?? true,
                    competition_name: data.competition_name || "",
                    competition_description: data.competition_description || "",
                    competition_prize: data.competition_prize || "",
                    competition_start: data.competition_start || "",
                    competition_end: data.competition_end || "",
                    xp_rules: data.xp_rules || DEFAULT_XP_RULES,
                    show_leaderboard: data.show_leaderboard ?? true,
                    leaderboard_public: data.leaderboard_public ?? false,
                });
            }
            setLoading(false);
        }

        loadSettings();
    }, [user]);

    // XP kuralını güncelle
    const updateXpRule = (key: string, value: number) => {
        setSettings({
            ...settings,
            xp_rules: { ...settings.xp_rules, [key]: value },
        });
    };

    // Kaydet
    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        const payload = {
            broker_id: user.id,
            is_competition_enabled: settings.is_competition_enabled,
            competition_name: settings.competition_name || null,
            competition_description: settings.competition_description || null,
            competition_prize: settings.competition_prize || null,
            competition_start: settings.competition_start || null,
            competition_end: settings.competition_end || null,
            xp_rules: settings.xp_rules,
            show_leaderboard: settings.show_leaderboard,
            leaderboard_public: settings.leaderboard_public,
        };

        if (settings.id) {
            // Güncelle
            const { error } = await supabase
                .from("gamification_settings")
                .update(payload)
                .eq("id", settings.id);

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } else {
            // Yeni ekle
            const { data, error } = await supabase
                .from("gamification_settings")
                .insert(payload)
                .select()
                .single();

            if (error) {
                setError(error.message);
            } else {
                setSettings({ ...settings, id: data.id });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/broker">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-7 h-7 text-yellow-600" />
                            Liderlik Tablosu Ayarları
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Yarışma ve XP puanlama kurallarını yönetin
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </div>

            {/* Durum Mesajları */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
                    ✓ Ayarlar başarıyla kaydedildi!
                </div>
            )}

            {/* Yarışma Ayarları */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        Yarışma Yönetimi
                    </CardTitle>
                    <CardDescription>
                        Danışmanlar arası yarışma oluşturun ve yönetin
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Yarışma Açık/Kapalı */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium">Yarışma Aktif</p>
                            <p className="text-sm text-gray-500">
                                Danışmanlar arasında sıralama ve puan rekabeti
                            </p>
                        </div>
                        <Switch
                            checked={settings.is_competition_enabled}
                            onCheckedChange={(checked) => setSettings({ ...settings, is_competition_enabled: checked })}
                        />
                    </div>

                    {settings.is_competition_enabled && (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="competition_name">Yarışma Adı</Label>
                                    <Input
                                        id="competition_name"
                                        placeholder="Örn: Ocak 2026 Satış Yarışması"
                                        value={settings.competition_name}
                                        onChange={(e) => setSettings({ ...settings, competition_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="competition_prize">Ödül</Label>
                                    <Input
                                        id="competition_prize"
                                        placeholder="Örn: 5.000₺ Bonus + Tatil Hediyesi"
                                        value={settings.competition_prize}
                                        onChange={(e) => setSettings({ ...settings, competition_prize: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="competition_description">Yarışma Açıklaması</Label>
                                <Textarea
                                    id="competition_description"
                                    placeholder="Yarışma kuralları ve detayları..."
                                    value={settings.competition_description}
                                    onChange={(e) => setSettings({ ...settings, competition_description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="competition_start">Başlangıç Tarihi</Label>
                                    <Input
                                        id="competition_start"
                                        type="date"
                                        value={settings.competition_start}
                                        onChange={(e) => setSettings({ ...settings, competition_start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="competition_end">Bitiş Tarihi</Label>
                                    <Input
                                        id="competition_end"
                                        type="date"
                                        value={settings.competition_end}
                                        onChange={(e) => setSettings({ ...settings, competition_end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Liderlik Tablosu Görünürlüğü */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Liderlik Tablosu Görünürlüğü
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium">Liderlik Tablosunu Göster</p>
                            <p className="text-sm text-gray-500">
                                Danışmanlar sıralamayı görebilir
                            </p>
                        </div>
                        <Switch
                            checked={settings.show_leaderboard}
                            onCheckedChange={(checked) => setSettings({ ...settings, show_leaderboard: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium">Herkese Açık</p>
                            <p className="text-sm text-gray-500">
                                Giriş yapmayanlar da görebilir (isteğe bağlı)
                            </p>
                        </div>
                        <Switch
                            checked={settings.leaderboard_public}
                            onCheckedChange={(checked) => setSettings({ ...settings, leaderboard_public: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* XP Puanlama Kuralları */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        XP Puanlama Kuralları
                    </CardTitle>
                    <CardDescription>
                        Her eylem için kazanılacak XP puanlarını belirleyin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(XP_RULE_LABELS).map(([key, { label, icon }]) => (
                            <div
                                key={key}
                                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{icon}</span>
                                        <span className="font-medium">{label}</span>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                        +{settings.xp_rules[key]} XP
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        defaultValue={[settings.xp_rules[key]]}
                                        min={0}
                                        max={500}
                                        step={5}
                                        onValueChange={(value) => updateXpRule(key, value[0])}
                                        className="flex-1"
                                    />
                                    <Input
                                        type="number"
                                        value={settings.xp_rules[key]}
                                        onChange={(e) => updateXpRule(key, parseInt(e.target.value) || 0)}
                                        className="w-20 h-8 text-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Önizleme */}
            {settings.is_competition_enabled && settings.competition_name && (
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                            <Trophy className="w-5 h-5" />
                            Yarışma Önizleme
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">{settings.competition_name}</h3>
                            {settings.competition_description && (
                                <p className="text-gray-600 dark:text-gray-400">{settings.competition_description}</p>
                            )}
                            {settings.competition_prize && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Gift className="w-5 h-5 text-yellow-600" />
                                    <span className="font-medium">Ödül:</span>
                                    <span>{settings.competition_prize}</span>
                                </div>
                            )}
                            {(settings.competition_start || settings.competition_end) && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {settings.competition_start} - {settings.competition_end || "Süresiz"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
