"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewTestimonialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quote: "",
        author_name: "",
        author_role: "",
        author_company: "",
        author_location: "",
        rating: 5,
        featured: false,
        published: true,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("testimonials").insert([formData]);

        if (error) {
            alert("Hata: " + error.message);
        } else {
            router.push("/admin/testimonials");
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/testimonials" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Referans</h1>
                    <p className="text-gray-600">Müşteri yorumu ekleyin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
                    <div>
                        <Label htmlFor="quote">Yorum *</Label>
                        <textarea
                            id="quote"
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            placeholder="Müşterinin yorumu..."
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="author_name">İsim *</Label>
                            <Input
                                id="author_name"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                placeholder="Ahmet Yılmaz"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="author_role">Ünvan</Label>
                            <Input
                                id="author_role"
                                value={formData.author_role}
                                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                                placeholder="Broker"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="author_company">Şirket</Label>
                            <Input
                                id="author_company"
                                value={formData.author_company}
                                onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                                placeholder="Yılmaz Emlak"
                            />
                        </div>
                        <div>
                            <Label htmlFor="author_location">Şehir</Label>
                            <Input
                                id="author_location"
                                value={formData.author_location}
                                onChange={(e) => setFormData({ ...formData, author_location: e.target.value })}
                                placeholder="İstanbul"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Puan</Label>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: i })}
                                    className="p-1"
                                >
                                    <Star
                                        className={`w-6 h-6 ${i <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 rounded"
                            />
                            <span>Öne çıkan</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="w-4 h-4 rounded"
                            />
                            <span>Yayınla</span>
                        </label>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
