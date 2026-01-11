"use client";

import { ReactNode } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { canPerformAction, getDemoRestrictionMessage, DemoAction } from "@/lib/demo-data";
import { AlertTriangle, Lock } from "lucide-react";

interface DemoRestrictionProps {
    action: DemoAction;
    children: ReactNode;
    fallback?: ReactNode;
    showMessage?: boolean;
}

/**
 * Demo modunda belirli aksiyonları kısıtlayan sarmalayıcı bileşen
 * 
 * @example
 * <DemoRestriction action="delete">
 *   <Button onClick={handleDelete}>Sil</Button>
 * </DemoRestriction>
 */
export function DemoRestriction({
    action,
    children,
    fallback,
    showMessage = true,
}: DemoRestrictionProps) {
    const { isDemoMode } = useWorkspace();

    // Demo modunda değilse normal render
    if (!isDemoMode || canPerformAction(action)) {
        return <>{children}</>;
    }

    // Fallback varsa göster
    if (fallback) {
        return <>{fallback}</>;
    }

    // Varsayılan disabled görünüm
    return (
        <div className="relative group">
            <div className="opacity-50 pointer-events-none">
                {children}
            </div>
            {showMessage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/95 border rounded-lg px-3 py-2 shadow-lg flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {getDemoRestrictionMessage(action)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Demo modu uyarı banner'ı
 */
export function DemoBanner() {
    const { isDemoMode } = useWorkspace();

    if (!isDemoMode) return null;

    return (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-b border-amber-500/20">
            <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                    Demo Modu
                </span>
                <span className="text-muted-foreground">
                    - Veriler kaydedilmez, bazı özellikler kısıtlıdır
                </span>
            </div>
        </div>
    );
}

/**
 * Demo modunda gösterilecek placeholder action button
 */
export function DemoActionButton({
    action,
    label,
    icon: Icon,
    className = "",
}: {
    action: DemoAction;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}) {
    const { isDemoMode } = useWorkspace();
    const isRestricted = isDemoMode && !canPerformAction(action);

    return (
        <button
            disabled={isRestricted}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${isRestricted
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }
                ${className}
            `}
            title={isRestricted ? getDemoRestrictionMessage(action) : undefined}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {isRestricted && <Lock className="h-3 w-3 ml-1" />}
        </button>
    );
}
