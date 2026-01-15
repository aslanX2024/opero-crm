"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    PlusCircle,
    Building2,
    Users,
    Receipt,
    Calendar,
    ArrowLeft,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

// Gider kategorileri
const EXPENSE_CATEGORIES = [
    { value: "rent", label: "Kira", icon: "🏢", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" },
    { value: "salary", label: "Maaş", icon: "💰", color: "bg-green-100 text-green-700 dark:bg-green-900/30" },
    { value: "marketing", label: "Pazarlama", icon: "📢", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30" },
    { value: "utilities", label: "Faturalar", icon: "💡", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30" },
    { value: "supplies", label: "Malzeme", icon: "📦", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30" },
    { value: "software", label: "Yazılım", icon: "💻", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30" },
    { value: "other", label: "Diğer", icon: "📋", color: "bg-gray-100 text-gray-700 dark:bg-gray-800" },
];

interface Expense {
    id: string;
    amount: number;
    category: string;
    description?: string;
    expense_date: string;
    created_at: string;
}

// Para formatla
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function BrokerFinancePage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        amount: "",
        category: "rent",
        description: "",
        expense_date: new Date().toISOString().split("T")[0],
    });

    // Giderleri yükle
    useEffect(() => {
        async function loadExpenses() {
            if (!user) return;
            setLoading(true);

            const [year, month] = selectedMonth.split("-");
            const startDate = `${year}-${month}-01`;
            const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("office_expenses")
                .select("*")
                .eq("broker_id", user.id)
                .gte("expense_date", startDate)
                .lte("expense_date", endDate)
                .order("expense_date", { ascending: false });

            if (!error && data) {
                setExpenses(data);
            } else {
                // Tablo yoksa veya hata varsa boş liste
                setExpenses([]);
            }
            setLoading(false);
        }

        loadExpenses();
    }, [user, selectedMonth]);

    // Gider ekle
    const handleAddExpense = async () => {
        if (!user || !newExpense.amount) return;

        const { data, error } = await supabase
            .from("office_expenses")
            .insert({
                broker_id: user.id,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                description: newExpense.description || null,
                expense_date: newExpense.expense_date,
            })
            .select()
            .single();

        if (!error && data) {
            setExpenses([data, ...expenses]);
            setNewExpense({
                amount: "",
                category: "rent",
                description: "",
                expense_date: new Date().toISOString().split("T")[0],
            });
            setIsAddDialogOpen(false);
        }
    };

    // Kategori bazlı toplam
    const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
        ...cat,
        total: expenses.filter((e) => e.category === cat.value).reduce((sum, e) => sum + e.amount, 0),
    }));

    // Toplam gider
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Ay listesi oluştur
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
            label: d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
        });
    }

    const getCategoryInfo = (category: string) => {
        return EXPENSE_CATEGORIES.find((c) => c.value === category) || EXPENSE_CATEGORIES[6];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/broker">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Receipt className="w-7 h-7 text-green-600" />
                            Ofis Finansı
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Gider takibi ve bütçe yönetimi
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Gider Ekle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni Gider Ekle</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label htmlFor="amount">Tutar (₺)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={newExpense.category}
                                        onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXPENSE_CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.icon} {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="date">Tarih</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newExpense.expense_date}
                                        onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Açıklama (opsiyonel)</Label>
                                    <Input
                                        id="description"
                                        placeholder="Açıklama..."
                                        value={newExpense.description}
                                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleAddExpense}>
                                    Gider Ekle
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                                <p className="text-sm text-gray-500">Toplam Gider</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {categoryTotals.slice(0, 3).map((cat) => (
                    <Card key={cat.value}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${cat.color}`}>
                                    <span className="text-xl">{cat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{formatCurrency(cat.total)}</p>
                                    <p className="text-sm text-gray-500">{cat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Kategori Bazlı Dağılım */}
            <Card>
                <CardHeader>
                    <CardTitle>Kategori Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {categoryTotals.map((cat) => (
                            <div key={cat.value} className="flex items-center gap-4">
                                <div className={`p-2 rounded ${cat.color}`}>
                                    <span>{cat.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{cat.label}</span>
                                        <span>{formatCurrency(cat.total)}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all"
                                            style={{
                                                width: totalExpense > 0 ? `${(cat.total / totalExpense) * 100}%` : "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Gider Listesi */}
            <Card>
                <CardHeader>
                    <CardTitle>Gider Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Bu ay için gider kaydı bulunmuyor</p>
                            <p className="text-sm mt-2">
                                "Gider Ekle" butonuyla yeni gider ekleyebilirsiniz
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((expense) => {
                                const cat = getCategoryInfo(expense.category);
                                return (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded ${cat.color}`}>
                                                <span className="text-lg">{cat.icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{cat.label}</p>
                                                {expense.description && (
                                                    <p className="text-sm text-gray-500">{expense.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-red-600">
                                                -{formatCurrency(expense.amount)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(expense.expense_date).toLocaleDateString("tr-TR")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
