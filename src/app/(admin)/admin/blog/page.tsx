"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    category: string;
    featured: boolean;
    published: boolean;
    created_at: string;
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, slug, title, category, featured, published, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    }

    async function togglePublished(id: string, currentValue: boolean) {
        const { error } = await supabase
            .from("blog_posts")
            .update({ published: !currentValue })
            .eq("id", id);

        if (!error) {
            setPosts(posts.map(p => p.id === id ? { ...p, published: !currentValue } : p));
        }
    }

    async function toggleFeatured(id: string, currentValue: boolean) {
        const { error } = await supabase
            .from("blog_posts")
            .update({ featured: !currentValue })
            .eq("id", id);

        if (!error) {
            setPosts(posts.map(p => p.id === id ? { ...p, featured: !currentValue } : p));
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;

        const { error } = await supabase.from("blog_posts").delete().eq("id", id);

        if (!error) {
            setPosts(posts.filter(p => p.id !== id));
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("tr-TR");
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Blog Yazıları
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {posts.length} yazı
                    </p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Yazı
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                ) : posts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">Henüz blog yazısı yok</p>
                        <Link href="/admin/blog/new">
                            <Button>İlk Yazıyı Ekle</Button>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Öne Çıkan</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {post.title}
                                        </span>
                                        <span className="block text-sm text-gray-500">/{post.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleFeatured(post.id, post.featured)}
                                            className={`p-1.5 rounded-lg transition ${post.featured
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                }`}
                                        >
                                            <Star className="w-4 h-4" fill={post.featured ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => togglePublished(post.id, post.published)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium mx-auto ${post.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {post.published ? (
                                                <>
                                                    <Eye className="w-3 h-3" /> Yayında
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3 h-3" /> Taslak
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {formatDate(post.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
