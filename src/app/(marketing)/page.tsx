import Link from "next/link";
import {
    Building2,
    Users,
    BarChart3,
    Calendar,
    Zap,
    Check,
    ArrowRight,
    Star,
    Trophy,
    TrendingUp,
    Target,
    PieChart,
    Smartphone,
    Shield,
    Clock,
    Sparkles,
} from "lucide-react";

// OPERO Marketing Landing Page
export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" />
                            Türkiye&apos;nin #1 Emlak CRM&apos;i
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                            Emlak Satışlarınızı{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                2x Artırın
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Portföy yönetimi, müşteri takibi, pipeline ve ekip performansı -
                            tüm emlak operasyonlarınız tek platformda.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                14 Gün Ücretsiz Dene
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/demo"
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Demo Talep Et
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <p className="mt-4 text-sm text-gray-500">
                            ✓ Kredi kartı gerekmez &nbsp; ✓ 14 gün tam erişim &nbsp; ✓ İptal kolaylığı
                        </p>
                    </div>

                    {/* Hero Image/Dashboard Preview */}
                    <div className="mt-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-2xl shadow-gray-500/20 dark:shadow-black/40">
                            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                                <div className="h-8 bg-gray-50 dark:bg-gray-800 flex items-center gap-2 px-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Aktif Portföy", value: "156", trend: "+12%", color: "text-blue-600" },
                                        { label: "Müşteriler", value: "324", trend: "+8%", color: "text-purple-600" },
                                        { label: "Bu Ay Satış", value: "₺2.4M", trend: "+24%", color: "text-green-600" },
                                        { label: "Pipeline", value: "₺8.7M", trend: "+15%", color: "text-orange-600" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                                            <div className={`text-2xl font-bold ${stat.color} dark:text-white`}>{stat.value}</div>
                                            <div className="text-sm text-green-600">{stat.trend}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof - Logos */}
            <section className="py-12 px-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                        500+ Emlak Ofisi OPERO&apos;yu Tercih Ediyor
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale">
                        {["Remax", "Century21", "Coldwell", "ERA", "Keller Williams", "21.Yüzyıl"].map((brand) => (
                            <div key={brand} className="text-xl font-bold text-gray-400">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Excel tabloları ve dağınık notlarla mı uğraşıyorsunuz?
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Müşteri takibi karmaşık ve zaman alıcı",
                                    "Portföy bilgileri dağınık, güncel değil",
                                    "Ekip performansını ölçmek zor",
                                    "Satış fırsatlarını kaçırıyorsunuz",
                                ].map((problem, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-red-600 text-sm">✕</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">{problem}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                OPERO ile her şey değişir
                            </h3>
                            <div className="space-y-4">
                                {[
                                    "Tüm müşteriler tek ekranda, otomatik hatırlatmalar",
                                    "Portföy her zaman güncel, portal entegrasyonu",
                                    "Gerçek zamanlı performans raporları",
                                    "Pipeline ile hiçbir fırsatı kaçırmayın",
                                ].map((solution, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{solution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Her Şey Tek Platformda
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Emlak ofislerinin ihtiyaç duyduğu tüm araçlar, entegre ve kullanımı kolay.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Building2,
                                title: "Portföy Yönetimi",
                                description: "Tüm mülklerinizi detaylı şekilde kaydedin, fotoğraf ekleyin ve portal entegrasyonlarıyla anında yayınlayın.",
                                gradient: "from-blue-500 to-cyan-500",
                            },
                            {
                                icon: Users,
                                title: "Müşteri Takibi",
                                description: "Müşteri taleplerini analiz edin, otomatik eşleştirme ile doğru mülkü bulun.",
                                gradient: "from-purple-500 to-pink-500",
                            },
                            {
                                icon: TrendingUp,
                                title: "Satış Pipeline",
                                description: "Kanban görünümü ile tüm fırsatları takip edin, satış süreçlerini optimize edin.",
                                gradient: "from-orange-500 to-red-500",
                            },
                            {
                                icon: Calendar,
                                title: "Randevu Yönetimi",
                                description: "Gösterimler, toplantılar ve imza randevularını takvim üzerinden planlayın.",
                                gradient: "from-green-500 to-emerald-500",
                            },
                            {
                                icon: PieChart,
                                title: "Komisyon Takibi",
                                description: "Satış komisyonlarını hesaplayın, tahsilat durumunu takip edin.",
                                gradient: "from-indigo-500 to-violet-500",
                            },
                            {
                                icon: Trophy,
                                title: "Gamification",
                                description: "XP, rozetler ve liderlik tablosu ile ekibinizi motive edin.",
                                gradient: "from-amber-500 to-yellow-500",
                            },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/ozellikler"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Tüm özellikleri keşfedin
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: "500+", label: "Emlak Ofisi", icon: Building2 },
                            { value: "2,500+", label: "Danışman", icon: Users },
                            { value: "₺50M+", label: "Aylık Satış Hacmi", icon: TrendingUp },
                            { value: "%40", label: "Verimlilik Artışı", icon: Target },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <stat.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview Section */}
            <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Basit ve Şeffaf Fiyatlandırma
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            İhtiyacınıza uygun planı seçin, 14 gün ücretsiz deneyin.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Solo Plan */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
                            <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Danışman</div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-gray-900 dark:text-white">₺199</span>
                                <span className="text-gray-500">/ay</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Bireysel emlak danışmanları için ideal.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Sınırsız portföy",
                                    "Müşteri takibi",
                                    "Randevu yönetimi",
                                    "Temel raporlar",
                                    "Mobil uygulama (PWA)",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Check className="w-5 h-5 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/register?plan=solo"
                                className="block w-full py-3 text-center border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Ücretsiz Başla
                            </Link>
                        </div>

                        {/* Office Plan */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                                Popüler
                            </div>
                            <div className="text-lg font-medium text-blue-100 mb-2">Ofis</div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">₺599</span>
                                <span className="text-blue-200">/ay</span>
                            </div>
                            <p className="text-blue-100 mb-2">
                                + ₺99 / danışman
                            </p>
                            <p className="text-blue-100 mb-6">
                                Emlak ofisleri ve ekipler için.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Tüm Danışman özellikleri",
                                    "Ekip yönetimi",
                                    "Danışman performans takibi",
                                    "Komisyon yönetimi",
                                    "Lead dağıtımı",
                                    "Gelişmiş raporlar",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-white">
                                        <Check className="w-5 h-5 text-blue-200" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/register?plan=office"
                                className="block w-full py-3 text-center bg-white rounded-xl font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                Ücretsiz Başla
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            href="/fiyatlandirma"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Detaylı karşılaştırmayı görün
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Binlerce Danışman Güveniyor
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "OPERO ile satışlarımız %40 arttı. Müşteri takibi artık çok kolay.",
                                author: "Ahmet Yılmaz",
                                role: "Broker, Yılmaz Emlak",
                                rating: 5,
                            },
                            {
                                quote: "Ekip performansını gerçek zamanlı takip edebiliyorum. Mükemmel bir araç.",
                                author: "Zeynep Kaya",
                                role: "Ofis Müdürü, Prime Gayrimenkul",
                                rating: 5,
                            },
                            {
                                quote: "Pipeline sayesinde hiçbir müşteriyi kaçırmıyoruz. Satışlarımız sürekli artıyor.",
                                author: "Mehmet Demir",
                                role: "Danışman, Emlak 21",
                                rating: 5,
                            },
                        ].map((testimonial) => (
                            <div key={testimonial.author} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Neden OPERO?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Smartphone,
                                title: "Her Yerden Erişim",
                                description: "Mobil cihazlarınızdan tam erişim",
                            },
                            {
                                icon: Shield,
                                title: "Güvenli Altyapı",
                                description: "Verileriniz şifreli ve güvende",
                            },
                            {
                                icon: Clock,
                                title: "5 Dakikada Kurulum",
                                description: "Hemen başlayın, eğitim gerekmez",
                            },
                            {
                                icon: Sparkles,
                                title: "Sürekli Güncelleme",
                                description: "Her hafta yeni özellikler",
                            },
                        ].map((item) => (
                            <div key={item.title} className="text-center">
                                <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <item.icon className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Emlak Operasyonlarınızı Dönüştürün
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                14 gün ücretsiz deneyin, kredi kartı gerekmez.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all"
                                >
                                    Hemen Başla
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/demo"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                                >
                                    Demo Talep Et
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
