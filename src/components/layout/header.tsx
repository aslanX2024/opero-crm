"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { CommandMenu } from "@/components/command-menu";
import { NotificationDropdown } from "@/components/layout/notification-dropdown";
import { PageHelp } from "@/components/ui/page-help";
import {
    Search,
    Bell,
    Moon,
    Sun,
    Plus,
    Building2,
    Users,
    Calendar,
    LogOut,
    ChevronDown,
    Menu,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// Seviye hesaplama fonksiyonu
function calculateLevel(xp: number): { level: number; title: string } {
    if (xp < 100) return { level: 1, title: "Çaylak" };
    if (xp < 300) return { level: 2, title: "Asistan" };
    if (xp < 600) return { level: 3, title: "Danışman" };
    if (xp < 1000) return { level: 4, title: "Kıdemli Danışman" };
    if (xp < 1500) return { level: 5, title: "Uzman Danışman" };
    if (xp < 2500) return { level: 6, title: "Baş Danışman" };
    if (xp < 4000) return { level: 7, title: "Takım Lideri" };
    if (xp < 6000) return { level: 8, title: "Bölge Müdürü" };
    if (xp < 10000) return { level: 9, title: "Direktör" };
    return { level: 10, title: "Efsane" };
}

// Header bileşeni
export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { profile, signOut } = useAuth();
    const { sidebarCollapsed, setSidebarOpen } = useAppStore();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Seviye bilgisi
    const levelInfo = calculateLevel(profile?.xp || 0);

    // Çıkış yap
    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    // Tema değiştir
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header
            className={cn(
                "fixed top-0 right-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
                sidebarCollapsed ? "left-16" : "left-64",
                "max-lg:left-0"
            )}
        >
            <div className="h-full flex items-center justify-between px-4 lg:px-6">
                {/* Sol taraf: Hamburger menü (mobil) ve Arama */}
                <div className="flex items-center gap-4">
                    {/* Hamburger menü - sadece mobilde görünür */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SheetHeader className="h-16 flex items-center justify-center border-b">
                                <SheetTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    OPERO
                                </SheetTitle>
                            </SheetHeader>
                            {/* Mobil navigasyon içeriği burada olacak */}
                            <nav className="p-4">
                                <MobileNavigation onNavigate={() => setMobileMenuOpen(false)} />
                            </nav>
                        </SheetContent>
                    </Sheet>

                    {/* Arama çubuğu - Command Palette */}
                    <div className="hidden sm:block w-full max-w-sm">
                        <CommandMenu />
                    </div>
                </div>

                {/* Sağ taraf: Aksiyonlar */}
                <div className="flex items-center gap-2">
                    {/* Hızlı Ekle Butonu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Hızlı Ekle</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/portfolio/new" className="flex items-center cursor-pointer">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Yeni Mülk
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/customers/new" className="flex items-center cursor-pointer">
                                    <Users className="w-4 h-4 mr-2" />
                                    Yeni Müşteri
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/appointments/new" className="flex items-center cursor-pointer">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Yeni Randevu
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sayfa Yardımı */}
                    <PageHelp pageKey={pathname} />

                    {/* Dark mode toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>

                    {/* Bildirimler */}
                    <NotificationDropdown />

                    {/* Profil dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={profile?.avatar_url} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                                        {profile?.full_name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {profile?.full_name?.split(" ")[0] || "Kullanıcı"}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Seviye {levelInfo.level}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="font-medium">{profile?.full_name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {profile?.email}
                                    </span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* XP ve Seviye */}
                            <div className="px-2 py-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">{levelInfo.title}</span>
                                    <span className="text-xs text-gray-500">
                                        {profile?.xp || 0} XP
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                        style={{
                                            width: `${Math.min(((profile?.xp || 0) % 500) / 5, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="cursor-pointer">
                                    Profil Ayarları
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="cursor-pointer">
                                    Bildirim Ayarları
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="text-red-600 dark:text-red-400 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Çıkış Yap
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

// Mobil navigasyon bileşeni
function MobileNavigation({ onNavigate }: { onNavigate: () => void }) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    const items = [
        { title: "Dashboard", href: "/dashboard", icon: "📊" },
        { title: "Portföy", href: "/dashboard/portfolio", icon: "🏠" },
        { title: "Müşteriler", href: "/dashboard/customers", icon: "👥" },
        { title: "Pipeline", href: "/dashboard/pipeline", icon: "🔀" },
        { title: "Randevular", href: "/dashboard/appointments", icon: "📅" },
        { title: "Pazarlama", href: "/dashboard/marketing", icon: "📣" },
        { title: "Finans", href: "/dashboard/finance", icon: "💰" },
        { title: "Liderlik Tablosu", href: "/dashboard/gamification/leaderboard", icon: "🏆" },
        { title: "Ayarlar", href: "/dashboard/settings", icon: "⚙️" },
    ];

    return (
        <ul className="space-y-1">
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.title}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
