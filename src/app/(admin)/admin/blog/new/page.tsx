"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
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

export default function NewBlogPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    function generateSlug(title: string) {
        return title
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    function handleTitleChange(value: string) {
        setFormData({
            ...formData,
            title: value,
            slug: generateSlug(value),
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("blog_posts").insert([formData]);

        if (error) {
            console.error("Error creating post:", error);
            alert("Hata oluştu: " + error.message);
        } else {
            router.push("/admin/blog");
        }

        setLoading(false);
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/blog"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Yeni Blog Yazısı
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Yeni bir makale oluşturun
                    </p>
                </div>
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
                                        onChange={(e) => handleTitleChange(e.target.value)}
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
                                        placeholder="Makalenin kısa özeti (SEO için)"
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
                                        placeholder="## Başlık

Makale içeriğinizi Markdown formatında yazın...

### Alt Başlık

- Liste öğesi 1
- Liste öğesi 2

**Kalın metin** ve *italik metin* kullanabilirsiniz."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Markdown formatı desteklenir: ## Başlık, **kalın**, *italik*, - liste
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
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
                                            <SelectValue placeholder="Kategori seçin" />
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

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                {formData.published ? "Yayınlanacak" : "Taslak olarak kaydedilecek"}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
