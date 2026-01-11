"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    published: boolean;
}

const categoryColors: Record<string, string> = {
    "Genel": "bg-blue-100 text-blue-700",
    "Fiyatlandırma": "bg-green-100 text-green-700",
    "Özellikler": "bg-purple-100 text-purple-700",
    "Güvenlik": "bg-red-100 text-red-700",
};

export default function FAQListPage() {
    const [items, setItems] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        const { data } = await supabase
            .from("faq_items")
            .select("*")
            .order("category")
            .order("order_index");

        setItems(data || []);
        setLoading(false);
    }

    async function togglePublished(id: string, current: boolean) {
        await supabase.from("faq_items").update({ published: !current }).eq("id", id);
        setItems(items.map(i => i.id === id ? { ...i, published: !current } : i));
    }

    async function deleteItem(id: string) {
        if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
        await supabase.from("faq_items").delete().eq("id", id);
        setItems(items.filter(i => i.id !== id));
    }

    // Group by category
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, FAQItem[]>);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SSS Yönetimi</h1>
                    <p className="text-gray-600">{items.length} soru</p>
                </div>
                <Link href="/admin/faq/new">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Soru
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
            ) : items.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border">
                    <p className="text-gray-500 mb-4">Henüz SSS yok</p>
                    <Link href="/admin/faq/new"><Button>İlk Soruyu Ekle</Button></Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([category, categoryItems]) => (
                        <div key={category} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <span className={`px-2 py-1 rounded text-sm font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>
                                    {category}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">({categoryItems.length})</span>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categoryItems.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <div className="flex items-start gap-3">
                                            <GripVertical className="w-4 h-4 text-gray-400 mt-1 cursor-grab" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {item.question}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                    {item.answer}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => togglePublished(item.id, item.published)}
                                                    className={`p-1.5 rounded-lg ${item.published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                >
                                                    {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <Link href={`/admin/faq/${item.id}`} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
