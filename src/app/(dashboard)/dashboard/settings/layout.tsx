"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Settings,
    Users,
    CreditCard,
    Building2,
    Bell,
    Shield,
    Palette,
    ChevronRight,
} from "lucide-react";
import { useWorkspace } from "@/context/workspace-context";
import { DemoBanner } from "@/components/demo/demo-restriction";
import type { LucideIcon } from "lucide-react";

interface SettingsNavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    brokerOnly?: boolean;
    ownerOnly?: boolean;
}

interface SettingsNavSection {
    title: string;
    items: SettingsNavItem[];
}

const settingsNav: SettingsNavSection[] = [
    {
        title: "Genel",
        items: [
            { href: "/dashboard/settings", label: "Ofis Bilgileri", icon: Building2 },
            { href: "/dashboard/settings/notifications", label: "Bildirimler", icon: Bell },
            { href: "/dashboard/settings/appearance", label: "Görünüm", icon: Palette },
        ],
    },
    {
        title: "Faturalama",
        items: [
            { href: "/dashboard/settings/billing", label: "Plan & Fatura", icon: CreditCard, ownerOnly: true },
        ],
    },
    {
        title: "Güvenlik",
        items: [
            { href: "/dashboard/settings/security", label: "Güvenlik", icon: Shield },
        ],
    },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { isBroker, isOwner } = useWorkspace();

    return (
        <div className="min-h-screen bg-background">
            <DemoBanner />

            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Ayarlar</h1>
                            <p className="text-muted-foreground text-sm">
                                Hesap ve ofis ayarlarınızı yönetin
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 shrink-0">
                        <nav className="space-y-6">
                            {settingsNav.map((section) => (
                                <div key={section.title}>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                                        {section.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => {
                                            // Yetki kontrolü
                                            if (item.brokerOnly && !isBroker) return null;
                                            if (item.ownerOnly && !isOwner) return null;

                                            const isActive = pathname === item.href;
                                            const Icon = item.icon;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`
                                                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                                                        ${isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                        }
                                                    `}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-card rounded-xl border p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
