"use client";

import { useState } from "react";
import {
    CreditCard,
    Check,
    Crown,
    Building2,
    Download,
    AlertTriangle,
    Shield,
} from "lucide-react";
import { useWorkspace } from "@/context/workspace-context";
import { PLAN_FEATURES, BILLING_MODES, PlanType, BillingMode } from "@/types/workspace";

// Demo fatura geçmişi
const DEMO_INVOICES = [
    { id: "INV-2026-001", date: "2026-01-01", amount: 899, status: "paid" },
    { id: "INV-2025-012", date: "2025-12-01", amount: 899, status: "paid" },
    { id: "INV-2025-011", date: "2025-11-01", amount: 699, status: "paid" },
];

export default function BillingSettingsPage() {
    const { workspace, isOwner, isDemoMode } = useWorkspace();
    const [currentPlan] = useState<PlanType>("office");
    const [billingMode, setBillingMode] = useState<BillingMode>("broker");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Yetki kontrolü
    if (!isOwner) {
        return (
            <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Erişim Yok</h2>
                <p className="text-muted-foreground">
                    Faturalama ayarlarına sadece workspace sahibi erişebilir.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold">Plan & Faturalama</h2>
                <p className="text-muted-foreground text-sm">
                    Abonelik planınızı ve faturalama ayarlarınızı yönetin
                </p>
            </div>

            {/* Current Plan */}
            <div className="border rounded-xl p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                            <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    {PLAN_FEATURES[currentPlan].label}
                                </h3>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    Aktif
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Sonraki fatura: 1 Şubat 2026
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            {PLAN_FEATURES[currentPlan].price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            3 danışman aktif
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium mb-3">Plan Özellikleri</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {PLAN_FEATURES[currentPlan].features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Billing Mode */}
            <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Faturalama Modu</h3>
                <div className="grid grid-cols-2 gap-4">
                    {(Object.entries(BILLING_MODES) as [BillingMode, typeof BILLING_MODES[BillingMode]][]).map(
                        ([mode, info]) => (
                            <button
                                key={mode}
                                onClick={() => setBillingMode(mode)}
                                className={`
                                    p-4 border rounded-xl text-left transition-all
                                    ${billingMode === mode
                                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                                        : "hover:border-muted-foreground/30"
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{info.label}</span>
                                    {billingMode === mode && (
                                        <Check className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {info.description}
                                </p>
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Plan Comparison */}
            <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Plan Karşılaştırma</h3>
                <div className="grid grid-cols-2 gap-6">
                    {/* Solo Plan */}
                    <div
                        className={`border rounded-xl p-5 ${currentPlan === "solo" ? "border-primary" : ""
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{PLAN_FEATURES.solo.label}</h4>
                                <div className="text-lg font-bold text-primary">
                                    {PLAN_FEATURES.solo.price}
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm mb-4">
                            {PLAN_FEATURES.solo.features.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        {currentPlan === "solo" ? (
                            <div className="text-center py-2 bg-muted rounded-lg text-sm">
                                Mevcut Plan
                            </div>
                        ) : (
                            <button className="w-full py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                                Düşür
                            </button>
                        )}
                    </div>

                    {/* Office Plan */}
                    <div
                        className={`border rounded-xl p-5 relative overflow-hidden ${currentPlan === "office" ? "border-primary" : ""
                            }`}
                    >
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                            Önerilen
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Crown className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{PLAN_FEATURES.office.label}</h4>
                                <div className="text-lg font-bold text-primary">
                                    {PLAN_FEATURES.office.price}
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm mb-4">
                            {PLAN_FEATURES.office.features.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        {currentPlan === "office" ? (
                            <div className="text-center py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                                ✓ Mevcut Plan
                            </div>
                        ) : (
                            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                                Yükselt
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <div className="border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Fatura Geçmişi</h3>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="h-4 w-4" />
                        Tümünü İndir
                    </button>
                </div>

                <div className="divide-y">
                    {DEMO_INVOICES.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between py-3"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-lg">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{invoice.id}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(invoice.date).toLocaleDateString("tr-TR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-medium">{invoice.amount} ₺</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    Ödendi
                                </span>
                                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                    <Download className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Demo Warning */}
            {isDemoMode && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-100">
                            Demo Modu
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Faturalama işlemleri demo modunda devre dışıdır. Gerçek bir
                            abonelik başlatmak için lütfen kayıt olun.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
