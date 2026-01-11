import { Metadata } from "next";
import Link from "next/link";
import { Building2, Target, Users, Heart, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Hakkımızda",
    description: "OPERO, emlak sektörünü dijitalleştirme misyonuyla kurulmuş Türk teknoloji şirketidir.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Emlak Sektörünü{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Dönüştürüyoruz
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        OPERO, emlak danışmanlarının ve ofislerinin daha verimli çalışmasını sağlamak için
                        geliştirilmiş modern bir CRM platformudur.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Misyonumuz
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Emlak sektöründeki profesyonellerin işlerini daha verimli yönetmelerini sağlayacak,
                                kullanımı kolay ve güçlü teknoloji çözümleri sunmak. Her büyüklükteki ofis ve
                                bireysel danışmanların dijital dönüşümünü desteklemek.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Building2 className="w-7 h-7 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Vizyonumuz
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Türkiye'nin ve bölgenin en çok tercih edilen emlak CRM platformu olmak.
                                Sektörün standartlarını yükselten, inovasyona öncülük eden bir teknoloji
                                şirketi olarak tanınmak.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                        Hikayemiz
                    </h2>
                    <div className="prose prose-lg dark:prose-invert mx-auto">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            OPERO, emlak sektöründe yaşanan dijitalleşme ihtiyacını gözlemleyen bir grup
                            yazılım geliştirici tarafından 2025 yılında kuruldu. Sektörde çalışan birçok
                            danışman ve broker ile yapılan görüşmeler sonucunda, mevcut çözümlerin
                            yetersiz kaldığı alanlar tespit edildi.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Excel tabloları, dağınık notlar ve birbiriyle entegre olmayan araçlarla
                            uğraşan profesyoneller için tek bir platformda tüm ihtiyaçları karşılayan,
                            modern ve kullanıcı dostu bir çözüm geliştirildi.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Bugün OPERO, Türkiye genelinde 500'den fazla emlak ofisi ve 2.500'ü aşkın
                            danışman tarafından aktif olarak kullanılmaktadır.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                        Değerlerimiz
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Müşteri Odaklılık",
                                description: "Her kararımızda müşterilerimizin ihtiyaçlarını ön planda tutuyoruz.",
                            },
                            {
                                icon: Heart,
                                title: "Tutkulu Ekip",
                                description: "İşimizi severek yapıyor, sürekli öğreniyor ve gelişiyoruz.",
                            },
                            {
                                icon: CheckCircle,
                                title: "Güvenilirlik",
                                description: "Şeffaf iletişim ve tutarlı kalite ile güven inşa ediyoruz.",
                            },
                        ].map((value) => (
                            <div key={value.title} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <value.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "500+", label: "Emlak Ofisi" },
                            { value: "2,500+", label: "Aktif Danışman" },
                            { value: "₺50M+", label: "Aylık İşlem Hacmi" },
                            { value: "99.9%", label: "Uptime" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        OPERO Ailesine Katılın
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Binlerce başarılı emlak profesyoneli gibi siz de işinizi dönüştürün.
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
                            href="/iletisim"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold"
                        >
                            Bize Ulaşın
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
