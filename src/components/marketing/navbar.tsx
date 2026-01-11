"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Özellikler", href: "/ozellikler" },
    { label: "Fiyatlandırma", href: "/fiyatlandirma" },
    { label: "Referanslar", href: "/referanslar" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/iletisim" },
];

export function MarketingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            OPERO
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
                        >
                            Giriş Yap
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Ücretsiz Dene
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-600 dark:text-gray-400"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-4 space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "block py-2 text-base font-medium transition-colors",
                                    pathname === item.href
                                        ? "text-blue-600"
                                        : "text-gray-600 dark:text-gray-400"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-gray-600 dark:text-gray-400 font-medium"
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                            >
                                Ücretsiz Dene
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
