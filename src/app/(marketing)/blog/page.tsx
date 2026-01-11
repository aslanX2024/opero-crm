import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Blog",
    description: "Emlak sektörü, CRM kullanımı ve verimlilik artışı hakkında makaleler.",
};

export const revalidate = 60; // Revalidate every 60 seconds
const PAGE_SIZE = 50;

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    featured: boolean;
    read_time: number;
    created_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, category, featured, read_time, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1);

    if (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }

    return data || [];
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        Rehber: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        İpuçları: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        Satış: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        Trend: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        Yönetim: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
}

export default async function BlogPage() {
    const posts = await getBlogPosts();
    const featuredPosts = posts.filter((p) => p.featured);
    const regularPosts = posts.filter((p) => !p.featured);

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        OPERO Blog
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Emlak sektörü, CRM kullanımı ve verimlilik artışı hakkında içerikler.
                    </p>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="py-8 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Öne Çıkan Yazılar
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredPosts.slice(0, 3).map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <Tag className="w-12 h-12 text-white/30" />
                                    </div>
                                    <div className="p-6">
                                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${getCategoryColor(post.category)}`}>
                                            {post.category}
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(post.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.read_time} dk
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Tüm Yazılar
                    </h2>
                    {posts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Henüz blog yazısı yok. Yakında yeni içerikler eklenecek!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(regularPosts.length > 0 ? regularPosts : posts).map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group block bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Tag className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(post.created_at)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Yeni Yazılardan Haberdar Olun
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Emlak sektörü hakkında güncel içerikler için bültenimize abone olun.
                    </p>
                    <form className="flex gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                        >
                            Abone Ol
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
