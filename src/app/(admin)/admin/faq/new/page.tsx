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

const categories = ["Genel", "Fiyatlandırma", "Özellikler", "Güvenlik", "Teknik"];

export default function NewFAQPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "Genel",
        order_index: 0,
        published: true,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("faq_items").insert([formData]);

        if (error) {
            alert("Hata: " + error.message);
        } else {
            router.push("/admin/faq");
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/faq" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni SSS</h1>
                    <p className="text-gray-600">Sık sorulan soru ekleyin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
                    <div>
                        <Label htmlFor="question">Soru *</Label>
                        <Input
                            id="question"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Sık sorulan soru..."
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="answer">Cevap *</Label>
                        <textarea
                            id="answer"
                            rows={5}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            placeholder="Detaylı cevap..."
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
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
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="order_index">Sıra Numarası</Label>
                            <Input
                                id="order_index"
                                type="number"
                                min={0}
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-4 h-4 rounded"
                        />
                        <span>Yayınla</span>
                    </label>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
