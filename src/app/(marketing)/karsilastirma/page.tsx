import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Zap, Shield, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Karşılaştırma",
    description: "OPERO vs geleneksel yöntemler. Emlak CRM avantajlarını keşfedin.",
};

const comparisons = [
    {
        category: "Portföy Yönetimi",
        items: [
            { feature: "Mülk bilgilerini kaydetme", traditional: "Excel tabloları", opero: "Organize veritabanı" },
            { feature: "Fotoğraf yönetimi", traditional: "Klasör yapısı", opero: "Mülk kartına entegre" },
            { feature: "Arama ve filtreleme", traditional: "Manuel arama", opero: "Anlık filtreler" },
            { feature: "Portal yayını", traditional: "Her portala ayrı giriş", opero: "Tek tıkla yayın (yakında)" },
        ],
    },
    {
        category: "Müşteri Takibi",
        items: [
            { feature: "Müşteri bilgileri", traditional: "Kartvizit ve notlar", opero: "Detaylı müşteri kartları" },
            { feature: "Tercih takibi", traditional: "Hatırlama zorluğu", opero: "Sistem kaydı" },
            { feature: "Takip hatırlatmaları", traditional: "Takvim veya hatırlama", opero: "Otomatik bildirimler" },
            { feature: "İletişim geçmişi", traditional: "Dağınık notlar", opero: "Kronolojik kayıt" },
        ],
    },
    {
        category: "Satış Takibi",
        items: [
            { feature: "Fırsat yönetimi", traditional: "Zihinsel takip", opero: "Kanban pipeline" },
            { feature: "Dönüşüm oranları", traditional: "Belirsiz", opero: "Gerçek zamanlı analiz" },
            { feature: "Satış tahmini", traditional: "Tahmin yok", opero: "Weighted pipeline" },
            { feature: "Performans takibi", traditional: "Aylık toplantılar", opero: "Anlık dashboard" },
        ],
    },
    {
        category: "Zaman Yönetimi",
        items: [
            { feature: "Randevu planlaması", traditional: "Kağıt/telefon takvimi", opero: "Entegre takvim" },
            { feature: "Günlük görevler", traditional: "To-do listesi", opero: "Akıllı görev önerileri" },
            { feature: "Raporlama", traditional: "Excel raporları", opero: "Otomatik raporlar" },
            { feature: "Ekip koordinasyonu", traditional: "Toplantılar", opero: "Gerçek zamanlı paylaşım" },
        ],
    },
];

export default function ComparisonPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        OPERO vs Geleneksel{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Yöntemler
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Excel, not defterleri ve dağınık araçlarla mı uğraşıyorsunuz?
                        OPERO ile farkı keşfedin.
                    </p>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Clock, value: "%40", label: "Zaman Tasarrufu", desc: "Rutin işlerde" },
                            { icon: Zap, value: "+45%", label: "Satış Artışı", desc: "Ortalama" },
                            { icon: Shield, value: "%99.9", label: "Veri Güvenliği", desc: "Uptime" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="font-medium text-gray-900 dark:text-white">{stat.label}</div>
                                <div className="text-sm text-gray-500">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Tables */}
            <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto space-y-12">
                    {comparisons.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {section.category}
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                                {/* Header */}
                                <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 p-4 font-semibold text-sm">
                                    <div className="text-gray-500">Özellik</div>
                                    <div className="text-center text-gray-500">Geleneksel</div>
                                    <div className="text-center text-blue-600">OPERO</div>
                                </div>
                                {/* Rows */}
                                {section.items.map((item, idx) => (
                                    <div
                                        key={item.feature}
                                        className={`grid grid-cols-3 p-4 ${idx !== section.items.length - 1
                                                ? "border-b border-gray-100 dark:border-gray-700"
                                                : ""
                                            }`}
                                    >
                                        <div className="text-gray-700 dark:text-gray-300 text-sm">
                                            {item.feature}
                                        </div>
                                        <div className="text-center text-sm text-gray-500">
                                            {item.traditional}
                                        </div>
                                        <div className="text-center text-sm text-green-600 font-medium">
                                            {item.opero}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Summary */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Özet Karşılaştırma
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Traditional */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <X className="w-5 h-5 text-red-500" />
                                Geleneksel Yöntemler
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Dağınık bilgi kaynakları",
                                    "Manuel veri girişi tekrarları",
                                    "Takip zorluğu",
                                    "Raporlama için saatler",
                                    "Ekip koordinasyonu zorluğu",
                                    "Mobil erişim yok",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <X className="w-4 h-4 text-red-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* OPERO */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                OPERO ile
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Tüm veriler tek platformda",
                                    "Akıllı veri girişi",
                                    "Otomatik hatırlatmalar",
                                    "Anlık raporlar",
                                    "Gerçek zamanlı ekip takibi",
                                    "Her yerden mobil erişim",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Farkı Kendiniz Yaşayın
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        14 gün ücretsiz deneyin, geleneksel yöntemlerle aradaki farkı görün.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
                        >
                            Ücretsiz Deneyin
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold"
                        >
                            Demo Talep Et
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
