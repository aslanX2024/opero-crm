"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";

const plans = [
    {
        id: "solo",
        name: "Danışman",
        description: "Bireysel emlak danışmanları için",
        monthlyPrice: 199,
        yearlyPrice: 159,
        yearlyTotal: 1908,
        popular: false,
        ctaText: "Ücretsiz Başla",
        ctaHref: "/register?plan=solo",
    },
    {
        id: "office",
        name: "Ofis",
        description: "Emlak ofisleri ve ekipler için",
        monthlyPrice: 599,
        yearlyPrice: 479,
        yearlyTotal: 5748,
        perMember: 99,
        perMemberYearly: 79,
        popular: true,
        ctaText: "Ücretsiz Başla",
        ctaHref: "/register?plan=office",
    },
];

const featureCategories = [
    {
        name: "Portföy Yönetimi",
        features: [
            { name: "Mülk kaydı", solo: "Sınırsız", office: "Sınırsız" },
            { name: "Fotoğraf yükleme", solo: true, office: true },
            { name: "Portal entegrasyonu", solo: "Yakında", office: "Yakında" },
            { name: "Yetki takibi", solo: true, office: true },
        ],
    },
    {
        name: "Müşteri Yönetimi",
        features: [
            { name: "Müşteri kaydı", solo: "Sınırsız", office: "Sınırsız" },
            { name: "Lead scoring", solo: true, office: true },
            { name: "Otomatik eşleştirme", solo: true, office: true },
            { name: "İletişim geçmişi", solo: true, office: true },
        ],
    },
    {
        name: "Satış & Pipeline",
        features: [
            { name: "Kanban pipeline", solo: true, office: true },
            { name: "Deal takibi", solo: "Sınırsız", office: "Sınırsız" },
            { name: "Aşama özelleştirme", solo: false, office: true },
            { name: "Potansiyel değer analizi", solo: true, office: true },
        ],
    },
    {
        name: "Randevu & Takvim",
        features: [
            { name: "Gösterim planlaması", solo: true, office: true },
            { name: "Takvim görünümü", solo: true, office: true },
            { name: "Hatırlatma bildirimleri", solo: true, office: true },
            { name: "Google Calendar sync", solo: "Yakında", office: "Yakında" },
        ],
    },
    {
        name: "Finans & Komisyon",
        features: [
            { name: "Komisyon hesaplama", solo: "Temel", office: "Gelişmiş" },
            { name: "Tahsilat takibi", solo: true, office: true },
            { name: "Danışman paylaşım oranları", solo: false, office: true },
            { name: "Gelir raporları", solo: "Temel", office: "Detaylı" },
        ],
    },
    {
        name: "Ekip Yönetimi",
        features: [
            { name: "Danışman sayısı", solo: "1", office: "50'ye kadar" },
            { name: "Davet sistemi", solo: false, office: true },
            { name: "Performans takibi", solo: false, office: true },
            { name: "Lead dağıtımı", solo: false, office: true },
            { name: "Coaching araçları", solo: false, office: true },
        ],
    },
    {
        name: "Raporlar",
        features: [
            { name: "Temel raporlar", solo: true, office: true },
            { name: "Danışman karşılaştırma", solo: false, office: true },
            { name: "Dönüşüm analizi", solo: false, office: true },
            { name: "Özel raporlar", solo: false, office: true },
        ],
    },
    {
        name: "Destek & Erişim",
        features: [
            { name: "Mobil erişim (PWA)", solo: true, office: true },
            { name: "E-posta desteği", solo: true, office: true },
            { name: "Öncelikli destek", solo: false, office: true },
            { name: "Onboarding yardımı", solo: false, office: true },
        ],
    },
];

function FeatureValue({ value }: { value: boolean | string }) {
    if (value === true) {
        return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    }
    if (value === false) {
        return <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />;
    }
    return (
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
    );
}

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Basit ve Şeffaf{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Fiyatlandırma
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        İhtiyacınıza uygun planı seçin. Tüm planlarda 14 gün ücretsiz deneme.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!isYearly
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${isYearly
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            Yıllık
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">
                                %20 İndirim
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`rounded-2xl p-8 relative ${plan.popular
                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                                        Popüler
                                    </div>
                                )}

                                <div className={plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-400"}>
                                    {plan.name}
                                </div>

                                <div className="flex items-baseline gap-1 mt-2 mb-4">
                                    <span className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                                        ₺{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className={plan.popular ? "text-blue-200" : "text-gray-500"}>
                                        /ay
                                    </span>
                                </div>

                                {plan.perMember && (
                                    <p className={plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-400"}>
                                        + ₺{isYearly ? plan.perMemberYearly : plan.perMember} / danışman
                                    </p>
                                )}

                                {isYearly && (
                                    <p className={`text-sm mt-1 ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>
                                        Yıllık ₺{plan.yearlyTotal} (₺{(plan.monthlyPrice - plan.yearlyPrice) * 12} tasarruf)
                                    </p>
                                )}

                                <p className={`mt-4 ${plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-400"}`}>
                                    {plan.description}
                                </p>

                                <Link
                                    href={plan.ctaHref}
                                    className={`block w-full py-3 text-center rounded-xl font-semibold mt-6 transition ${plan.popular
                                            ? "bg-white text-blue-600 hover:bg-blue-50"
                                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                                        }`}
                                >
                                    {plan.ctaText}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                        Detaylı Karşılaştırma
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                        {/* Header */}
                        <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Özellik</div>
                            <div className="text-center text-sm font-semibold text-gray-900 dark:text-white">Danışman</div>
                            <div className="text-center text-sm font-semibold text-blue-600">Ofis</div>
                        </div>

                        {/* Categories */}
                        {featureCategories.map((category) => (
                            <div key={category.name}>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </span>
                                </div>
                                {category.features.map((feature, idx) => (
                                    <div
                                        key={feature.name}
                                        className={`grid grid-cols-3 p-4 ${idx !== category.features.length - 1 ? "border-b border-gray-100 dark:border-gray-700/50" : ""
                                            }`}
                                    >
                                        <div className="text-sm text-gray-700 dark:text-gray-300">{feature.name}</div>
                                        <div className="text-center">
                                            <FeatureValue value={feature.solo} />
                                        </div>
                                        <div className="text-center">
                                            <FeatureValue value={feature.office} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Mini */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Sık Sorulan Sorular
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Deneme süresi ne kadar?",
                                a: "Tüm planlarda 14 gün ücretsiz deneme süresi vardır. Kredi kartı gerekmez.",
                            },
                            {
                                q: "İstediğim zaman iptal edebilir miyim?",
                                a: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası dönem sonuna kadar kullanmaya devam edebilirsiniz.",
                            },
                            {
                                q: "Ofis planında danışman sayısı limiti var mı?",
                                a: "Standart Ofis planında 50 danışmana kadar destek var. Daha büyük ekipler için bizimle iletişime geçin.",
                            },
                            {
                                q: "Verilerim güvende mi?",
                                a: "Evet, tüm veriler şifreli olarak saklanır. Supabase altyapısı ile kurumsal düzeyde güvenlik sağlanır.",
                            },
                        ].map((faq) => (
                            <div key={faq.q} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            href="/sss"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Tüm soruları görün →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Hâlâ karar veremediniz mi?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Uzman ekibimiz size en uygun çözümü bulmanızda yardımcı olsun.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Demo Talep Et
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/iletisim"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Bize Ulaşın
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
