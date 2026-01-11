import { Metadata } from "next";
import Link from "next/link";
import {
    Building2,
    Users,
    TrendingUp,
    Calendar,
    PieChart,
    Trophy,
    BarChart3,
    Smartphone,
    Bell,
    Target,
    Zap,
    FileText,
    MapPin,
    Settings,
    ArrowRight,
    Check,
    Share2,
    Shield,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Özellikler",
    description: "OPERO'nun sunduğu tüm özellikler: Portföy yönetimi, müşteri takibi, pipeline, randevu, komisyon takibi ve daha fazlası.",
};

const features = [
    {
        id: "portfolio",
        icon: Building2,
        title: "Portföy Yönetimi",
        description: "Tüm mülklerinizi tek bir yerden yönetin",
        gradient: "from-blue-500 to-cyan-500",
        details: [
            "Sınırsız mülk kaydı",
            "Detaylı özellik girişi (oda sayısı, metrekare, kat vb.)",
            "Çoklu fotoğraf yükleme",
            "Video ve 360° tur desteği",
            "Lokasyon bazlı arama",
            "Fiyat geçmişi takibi",
            "Yetkilendirme bitiş uyarıları",
            "Mal sahibi bilgileri",
        ],
    },
    {
        id: "customers",
        icon: Users,
        title: "Müşteri Takibi",
        description: "Müşterilerinizi ve taleplerini organize edin",
        gradient: "from-purple-500 to-pink-500",
        details: [
            "Müşteri profilleri ve tercihleri",
            "Bütçe ve konum bazlı filtreleme",
            "Otomatik mülk-müşteri eşleştirme",
            "Lead scoring (sıcak/ılık/soğuk)",
            "İletişim geçmişi",
            "Hatırlatma ve takip notları",
            "Kaynak takibi (sahibinden, referans vb.)",
        ],
    },
    {
        id: "pipeline",
        icon: TrendingUp,
        title: "Satış Pipeline",
        description: "Tüm satış fırsatlarınızı görselleştirin",
        gradient: "from-orange-500 to-red-500",
        details: [
            "Kanban görünümü",
            "Sürükle-bırak ile aşama değişimi",
            "Özelleştirilebilir satış aşamaları",
            "Potansiyel değer takibi",
            "Olasılık bazlı tahminleme",
            "Aşamada kalma süresi analizi",
            "Aktivite geçmişi",
        ],
    },
    {
        id: "appointments",
        icon: Calendar,
        title: "Randevu Yönetimi",
        description: "Gösterimlerinizi ve toplantılarınızı planlayın",
        gradient: "from-green-500 to-emerald-500",
        details: [
            "Takvim görünümü (günlük/haftalık/aylık)",
            "Gösterim, toplantı, değerleme, imza tipleri",
            "Müşteri ve mülk bağlantısı",
            "Otomatik hatırlatma bildirimleri",
            "Google Calendar entegrasyonu (yakında)",
            "Konum bilgisi",
        ],
    },
    {
        id: "finance",
        icon: PieChart,
        title: "Finans & Komisyon",
        description: "Gelirlerinizi ve komisyonlarınızı takip edin",
        gradient: "from-emerald-500 to-teal-500",
        details: [
            "Komisyon hesaplama modelleri",
            "Danışman-ofis paylaşım oranları",
            "Tahsilat takibi",
            "Aylık/yıllık gelir raporları",
            "Ortak komisyon (co-broker) desteği",
            "KDV hesaplama",
        ],
    },
    {
        id: "gamification",
        icon: Trophy,
        title: "Gamification",
        description: "Motivasyonu artıran eğlenceli sistem",
        gradient: "from-amber-500 to-yellow-500",
        details: [
            "Deneyim puanı (XP) sistemi",
            "Seviye atlama",
            "Başarı rozetleri",
            "Liderlik tablosu",
            "Günlük görevler",
            "Hedef belirleme",
        ],
    },
    {
        id: "team",
        icon: Users,
        title: "Ekip Yönetimi",
        description: "Broker'lar için danışman yönetimi",
        gradient: "from-indigo-500 to-violet-500",
        badge: "Ofis Planı",
        details: [
            "Danışman davet sistemi",
            "Rol bazlı yetkilendirme",
            "Danışman performans takibi",
            "Lead dağıtımı",
            "Coaching araçları",
            "Hedef belirleme ve takip",
        ],
    },
    {
        id: "reports",
        icon: BarChart3,
        title: "Raporlar & Analytics",
        description: "Veriye dayalı kararlar alın",
        gradient: "from-rose-500 to-pink-500",
        details: [
            "Satış trendleri",
            "Danışman karşılaştırma",
            "Kaynak analizi (en iyi lead kaynakları)",
            "Dönüşüm oranları",
            "Pipeline değer analizi",
            "Özel zaman aralığı raporları",
        ],
    },
    {
        id: "mobile",
        icon: Smartphone,
        title: "Mobil Erişim (PWA)",
        description: "Her yerden tam erişim",
        gradient: "from-gray-600 to-gray-800",
        details: [
            "iOS ve Android desteği",
            "Ana ekrana uygulama olarak ekle",
            "Offline mod (temel özellikler)",
            "Push bildirimleri",
            "Hızlı müşteri arama",
            "Gösterim notları",
        ],
    },
];

export default function FeaturesPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        İhtiyacınız Olan{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Her Şey
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Portföy yönetiminden satış takibine, finanstan ekip yönetimine -
                        emlak operasyonlarınızın tamamı OPERO&apos;da.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                    >
                        14 Gün Ücretsiz Dene
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-24">
                        {features.map((feature, index) => (
                            <div
                                key={feature.id}
                                id={feature.id}
                                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Content */}
                                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        {feature.badge && (
                                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-full">
                                                {feature.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {feature.details.map((detail) => (
                                            <li key={detail} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Visual */}
                                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <div className={`aspect-video rounded-2xl bg-gradient-to-br ${feature.gradient} p-1`}>
                                        <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                                            <feature.icon className="w-24 h-24 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Yakında Gelecek Entegrasyonlar
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Favori araçlarınızla sorunsuz çalışın
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Sahibinden.com", status: "Yakında" },
                            { name: "Hepsiemlak", status: "Yakında" },
                            { name: "Google Calendar", status: "Yakında" },
                            { name: "WhatsApp", status: "Planlanan" },
                        ].map((integration) => (
                            <div
                                key={integration.name}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                    <Share2 className="w-6 h-6 text-gray-400" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {integration.name}
                                </h3>
                                <span className="text-sm text-blue-600">{integration.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Tüm bu özellikleri ücretsiz deneyin
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        14 gün boyunca tüm özelliklere sınırsız erişim. Kredi kartı gerekmez.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                        >
                            Ücretsiz Başla
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                            Demo Talep Et
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
