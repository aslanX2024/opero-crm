"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Save,
    DollarSign,
    Users,
    Percent,
    TrendingUp,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

// Komisyon modeli tipi
interface CommissionTier {
    minAmount: number;
    maxAmount: number | null;
    rate: number;
}

interface CommissionModel {
    id: string;
    name: string;
    description?: string | null;
    tiers: CommissionTier[];
    is_default: boolean;
    created_at: string;
}

// Demo varsayılan model
const DEFAULT_TIERS: CommissionTier[] = [
    { minAmount: 0, maxAmount: 500000, rate: 2 },
    { minAmount: 500000, maxAmount: 1000000, rate: 2.5 },
    { minAmount: 1000000, maxAmount: null, rate: 3 },
];

export default function CommissionModelsPage() {
    const { user } = useAuth();
    const [models, setModels] = useState<CommissionModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<CommissionModel | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tiers: DEFAULT_TIERS,
        is_default: false,
    });

    // Modelleri yükle
    useEffect(() => {
        async function loadModels() {
            if (!user) return;
            setLoading(true);

            const { data, error } = await supabase
                .from("commission_models")
                .select("*")
                .eq("broker_id", user.id)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setModels(data);
            } else {
                setModels([]);
            }
            setLoading(false);
        }

        loadModels();
    }, [user]);

    // Tier ekle
    const addTier = () => {
        const lastTier = formData.tiers[formData.tiers.length - 1];
        const newTiers = [...formData.tiers];

        // Son tier'ın maxAmount'ını güncelle
        if (lastTier.maxAmount === null) {
            newTiers[newTiers.length - 1] = { ...lastTier, maxAmount: lastTier.minAmount + 500000 };
        }

        newTiers.push({
            minAmount: lastTier.maxAmount || lastTier.minAmount + 500000,
            maxAmount: null,
            rate: lastTier.rate + 0.5,
        });

        setFormData({ ...formData, tiers: newTiers });
    };

    // Tier sil
    const removeTier = (index: number) => {
        if (formData.tiers.length <= 1) return;
        const newTiers = formData.tiers.filter((_, i) => i !== index);
        // Son tier'ın maxAmount'ını null yap
        newTiers[newTiers.length - 1].maxAmount = null;
        setFormData({ ...formData, tiers: newTiers });
    };

    // Tier güncelle
    const updateTier = (index: number, field: keyof CommissionTier, value: number | null) => {
        const newTiers = [...formData.tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setFormData({ ...formData, tiers: newTiers });
    };

    // Kaydet
    const handleSave = async () => {
        if (!user || !formData.name.trim()) {
            setError("Model adı zorunludur.");
            return;
        }

        setError(null);

        const payload = {
            broker_id: user.id,
            name: formData.name,
            description: formData.description || null,
            tiers: formData.tiers,
            is_default: formData.is_default,
        };

        if (editingModel) {
            // Güncelle
            const { error } = await supabase
                .from("commission_models")
                .update(payload)
                .eq("id", editingModel.id);

            if (error) {
                setError(error.message);
                return;
            }

            setModels(models.map(m => m.id === editingModel.id ? { ...m, ...payload } : m));
        } else {
            // Yeni ekle
            const { data, error } = await supabase
                .from("commission_models")
                .insert(payload)
                .select()
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            setModels([data, ...models]);
        }

        resetForm();
    };

    // Sil
    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("commission_models")
            .delete()
            .eq("id", id);

        if (!error) {
            setModels(models.filter(m => m.id !== id));
        }
    };

    // Form sıfırla
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            tiers: DEFAULT_TIERS,
            is_default: false,
        });
        setEditingModel(null);
        setIsAddDialogOpen(false);
        setError(null);
    };

    // Düzenle
    const handleEdit = (model: CommissionModel) => {
        setEditingModel(model);
        setFormData({
            name: model.name,
            description: model.description || "",
            tiers: model.tiers,
            is_default: model.is_default,
        });
        setIsAddDialogOpen(true);
    };

    // Para formatla
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
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
                            <DollarSign className="w-7 h-7 text-green-600" />
                            Komisyon Paylaşım Modelleri
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Danışmanlarınız için komisyon oranlarını yönetin
                        </p>
                    </div>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Model
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingModel ? "Modeli Düzenle" : "Yeni Komisyon Modeli"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="name">Model Adı *</Label>
                                <Input
                                    id="name"
                                    placeholder="Örn: Standart Komisyon"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Açıklama</Label>
                                <Input
                                    id="description"
                                    placeholder="Model açıklaması (opsiyonel)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Tier'lar */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Komisyon Kademeleri</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addTier}>
                                        <Plus className="w-3 h-3 mr-1" />
                                        Kademe Ekle
                                    </Button>
                                </div>

                                {formData.tiers.map((tier, index) => (
                                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary">Kademe {index + 1}</Badge>
                                            {formData.tiers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => removeTier(index)}
                                                >
                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <Label className="text-xs">Min. Tutar (₺)</Label>
                                                <Input
                                                    type="number"
                                                    value={tier.minAmount}
                                                    onChange={(e) => updateTier(index, "minAmount", parseInt(e.target.value) || 0)}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Max. Tutar (₺)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Sınırsız"
                                                    value={tier.maxAmount || ""}
                                                    onChange={(e) => updateTier(index, "maxAmount", e.target.value ? parseInt(e.target.value) : null)}
                                                    className="h-8 text-sm"
                                                    disabled={index === formData.tiers.length - 1}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Oran (%)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    value={tier.rate}
                                                    onChange={(e) => updateTier(index, "rate", parseFloat(e.target.value) || 0)}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Varsayılan Model</p>
                                    <p className="text-xs text-gray-500">Yeni danışmanlara otomatik atanır</p>
                                </div>
                                <Switch
                                    checked={formData.is_default}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={resetForm}>
                                    İptal
                                </Button>
                                <Button className="flex-1" onClick={handleSave}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Model Listesi */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : models.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Percent className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Henüz Komisyon Modeli Yok</h3>
                        <p className="text-gray-500 text-center mb-4 max-w-md">
                            Danışmanlarınız için farklı komisyon modelleri oluşturarak satış performansına göre farklı oranlar belirleyebilirsiniz.
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            İlk Modeli Oluştur
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {models.map((model) => (
                        <Card key={model.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{model.name}</h3>
                                            {model.is_default && (
                                                <Badge className="bg-blue-100 text-blue-700">Varsayılan</Badge>
                                            )}
                                        </div>
                                        {model.description && (
                                            <p className="text-sm text-gray-500 mb-4">{model.description}</p>
                                        )}

                                        {/* Kademe gösterimi */}
                                        <div className="flex flex-wrap gap-2">
                                            {model.tiers.map((tier, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        <span className="font-medium">%{tier.rate}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatCurrency(tier.minAmount)} - {tier.maxAmount ? formatCurrency(tier.maxAmount) : "∞"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(model)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(model.id)}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
