"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Trash2,
    Edit,
    MoreHorizontal,
    Filter,
    Search,
    ListTodo,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import {
    Task,
    getTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats,
    PRIORITY_LABELS,
    STATUS_LABELS,
    CreateTaskInput,
} from "@/services/task-service";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

// Öncelik rengi
function getPriorityColor(priority: string) {
    switch (priority) {
        case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "low": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        default: return "bg-gray-100 text-gray-700";
    }
}

// Durum rengi
function getStatusColor(status: string) {
    switch (status) {
        case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "in_progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case "pending": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        default: return "bg-gray-100 text-gray-700";
    }
}

// Tarih kontrolü
function isOverdue(dueDate?: string) {
    if (!dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
}

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState<CreateTaskInput>({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending",
    });

    // Görevleri yükle
    const loadTasks = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const [tasksData, statsData] = await Promise.all([
                getTasks(user.id),
                getTaskStats(user.id),
            ]);
            setTasks(tasksData);
            setStats(statsData);
        } catch (err) {
            setError("Görevler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [user?.id]);

    // Filtrelenmiş görevler
    const filteredTasks = tasks.filter((task) => {
        // Arama
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!task.title.toLowerCase().includes(query) &&
                !(task.description || "").toLowerCase().includes(query)) {
                return false;
            }
        }

        // Durum filtresi
        if (filterStatus !== "all" && task.status !== filterStatus) {
            return false;
        }

        // Öncelik filtresi
        if (filterPriority !== "all" && task.priority !== filterPriority) {
            return false;
        }

        return true;
    });

    // Form gönder
    const handleSubmit = async () => {
        if (!user?.id || !formData.title.trim()) return;

        if (editingTask) {
            // Güncelle
            const updated = await updateTask(editingTask.id, formData);
            if (updated) {
                setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
            }
        } else {
            // Oluştur
            const created = await createTask(user.id, formData);
            if (created) {
                setTasks([created, ...tasks]);
                setStats({ ...stats, total: stats.total + 1, pending: stats.pending + 1 });
            }
        }

        resetForm();
    };

    // Form sıfırla
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            due_date: "",
            priority: "medium",
            status: "pending",
        });
        setEditingTask(null);
        setIsAddDialogOpen(false);
    };

    // Düzenle
    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || "",
            due_date: task.due_date || "",
            priority: task.priority,
            status: task.status,
        });
        setIsAddDialogOpen(true);
    };

    // Durumu değiştir
    const handleStatusChange = async (taskId: string, status: Task["status"]) => {
        await updateTaskStatus(taskId, status);
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
        loadTasks(); // Stats'ı da güncelle
    };

    // Sil
    const handleDelete = async (taskId: string) => {
        const success = await deleteTask(taskId);
        if (success) {
            setTasks(tasks.filter(t => t.id !== taskId));
            setStats({ ...stats, total: stats.total - 1 });
        }
    };

    // Tamamlandı olarak işaretle
    const handleToggleComplete = async (task: Task) => {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        await handleStatusChange(task.id, newStatus);
    };

    if (error) {
        return <ErrorState message={error} onRetry={loadTasks} />;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500">Görevler yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ListTodo className="w-7 h-7 text-blue-600" />
                        Görevler
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Görevlerinizi yönetin ve takip edin
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
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
                                {editingTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="title">Başlık *</Label>
                                <Input
                                    id="title"
                                    placeholder="Görev başlığı..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Açıklama (opsiyonel)..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="due_date">Bitiş Tarihi</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priority">Öncelik</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">🟢 Düşük</SelectItem>
                                            <SelectItem value="medium">🟡 Orta</SelectItem>
                                            <SelectItem value="high">🔴 Yüksek</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {editingTask && (
                                <div>
                                    <Label htmlFor="status">Durum</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Bekliyor</SelectItem>
                                            <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                                            <SelectItem value="completed">Tamamlandı</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={resetForm}
                                >
                                    İptal
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleSubmit}
                                    disabled={!formData.title.trim()}
                                >
                                    {editingTask ? "Güncelle" : "Oluştur"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Toplam</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-300 dark:border-gray-700">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Bekliyor</p>
                        <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-300 dark:border-blue-700">
                    <CardContent className="p-4">
                        <p className="text-sm text-blue-600">Devam Ediyor</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                    </CardContent>
                </Card>
                <Card className="border-green-300 dark:border-green-700">
                    <CardContent className="p-4">
                        <p className="text-sm text-green-600">Tamamlandı</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </CardContent>
                </Card>
                <Card className="border-red-300 dark:border-red-700">
                    <CardContent className="p-4">
                        <p className="text-sm text-red-600">Gecikmiş</p>
                        <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtreler */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Görev ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Durum" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Durumlar</SelectItem>
                        <SelectItem value="pending">Bekliyor</SelectItem>
                        <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                        <SelectItem value="completed">Tamamlandı</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Öncelik" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Öncelikler</SelectItem>
                        <SelectItem value="high">🔴 Yüksek</SelectItem>
                        <SelectItem value="medium">🟡 Orta</SelectItem>
                        <SelectItem value="low">🟢 Düşük</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Görev Listesi */}
            <Card>
                <CardContent className="p-0">
                    {filteredTasks.length === 0 ? (
                        <EmptyState
                            icon={ListTodo}
                            title="Görev Bulunamadı"
                            description={tasks.length === 0
                                ? "Henüz görev eklenmemiş. İlk görevinizi oluşturun!"
                                : "Arama kriterlerinize uygun görev bulunamadı."
                            }
                            actionLabel={tasks.length === 0 ? "Yeni Görev" : undefined}
                            onAction={tasks.length === 0 ? () => setIsAddDialogOpen(true) : undefined}
                        />
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredTasks.map((task) => {
                                const overdue = isOverdue(task.due_date) && task.status !== "completed";

                                return (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                                            task.status === "completed" && "opacity-60"
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <Checkbox
                                            checked={task.status === "completed"}
                                            onCheckedChange={() => handleToggleComplete(task)}
                                            className="w-5 h-5"
                                        />

                                        {/* İçerik */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={cn(
                                                    "font-medium",
                                                    task.status === "completed" && "line-through text-gray-500"
                                                )}>
                                                    {task.title}
                                                </p>
                                                <Badge className={getPriorityColor(task.priority)}>
                                                    {PRIORITY_LABELS[task.priority]}
                                                </Badge>
                                                {task.status !== "pending" && (
                                                    <Badge className={getStatusColor(task.status)}>
                                                        {STATUS_LABELS[task.status]}
                                                    </Badge>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-gray-500 mt-1 truncate">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Tarih */}
                                        {task.due_date && (
                                            <div className={cn(
                                                "flex items-center gap-1 text-sm",
                                                overdue ? "text-red-600" : "text-gray-500"
                                            )}>
                                                {overdue && <AlertCircle className="w-4 h-4" />}
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(task.due_date).toLocaleDateString("tr-TR", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </span>
                                            </div>
                                        )}

                                        {/* Aksiyonlar */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(task)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
