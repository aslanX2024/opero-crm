import { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight, Quote, TrendingUp, Users, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Referanslar",
    description: "OPERO kullanan emlak ofisleri ve danışmanların başarı hikayeleri.",
};

export const revalidate = 60;

interface Testimonial {
    id: string;
    quote: string;
    author_name: string;
    author_role: string;
    author_company: string;
    author_location: string;
    rating: number;
    featured: boolean;
}

async function getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }

    return data || [];
}

const logos = [
    "Remax", "Century 21", "Coldwell Banker", "ERA",
    "Keller Williams", "21. Yüzyıl", "Turyap", "Hepsiemlak Partner"
];

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Başarı{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Hikayeleri
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        OPERO kullanan emlak profesyonellerinin deneyimlerini keşfedin.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: Building2, value: "500+", label: "Emlak Ofisi" },
                            { icon: Users, value: "2,500+", label: "Aktif Danışman" },
                            { icon: Star, value: "4.8/5", label: "Memnuniyet Puanı" },
                            { icon: TrendingUp, value: "%45", label: "Ort. Verimlilik Artışı" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {testimonials.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Henüz referans yok. Yakında müşteri hikayeleri eklenecek!
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((t) => (
                                <div
                                    key={t.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i <= t.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <div className="relative mb-6">
                                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100 dark:text-blue-900/30" />
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                                            &ldquo;{t.quote}&rdquo;
                                        </p>
                                    </div>

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {t.author_name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {t.author_name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {t.author_role}, {t.author_company}
                                            </div>
                                            {t.author_location && (
                                                <div className="text-xs text-gray-400">{t.author_location}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Logo Cloud */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Güvenen Markalar
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale">
                        {logos.map((logo) => (
                            <div key={logo} className="text-xl font-bold text-gray-400">
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Siz de Başarı Hikayelerinin Parçası Olun
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        14 gün ücretsiz deneyin ve farkı yaşayın.
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
