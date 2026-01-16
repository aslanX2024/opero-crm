"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    ListTodo,
    Users,
    Zap,
    Calendar,
    Clock,
    CheckCircle,
    Edit,
    Trash2,
    RefreshCw,
    CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

// Görev tipi
interface BrokerTask {
    id: string;
    title: string;
    description?: string | null;
    xp_reward: number;
    recurrence_type: "daily" | "weekly" | "one_time";
    is_active: boolean;
    created_at: string;
}

// Tekrarlama tipi renkleri
const RECURRENCE_COLORS = {
    daily: { label: "Günlük", color: "bg-blue-100 text-blue-700", icon: Calendar },
    weekly: { label: "Haftalık", color: "bg-purple-100 text-purple-700", icon: CalendarDays },
    one_time: { label: "Tek Seferlik", color: "bg-gray-100 text-gray-700", icon: Clock },
};

export default function TasksPage() {
    const { profile, user } = useAuth();
    const isBroker = profile?.role === "broker";
    const [tasks, setTasks] = useState<BrokerTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<BrokerTask | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        xp_reward: 20,
        recurrence_type: "daily" as "daily" | "weekly" | "one_time",
        is_active: true,
    });

    // Görevleri yükle
    useEffect(() => {
        async function loadTasks() {
            if (!user) return;
            setLoading(true);

            // Şimdilik user.id kullanıyoruz
            // Danışman-broker ilişkisi için profiles tablosunda broker_id alanı eklenebilir
            const brokerId = user.id;

            if (!brokerId) {
                setTasks([]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("broker_tasks")
                .select("*")
                .eq("broker_id", brokerId)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setTasks(data);
            } else {
                setTasks([]);
            }
            setLoading(false);
        }

        loadTasks();
    }, [user, profile, isBroker]);

    // Kaydet
    const handleSave = async () => {
        if (!user || !formData.title.trim()) {
            setError("Görev başlığı zorunludur.");
            return;
        }

        setError(null);

        const payload = {
            broker_id: user.id,
            title: formData.title,
            description: formData.description || null,
            xp_reward: formData.xp_reward,
            recurrence_type: formData.recurrence_type,
            is_active: formData.is_active,
        };

        if (editingTask) {
            const { error } = await supabase
                .from("broker_tasks")
                .update(payload)
                .eq("id", editingTask.id);

            if (error) {
                setError(error.message);
                return;
            }

            setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...payload } : t));
        } else {
            const { data, error } = await supabase
                .from("broker_tasks")
                .insert(payload)
                .select()
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            setTasks([data, ...tasks]);
        }

        resetForm();
    };

    // Sil
    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("broker_tasks")
            .delete()
            .eq("id", id);

        if (!error) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    // Aktif/Pasif yap
    const toggleActive = async (task: BrokerTask) => {
        const { error } = await supabase
            .from("broker_tasks")
            .update({ is_active: !task.is_active })
            .eq("id", task.id);

        if (!error) {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, is_active: !t.is_active } : t));
        }
    };

    // Form sıfırla
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            xp_reward: 20,
            recurrence_type: "daily",
            is_active: true,
        });
        setEditingTask(null);
        setIsDialogOpen(false);
        setError(null);
    };

    // Düzenle
    const handleEdit = (task: BrokerTask) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || "",
            xp_reward: task.xp_reward,
            recurrence_type: task.recurrence_type,
            is_active: task.is_active,
        });
        setIsDialogOpen(true);
    };

    // İstatistikler
    const stats = {
        total: tasks.length,
        active: tasks.filter(t => t.is_active).length,
        daily: tasks.filter(t => t.recurrence_type === "daily" && t.is_active).length,
        totalXP: tasks.filter(t => t.is_active).reduce((sum, t) => sum + t.xp_reward, 0),
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ListTodo className="w-7 h-7 text-blue-600" />
                        {isBroker ? "Görev Yönetimi" : "Görevlerim"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isBroker
                            ? "Danışmanlarınıza atanacak görevleri yönetin"
                            : "Broker tarafından size atanan görevler"}
                    </p>
                </div>

                {isBroker && (
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Görev
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTask ? "Görevi Düzenle" : "Yeni Görev Oluştur"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label htmlFor="title">Görev Başlığı *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Örn: Günlük 3 müşteri araması"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Görev detayları..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="xp_reward">XP Ödülü</Label>
                                        <Input
                                            id="xp_reward"
                                            type="number"
                                            min={1}
                                            value={formData.xp_reward}
                                            onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Tekrar Tipi</Label>
                                        <Select
                                            value={formData.recurrence_type}
                                            onValueChange={(v) => setFormData({ ...formData, recurrence_type: v as any })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Günlük</SelectItem>
                                                <SelectItem value="weekly">Haftalık</SelectItem>
                                                <SelectItem value="one_time">Tek Seferlik</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">Aktif Görev</p>
                                        <p className="text-xs text-gray-500">Danışmanlar görebilir</p>
                                    </div>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={resetForm}>
                                        İptal
                                    </Button>
                                    <Button className="flex-1" onClick={handleSave}>
                                        {editingTask ? "Güncelle" : "Oluştur"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Broker İstatistikleri */}
            {isBroker && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <ListTodo className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-gray-500">Toplam Görev</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.active}</p>
                                    <p className="text-xs text-gray-500">Aktif Görev</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.daily}</p>
                                    <p className="text-xs text-gray-500">Günlük Görev</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalXP}</p>
                                    <p className="text-xs text-gray-500">Günlük Max XP</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Görev Listesi */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <ListTodo className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {isBroker ? "Henüz Görev Yok" : "Atanmış Görev Bulunamadı"}
                        </h3>
                        <p className="text-gray-500 text-center mb-4 max-w-md">
                            {isBroker
                                ? "Danışmanlarınız için günlük, haftalık veya tek seferlik görevler oluşturun. Tamamladıklarında XP kazanırlar."
                                : "Broker henüz size görev atamamış."}
                        </p>
                        {isBroker && (
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                İlk Görevi Oluştur
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => {
                        const recurrenceInfo = RECURRENCE_COLORS[task.recurrence_type];
                        const RecurrenceIcon = recurrenceInfo.icon;

                        return (
                            <Card
                                key={task.id}
                                className={cn(
                                    "transition-opacity",
                                    !task.is_active && "opacity-60"
                                )}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                task.is_active ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
                                            )}>
                                                <RecurrenceIcon className={cn(
                                                    "w-5 h-5",
                                                    task.is_active ? "text-blue-600" : "text-gray-400"
                                                )} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold">{task.title}</h3>
                                                    <Badge className={recurrenceInfo.color}>
                                                        {recurrenceInfo.label}
                                                    </Badge>
                                                    {!task.is_active && (
                                                        <Badge variant="secondary">Pasif</Badge>
                                                    )}
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-yellow-600">
                                                    <Zap className="w-4 h-4" />
                                                    <span className="font-bold">+{task.xp_reward} XP</span>
                                                </div>
                                            </div>

                                            {isBroker && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => toggleActive(task)}
                                                    >
                                                        {task.is_active ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleEdit(task)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600"
                                                        onClick={() => handleDelete(task.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
