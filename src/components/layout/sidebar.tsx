"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    GitBranch,
    Calendar,
    Megaphone,
    Wallet,
    Trophy,
    Settings,
    ChevronLeft,
    ChevronRight,
    Crown,
    Receipt,
    ListTodo,
    DollarSign,
    Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Temel navigasyon öğeleri
const baseNavigationItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Portföy",
        href: "/dashboard/portfolio",
        icon: Building2,
    },
    {
        title: "Müşteriler",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Pipeline",
        href: "/dashboard/pipeline",
        icon: GitBranch,
    },
    {
        title: "Randevular",
        href: "/dashboard/appointments",
        icon: Calendar,
    },
    {
        title: "Görevler",
        href: "/dashboard/tasks",
        icon: ListTodo,
    },
    {
        title: "Pazarlama",
        href: "/dashboard/marketing",
        icon: Megaphone,
    },
    {
        title: "Finans",
        href: "/dashboard/finance",
        icon: Wallet,
    },
    {
        title: "Liderlik Tablosu",
        href: "/dashboard/gamification/leaderboard",
        icon: Trophy,
    },
    {
        title: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

// Broker özel menü öğeleri
const brokerNavigationItems = [
    {
        title: "Broker Dashboard",
        href: "/dashboard/broker",
        icon: Crown,
    },
];

// Sidebar bileşeni
export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();
    const { profile } = useAuth();
    const { workspace } = useWorkspace();

    // Rol bazlı navigasyon öğelerini birleştir
    const navigationItems = profile?.role === "broker"
        ? [...brokerNavigationItems, ...baseNavigationItems]
        : baseNavigationItems;

    // Workspace logosu veya varsayılan logo
    const hasWorkspaceLogo = workspace?.logo_url;
    const workspaceName = workspace?.name || "OPERO";

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
                    sidebarCollapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo */}
                <div
                    className={cn(
                        "h-16 flex items-center border-b border-gray-200 dark:border-gray-800",
                        sidebarCollapsed ? "justify-center px-2" : "px-4"
                    )}
                >
                    <Link href="/dashboard" className="flex items-center gap-3">
                        {hasWorkspaceLogo ? (
                            <img
                                src={workspace.logo_url}
                                alt={workspaceName}
                                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                        )}
                        {!sidebarCollapsed && (
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate max-w-[140px]">
                                {hasWorkspaceLogo ? workspaceName : "OPERO"}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigasyon */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {navigationItems.map((item) => {
                            const isActive =
                                pathname === item.href || pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    {sidebarCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center justify-center w-12 h-12 rounded-lg transition-all",
                                                        isActive
                                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    )}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                                isActive
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="truncate">{item.title}</span>
                                            {isActive && (
                                                <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            )}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Daraltma butonu */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebarCollapsed}
                        className={cn(
                            "w-full justify-center",
                            sidebarCollapsed ? "px-0" : ""
                        )}
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Daralt
                            </>
                        )}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}
