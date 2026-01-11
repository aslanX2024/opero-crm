"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

function FAQItemComponent({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left"
            >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-gray-500 transition-transform flex-shrink-0",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            {isOpen && (
                <div className="pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const [items, setItems] = useState<FAQItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("Tümü");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFAQs() {
            const { data, error } = await supabase
                .from("faq_items")
                .select("id, question, answer, category")
                .eq("published", true)
                .order("category")
                .order("order_index");

            if (!error && data) {
                setItems(data);
                const uniqueCategories = [...new Set(data.map(item => item.category))];
                setCategories(["Tümü", ...uniqueCategories]);
            }
            setLoading(false);
        }

        fetchFAQs();
    }, []);

    const filteredItems = searchQuery
        ? items.filter(
            (q) =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : activeCategory === "Tümü"
            ? items
            : items.filter((item) => item.category === activeCategory);

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Sık Sorulan Sorular
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        OPERO hakkında merak edilenler
                    </p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Soru ara..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Category Tabs */}
                    {!searchQuery && categories.length > 1 && (
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition",
                                        activeCategory === category
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Questions */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-6">
                        {loading ? (
                            <div className="py-12 text-center text-gray-500">Yükleniyor...</div>
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <FAQItemComponent key={item.id} question={item.question} answer={item.answer} />
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-500">
                                {searchQuery ? "Aramanızla eşleşen soru bulunamadı." : "Henüz soru eklenmemiş."}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Sorunuzu bulamadınız mı?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/iletisim"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                        >
                            Bize Yazın
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-medium"
                        >
                            Demo Talep Et
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
