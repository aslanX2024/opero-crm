"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    MessageSquareQuote,
    HelpCircle,
    Settings,
    ArrowLeft,
    Menu,
    X,
    Building2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const adminNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Blog Yazıları", icon: FileText },
    { href: "/admin/testimonials", label: "Referanslar", icon: MessageSquareQuote },
    { href: "/admin/faq", label: "SSS", icon: HelpCircle },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Yetki kontrolü - sadece authenticated kullanıcılar
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white">OPERO</span>
                                <span className="text-xs text-gray-500 block">Admin Panel</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {adminNav.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Dashboard&apos;a Dön</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:pl-64">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
