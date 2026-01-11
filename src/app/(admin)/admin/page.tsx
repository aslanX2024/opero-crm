"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, MessageSquareQuote, HelpCircle, Plus, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
    blogCount: number;
    testimonialCount: number;
    faqCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        blogCount: 0,
        testimonialCount: 0,
        faqCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [blogRes, testimonialRes, faqRes] = await Promise.all([
                    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
                    supabase.from("testimonials").select("id", { count: "exact", head: true }),
                    supabase.from("faq_items").select("id", { count: "exact", head: true }),
                ]);

                setStats({
                    blogCount: blogRes.count || 0,
                    testimonialCount: testimonialRes.count || 0,
                    faqCount: faqRes.count || 0,
                });
            } catch (error) {
                console.error("Stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const cards = [
        {
            title: "Blog Yazıları",
            count: stats.blogCount,
            icon: FileText,
            href: "/admin/blog",
            addHref: "/admin/blog/new",
            color: "blue",
        },
        {
            title: "Referanslar",
            count: stats.testimonialCount,
            icon: MessageSquareQuote,
            href: "/admin/testimonials",
            addHref: "/admin/testimonials/new",
            color: "green",
        },
        {
            title: "SSS",
            count: stats.faqCount,
            icon: HelpCircle,
            href: "/admin/faq",
            addHref: "/admin/faq/new",
            color: "purple",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    İçerik yönetimi paneline hoş geldiniz
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" :
                                    card.color === "green" ? "bg-green-100 dark:bg-green-900/30" :
                                        "bg-purple-100 dark:bg-purple-900/30"
                                }`}>
                                <card.icon className={`w-6 h-6 ${card.color === "blue" ? "text-blue-600" :
                                        card.color === "green" ? "text-green-600" :
                                            "text-purple-600"
                                    }`} />
                            </div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {loading ? "..." : card.count}
                            </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            {card.title}
                        </h3>
                        <div className="flex gap-2">
                            <Link
                                href={card.href}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                <Eye className="w-4 h-4" />
                                Görüntüle
                            </Link>
                            <Link
                                href={card.addHref}
                                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition ${card.color === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                                        card.color === "green" ? "bg-green-600 hover:bg-green-700" :
                                            "bg-purple-600 hover:bg-purple-700"
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Ekle
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Hızlı İşlemler
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    <Link
                        href="/admin/blog/new"
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white">Yeni Blog Yazısı</span>
                    </Link>
                    <Link
                        href="/admin/testimonials/new"
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <MessageSquareQuote className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900 dark:text-white">Yeni Referans</span>
                    </Link>
                    <Link
                        href="/admin/faq/new"
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <HelpCircle className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900 dark:text-white">Yeni SSS</span>
                    </Link>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Not:</strong> Burada eklediğiniz içerikler otomatik olarak marketing sitesinde yayınlanır.
                    "Yayında" seçeneğini kapatarak taslak olarak kaydedebilirsiniz.
                </p>
            </div>
        </div>
    );
}
