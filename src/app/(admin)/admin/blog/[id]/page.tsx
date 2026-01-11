"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const categories = ["Rehber", "İpuçları", "Satış", "Trend", "Yönetim", "Genel"];

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Genel",
        read_time: 5,
        featured: false,
        published: false,
    });

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
                router.push("/admin/blog");
            } else if (data) {
                setFormData({
                    title: data.title || "",
                    slug: data.slug || "",
                    excerpt: data.excerpt || "",
                    content: data.content || "",
                    category: data.category || "Genel",
                    read_time: data.read_time || 5,
                    featured: data.featured || false,
                    published: data.published || false,
                });
            }
            setLoading(false);
        }

        fetchPost();
    }, [id, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from("blog_posts")
            .update(formData)
            .eq("id", id);

        if (error) {
            console.error("Error updating post:", error);
            alert("Hata oluştu: " + error.message);
        } else {
            router.push("/admin/blog");
        }

        setSaving(false);
    }

    async function handleDelete() {
        if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;

        const { error } = await supabase.from("blog_posts").delete().eq("id", id);

        if (!error) {
            router.push("/admin/blog");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Yazıyı Düzenle
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {formData.title}
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="text-red-600" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Başlık *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Makale başlığı"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">/blog/</span>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="url-slug"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Kısa Açıklama</Label>
                                    <Input
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Makalenin kısa özeti"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content">İçerik (Markdown)</Label>
                                    <textarea
                                        id="content"
                                        rows={15}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Yayın Ayarları
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="read_time">Okuma Süresi (dk)</Label>
                                    <Input
                                        id="read_time"
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={formData.read_time}
                                        onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="featured" className="cursor-pointer">
                                        Öne çıkan yazı
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="published" className="cursor-pointer">
                                        Yayınla
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
