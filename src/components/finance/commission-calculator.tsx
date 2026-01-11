"use client";

import { useState, useMemo } from "react";
import {
    Calculator,
    DollarSign,
    Users,
    Percent,
    X,
    Check,
    Sparkles,
    Building2,
    UserPlus,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { COMMISSION_MODELS, CommissionModel, calculateCommission } from "@/types/finance";

// Demo danışmanlar
const DEMO_AGENTS = [
    { id: "user-1", name: "Demo Kullanıcı", model: "standart" as CommissionModel },
    { id: "user-2", name: "Ali Yılmaz", model: "yuksek" as CommissionModel },
    { id: "user-3", name: "Zeynep Kaya", model: "baslangic" as CommissionModel },
];

interface CommissionCalculatorProps {
    propertyId?: string;
    propertyTitle?: string;
    propertyPrice?: number;
    defaultCommissionRate?: number;
    defaultAgentId?: string;
    onClose: () => void;
    onSave?: (data: CommissionResult) => void;
}

interface CommissionResult {
    salePrice: number;
    commissionRate: number;
    includeVAT: boolean;
    agentId: string;
    agentName: string;
    agentShare: number;
    hasCoBroker: boolean;
    coBrokerId?: string;
    coBrokerName?: string;
    coBrokerSplit: number;
    totalCommission: number;
    vat: number;
    grossCommission: number;
    agentAmount: number;
    officeAmount: number;
    coBrokerAmount?: number;
}

export function CommissionCalculatorModal({
    propertyId,
    propertyTitle,
    propertyPrice = 0,
    defaultCommissionRate = 4,
    defaultAgentId = "user-1",
    onClose,
    onSave,
}: CommissionCalculatorProps) {
    // Form state
    const [salePrice, setSalePrice] = useState(propertyPrice);
    const [commissionRate, setCommissionRate] = useState(defaultCommissionRate);
    const [includeVAT, setIncludeVAT] = useState(true);
    const [agentId, setAgentId] = useState(defaultAgentId);
    const [customAgentShare, setCustomAgentShare] = useState<number | null>(null);
    const [hasCoBroker, setHasCoBroker] = useState(false);
    const [coBrokerId, setCoBrokerId] = useState("");
    const [coBrokerSplit, setCoBrokerSplit] = useState(50);

    // Seçili danışman
    const selectedAgent = DEMO_AGENTS.find((a) => a.id === agentId);
    const agentModel = selectedAgent ? COMMISSION_MODELS[selectedAgent.model] : null;
    const agentShare = customAgentShare ?? (agentModel?.agentShare || 60);

    // Co-broker danışmanı
    const coBrokerAgent = DEMO_AGENTS.find((a) => a.id === coBrokerId);

    // Hesaplama
    const calculation = useMemo(() => {
        const baseCommission = salePrice * (commissionRate / 100);
        const vat = includeVAT ? baseCommission * 0.20 : 0;
        const grossCommission = baseCommission + vat;

        let agentAmount = grossCommission * (agentShare / 100);
        const officeAmount = grossCommission - agentAmount;

        let coBrokerAmount: number | undefined;
        if (hasCoBroker && coBrokerId) {
            coBrokerAmount = agentAmount * (coBrokerSplit / 100);
            agentAmount = agentAmount - coBrokerAmount;
        }

        return {
            totalCommission: baseCommission,
            vat,
            grossCommission,
            agentAmount,
            officeAmount,
            coBrokerAmount,
        };
    }, [salePrice, commissionRate, includeVAT, agentShare, hasCoBroker, coBrokerId, coBrokerSplit]);

    // Kaydet
    const handleSave = () => {
        const result: CommissionResult = {
            salePrice,
            commissionRate,
            includeVAT,
            agentId,
            agentName: selectedAgent?.name || "",
            agentShare,
            hasCoBroker,
            coBrokerId: hasCoBroker ? coBrokerId : undefined,
            coBrokerName: hasCoBroker ? coBrokerAgent?.name : undefined,
            coBrokerSplit,
            ...calculation,
        };

        onSave?.(result);
        onClose();
    };

    // Para formatla
    const formatMoney = (amount: number) => {
        return amount.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            Komisyon Hesaplama
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    {propertyTitle && (
                        <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {propertyTitle}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Input Alanları */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* İşlem Tutarı */}
                        <div className="col-span-2 space-y-2">
                            <Label className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                İşlem Tutarı (₺)
                            </Label>
                            <Input
                                type="number"
                                value={salePrice}
                                onChange={(e) => setSalePrice(parseInt(e.target.value) || 0)}
                                className="text-lg font-bold"
                            />
                        </div>

                        {/* Komisyon Oranı */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                <Percent className="w-4 h-4" />
                                Komisyon Oranı (%)
                            </Label>
                            <Input
                                type="number"
                                step="0.5"
                                min="1"
                                max="10"
                                value={commissionRate}
                                onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        {/* KDV Toggle */}
                        <div className="space-y-2">
                            <Label>KDV (%20)</Label>
                            <div className="flex items-center gap-2 h-10">
                                <Switch
                                    checked={includeVAT}
                                    onCheckedChange={setIncludeVAT}
                                />
                                <span className="text-sm">{includeVAT ? "Dahil" : "Hariç"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Danışman Seçimi */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Danışman
                                </Label>
                                <Select value={agentId} onValueChange={setAgentId}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEMO_AGENTS.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {agentModel && (
                                    <Badge className={cn(
                                        "text-xs",
                                        selectedAgent?.model === "elite" && "bg-purple-100 text-purple-700",
                                        selectedAgent?.model === "yuksek" && "bg-blue-100 text-blue-700",
                                        selectedAgent?.model === "standart" && "bg-green-100 text-green-700",
                                        selectedAgent?.model === "baslangic" && "bg-gray-100 text-gray-700"
                                    )}>
                                        {agentModel.label} (%{agentModel.agentShare})
                                    </Badge>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Danışman Payı (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={agentShare}
                                    onChange={(e) => setCustomAgentShare(parseInt(e.target.value) || 0)}
                                    placeholder={`Varsayılan: %${agentModel?.agentShare || 60}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Co-Broker */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-1">
                                <UserPlus className="w-4 h-4" />
                                Co-Broke (Ortak Satış)
                            </Label>
                            <Switch checked={hasCoBroker} onCheckedChange={setHasCoBroker} />
                        </div>

                        {hasCoBroker && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="space-y-2">
                                    <Label>Ortak Danışman</Label>
                                    <Select value={coBrokerId} onValueChange={setCoBrokerId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçin..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEMO_AGENTS.filter((a) => a.id !== agentId).map((agent) => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Paylaşım Oranı (%)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={coBrokerSplit}
                                        onChange={(e) => setCoBrokerSplit(parseInt(e.target.value) || 50)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hesaplama Önizleme */}
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <h3 className="font-semibold text-center mb-4">Komisyon Özeti</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Toplam Komisyon:</span>
                                <span className="font-bold">{formatMoney(calculation.totalCommission)}</span>
                            </div>

                            {includeVAT && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">KDV (%20):</span>
                                    <span className="font-medium">{formatMoney(calculation.vat)}</span>
                                </div>
                            )}

                            <div className="h-px bg-gray-300 dark:bg-gray-600 my-2" />

                            <div className="flex justify-between">
                                <span className="text-gray-500">Brüt Komisyon:</span>
                                <span className="font-bold text-lg">{formatMoney(calculation.grossCommission)}</span>
                            </div>

                            <div className="h-px bg-gray-300 dark:bg-gray-600 my-2" />

                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Danışman Payı ({agentShare}%):
                                </span>
                                <span className="font-bold">{formatMoney(calculation.agentAmount)}</span>
                            </div>

                            {hasCoBroker && coBrokerId && calculation.coBrokerAmount && (
                                <div className="flex justify-between text-blue-600">
                                    <span className="flex items-center gap-1">
                                        <UserPlus className="w-4 h-4" />
                                        Co-Broker ({coBrokerSplit}%):
                                    </span>
                                    <span className="font-bold">{formatMoney(calculation.coBrokerAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-purple-600">
                                <span>Ofis Payı:</span>
                                <span className="font-bold">{formatMoney(calculation.officeAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* XP Bilgisi */}
                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">
                                Satış kapanınca +500 XP kazanılır!
                            </span>
                        </div>
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            İptal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Basit komisyon hesaplama kartı (inline kullanım için)
export function CommissionPreviewCard({
    salePrice,
    commissionRate = 4,
    agentShare = 60,
    hasCoBroker = false,
    className,
}: {
    salePrice: number;
    commissionRate?: number;
    agentShare?: number;
    hasCoBroker?: boolean;
    className?: string;
}) {
    const calc = useMemo(() => {
        return calculateCommission(salePrice, commissionRate, agentShare, hasCoBroker);
    }, [salePrice, commissionRate, agentShare, hasCoBroker]);

    const formatMoney = (amount: number) => {
        return amount.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
    };

    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Komisyon Önizlemesi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Komisyon (%{commissionRate}):</span>
                        <span className="font-medium">{formatMoney(calc.totalCommission)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">KDV:</span>
                        <span>{formatMoney(calc.vat)}</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700" />
                    <div className="flex justify-between text-green-600">
                        <span>Danışman:</span>
                        <span className="font-bold">{formatMoney(calc.agentAmount)}</span>
                    </div>
                    {hasCoBroker && calc.coBrokerAmount && (
                        <div className="flex justify-between text-blue-600">
                            <span>Co-Broker:</span>
                            <span className="font-bold">{formatMoney(calc.coBrokerAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-purple-600">
                        <span>Ofis:</span>
                        <span className="font-bold">{formatMoney(calc.officeAmount)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
