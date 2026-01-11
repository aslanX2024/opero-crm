"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Testimonial {
    id: string;
    quote: string;
    author_name: string;
    author_company: string;
    rating: number;
    featured: boolean;
    published: boolean;
    created_at: string;
}

export default function TestimonialsListPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setItems(data || []);
        }
        setLoading(false);
    }

    async function togglePublished(id: string, current: boolean) {
        await supabase.from("testimonials").update({ published: !current }).eq("id", id);
        setItems(items.map(i => i.id === id ? { ...i, published: !current } : i));
    }

    async function toggleFeatured(id: string, current: boolean) {
        await supabase.from("testimonials").update({ featured: !current }).eq("id", id);
        setItems(items.map(i => i.id === id ? { ...i, featured: !current } : i));
    }

    async function deleteItem(id: string) {
        if (!confirm("Bu referansı silmek istediğinizden emin misiniz?")) return;
        await supabase.from("testimonials").delete().eq("id", id);
        setItems(items.filter(i => i.id !== id));
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Referanslar</h1>
                    <p className="text-gray-600">{items.length} referans</p>
                </div>
                <Link href="/admin/testimonials/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Referans
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">Henüz referans yok</p>
                        <Link href="/admin/testimonials/new"><Button>İlk Referansı Ekle</Button></Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="font-medium">{item.author_name}</span>
                                            <span>{item.author_company}</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={`w-3 h-3 ${i <= item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleFeatured(item.id, item.featured)}
                                            className={`p-1.5 rounded-lg ${item.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            <Star className="w-4 h-4" fill={item.featured ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => togglePublished(item.id, item.published)}
                                            className={`p-1.5 rounded-lg ${item.published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <Link href={`/admin/testimonials/${item.id}`} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
