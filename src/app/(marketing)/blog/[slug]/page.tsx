import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    read_time: number;
    created_at: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return { title: "Makale Bulunamadı" };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
    if (!markdown) return "";

    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Lists
        .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4">$1</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>')
        // Wrap in paragraph
        .replace(/^/, '<p class="mb-4">')
        .replace(/$/, '</p>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const htmlContent = markdownToHtml(post.content);

    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Blog&apos;a Dön
                    </Link>

                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium mb-4">
                        {post.category}
                    </span>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {post.title}
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time} dk okuma
                        </span>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                            <Share2 className="w-4 h-4" />
                            Paylaş
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-16 px-4">
                <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                    <div
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </article>
            </section>

            {/* CTA */}
            <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        OPERO&apos;yu Deneyin
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Makalede bahsedilen tüm özellikleri 14 gün ücretsiz deneyebilirsiniz.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                    >
                        Ücretsiz Başla
                    </Link>
                </div>
            </section>
        </>
    );
}
