"use client";

import Link from "next/link";
import {
    Play,
    Check,
    Building2,
    Users,
    TrendingUp,
    Calendar,
    Phone,
    Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        icon: Building2,
        title: "Portföy Yönetimi",
        description: "Tüm mülklerinizi tek bir yerden yönetin",
    },
    {
        icon: Users,
        title: "Müşteri Takibi",
        description: "Lead'lerinizi puanlayın ve takip edin",
    },
    {
        icon: TrendingUp,
        title: "Satış Pipeline",
        description: "Fırsatlarınızı görsel olarak takip edin",
    },
    {
        icon: Calendar,
        title: "Randevu Yönetimi",
        description: "Gösterimlerinizi planlayın",
    },
];

export default function DemoPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                        <Play className="w-4 h-4" />
                        Canlı Demo
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        OPERO&apos;yu{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Hemen Deneyin
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Kayıt olmadan, kredi kartı girmeden OPERO CRM&apos;in tüm özelliklerini keşfedin.
                        Örnek verilerle dolu bir dashboard sizi bekliyor.
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/demo-dashboard">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Demo&apos;yu Şimdi Gör
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto px-8 py-6 text-lg"
                            >
                                14 Gün Ücretsiz Dene
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Demo&apos;da Göreceğiniz Özellikler
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Demo İçeriği
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <ul className="space-y-4">
                            {[
                                "5 örnek mülk (daire, ofis, villa)",
                                "4 örnek müşteri profili",
                                "Satış pipeline - 6 aşamalı kanban",
                                "Günlük görevler ve randevular",
                                "Performans istatistikleri",
                                "Tam etkileşimli arayüz",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                            <Link href="/demo-dashboard">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Demo&apos;yu Başlat
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Sorularınız mı Var?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Canlı demo sunumu veya özel sorularınız için bizimle iletişime geçin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+903128700800"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Phone className="w-5 h-5" />
                            0 312 870 0 800
                        </a>
                        <a
                            href="mailto:demo@opero.tr"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Mail className="w-5 h-5" />
                            demo@opero.tr
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
