"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Plus,
    Filter,
    LayoutGrid,
    List,
    Table,
    ChevronDown,
    ChevronUp,
    X,
    Phone,
    MessageCircle,
    Calendar,
    Edit,
    Eye,
    Clock,
    DollarSign,
    User,
    Building2,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    AlertCircle,
    TrendingUp,
    GripVertical,
    Home,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Deal,
    DEMO_DEALS,
    PIPELINE_STAGES,
    STAGE_ORDER,
    DEAL_PRIORITIES,
    getDaysInStage,
    calculateWeightedValue,
    getStageChangeXP,
    formatDealPrice,
    PipelineStage,
} from "@/types/pipeline";

// Pipeline sayfası
export default function PipelinePage() {
    const [view, setView] = useState<"kanban" | "list" | "table">("kanban");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [deals, setDeals] = useState<Deal[]>(DEMO_DEALS);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

    // Filtreler
    const [filters, setFilters] = useState({
        dateRange: "",
        propertyType: "",
        agent: "",
    });

    // DnD sensörleri
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Aşamalara göre grupla
    const dealsByStage = useMemo(() => {
        const grouped: Record<PipelineStage, Deal[]> = {} as any;
        STAGE_ORDER.forEach(stage => {
            grouped[stage] = deals.filter(d => d.stage === stage);
        });
        return grouped;
    }, [deals]);

    // Toplam değer
    const totalValue = useMemo(() => {
        return deals.reduce((sum, d) => sum + d.expected_value, 0);
    }, [deals]);

    // Weighted pipeline değeri
    const weightedValue = useMemo(() => {
        return calculateWeightedValue(deals);
    }, [deals]);

    // Deal taşıma
    const moveDeal = (dealId: string, newStage: PipelineStage) => {
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                const xp = getStageChangeXP(d.stage, newStage);
                if (xp > 0) {
                    // XP bildirimi (gerçek uygulamada toast kullanılır)
                    setTimeout(() => alert(`🎉 +${xp} XP kazandınız!`), 100);
                }
                return {
                    ...d,
                    stage: newStage,
                    stage_entered_at: new Date().toISOString().split("T")[0],
                    updated_at: new Date().toISOString(),
                };
            }
            return d;
        }));
    };

    // Drag başladığında
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const deal = deals.find(d => d.id === active.id);
        if (deal) {
            setActiveDeal(deal);
        }
    };

    // Drag bittiğinde
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDeal(null);

        if (!over) return;

        const dealId = active.id as string;
        const overId = over.id as string;

        // Eğer aşama üzerine bırakıldıysa
        if (STAGE_ORDER.includes(overId as PipelineStage)) {
            const newStage = overId as PipelineStage;
            const deal = deals.find(d => d.id === dealId);
            if (deal && deal.stage !== newStage) {
                moveDeal(dealId, newStage);
            }
        }
        // Eğer başka bir deal üzerine bırakıldıysa
        else {
            const overDeal = deals.find(d => d.id === overId);
            if (overDeal) {
                const deal = deals.find(d => d.id === dealId);
                if (deal && deal.stage !== overDeal.stage) {
                    moveDeal(dealId, overDeal.stage);
                }
            }
        }
    };

    // Slide-over açma
    const openDealDetail = (deal: Deal) => {
        setSelectedDeal(deal);
    };

    return (
        <div className="space-y-6">
            {/* Başlık ve Özet */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Satış Pipeline</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {deals.length} aktif fırsat • Kartları sürükleyerek aşama değiştirin
                    </p>
                </div>

                {/* Toplam değer göstergesi */}
                <div className="flex flex-wrap items-center gap-4">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4 flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Değer</p>
                                <p className="text-lg font-bold">{formatDealPrice(totalValue)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="p-4 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Weighted Pipeline</p>
                                <p className="text-lg font-bold">{formatDealPrice(weightedValue)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Link href="/dashboard/pipeline/new">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Fırsat
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Kontroller */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Görünüm seçici */}
                <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
                    <TabsList>
                        <TabsTrigger value="kanban">
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger value="list">
                            <List className="w-4 h-4 mr-2" />
                            Liste
                        </TabsTrigger>
                        <TabsTrigger value="table">
                            <Table className="w-4 h-4 mr-2" />
                            Tablo
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Filtre butonu */}
                <Button
                    variant="outline"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={cn(filterOpen && "bg-blue-50 border-blue-200 dark:bg-blue-900/20")}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrele
                    {filterOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
            </div>

            {/* Filtre Paneli */}
            {filterOpen && (
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Tarih Aralığı</Label>
                                <Select value={filters.dateRange} onValueChange={(v) => setFilters({ ...filters, dateRange: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tümü" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tümü</SelectItem>
                                        <SelectItem value="week">Son 1 Hafta</SelectItem>
                                        <SelectItem value="month">Son 1 Ay</SelectItem>
                                        <SelectItem value="quarter">Son 3 Ay</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Mülk Tipi</Label>
                                <Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tümü" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tümü</SelectItem>
                                        <SelectItem value="satis">Satış</SelectItem>
                                        <SelectItem value="kiralama">Kiralama</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Danışman</Label>
                                <Select value={filters.agent} onValueChange={(v) => setFilters({ ...filters, agent: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tümü" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tümü</SelectItem>
                                        <SelectItem value="me">Sadece Ben</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Kanban Görünümü */}
            {view === "kanban" && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
                            {STAGE_ORDER.slice(0, 8).map((stage) => (
                                <KanbanColumn
                                    key={stage}
                                    stage={stage}
                                    deals={dealsByStage[stage]}
                                    onDealClick={openDealDetail}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                        {activeDeal ? (
                            <DealCardDragOverlay deal={activeDeal} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            {/* Liste Görünümü */}
            {view === "list" && (
                <div className="space-y-3">
                    {deals.map((deal) => (
                        <DealListCard
                            key={deal.id}
                            deal={deal}
                            onClick={() => openDealDetail(deal)}
                        />
                    ))}
                </div>
            )}

            {/* Tablo Görünümü */}
            {view === "table" && (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fırsat</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Değer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aşama</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öncelik</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Aktivite</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {deals.map((deal) => (
                                    <tr
                                        key={deal.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                        onClick={() => openDealDetail(deal)}
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-sm">{deal.title}</p>
                                            <p className="text-xs text-gray-500">{deal.property_title}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm">{deal.customer_name}</td>
                                        <td className="px-4 py-4 text-sm font-medium">{formatDealPrice(deal.expected_value)}</td>
                                        <td className="px-4 py-4">
                                            <Badge className={cn(PIPELINE_STAGES[deal.stage].color, "text-white")}>
                                                {PIPELINE_STAGES[deal.stage].label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge className={DEAL_PRIORITIES[deal.priority].color}>
                                                {DEAL_PRIORITIES[deal.priority].label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {new Date(deal.last_activity_at).toLocaleDateString("tr-TR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Deal Slide-over */}
            {selectedDeal && (
                <DealSlideOver
                    deal={selectedDeal}
                    onClose={() => setSelectedDeal(null)}
                    onMoveDeal={moveDeal}
                />
            )}
        </div>
    );
}

// Kanban sütunu
function KanbanColumn({
    stage,
    deals,
    onDealClick,
}: {
    stage: PipelineStage;
    deals: Deal[];
    onDealClick: (deal: Deal) => void;
}) {
    const stageInfo = PIPELINE_STAGES[stage];
    const totalValue = deals.reduce((sum, d) => sum + d.expected_value, 0);

    const { setNodeRef, isOver } = useSortable({
        id: stage,
        data: {
            type: "column",
            stage,
        },
    });

    return (
        <div className="w-72 flex-shrink-0">
            {/* Sütun başlığı */}
            <div className={cn("rounded-t-lg px-3 py-2 text-white", stageInfo.color)}>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{stageInfo.label}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {deals.length}
                    </Badge>
                </div>
                <p className="text-xs text-white/80 mt-1">{formatDealPrice(totalValue)}</p>
            </div>

            {/* Kartlar */}
            <div
                ref={setNodeRef}
                className={cn(
                    "bg-gray-100 dark:bg-gray-800 rounded-b-lg p-2 min-h-[400px] space-y-2 transition-colors",
                    isOver && "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400"
                )}
            >
                <SortableContext
                    items={deals.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {deals.map((deal) => (
                        <SortableDealCard
                            key={deal.id}
                            deal={deal}
                            onClick={() => onDealClick(deal)}
                        />
                    ))}
                </SortableContext>

                {deals.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                        Buraya sürükleyin
                    </div>
                )}
            </div>
        </div>
    );
}

// Sürüklenebilir Deal kartı
function SortableDealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: deal.id,
        data: {
            type: "deal",
            deal,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const daysInStage = getDaysInStage(deal.stage_entered_at);
    const isOverdue = daysInStage > 7;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm hover:shadow-md transition-all border group",
                isDragging && "opacity-50 shadow-lg scale-105"
            )}
        >
            {/* Drag handle */}
            <div className="flex items-start gap-2">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* Kart içeriği */}
                <div className="flex-1 cursor-pointer" onClick={onClick}>
                    {/* Mülk thumbnail */}
                    <div className="flex gap-3">
                        <div className="w-14 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{deal.property_title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{deal.customer_name}</p>
                        </div>
                    </div>

                    {/* Fiyat ve info */}
                    <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-blue-600 text-sm">
                            {formatDealPrice(deal.expected_value)}
                        </span>
                        {deal.priority !== "normal" && (
                            <Badge className={cn("text-xs", DEAL_PRIORITIES[deal.priority].color)}>
                                {DEAL_PRIORITIES[deal.priority].label}
                            </Badge>
                        )}
                    </div>

                    {/* Aşamada kalma süresi */}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span className={cn(isOverdue && "text-orange-500 font-medium")}>
                            {isOverdue && <AlertCircle className="w-3 h-3 inline mr-1" />}
                            {daysInStage} gün
                        </span>
                        <span>{new Date(deal.last_activity_at).toLocaleDateString("tr-TR")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Drag overlay için basit kart
function DealCardDragOverlay({ deal }: { deal: Deal }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-xl border-2 border-blue-400 w-72 rotate-3">
            <div className="flex gap-3">
                <div className="w-14 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{deal.property_title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{deal.customer_name}</p>
                </div>
            </div>
            <div className="mt-2">
                <span className="font-bold text-blue-600 text-sm">
                    {formatDealPrice(deal.expected_value)}
                </span>
            </div>
        </div>
    );
}

// Deal liste kartı
function DealListCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
    const stageInfo = PIPELINE_STAGES[deal.stage];
    const daysInStage = getDaysInStage(deal.stage_entered_at);

    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{deal.title}</p>
                            <Badge className={cn("text-xs", DEAL_PRIORITIES[deal.priority].color)}>
                                {DEAL_PRIORITIES[deal.priority].label}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{deal.property_title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {deal.customer_name}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {daysInStage} gün
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-blue-600">{formatDealPrice(deal.expected_value)}</p>
                        <Badge className={cn("text-xs mt-1", stageInfo.color, "text-white")}>
                            {stageInfo.label}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Deal Slide-over
function DealSlideOver({
    deal,
    onClose,
    onMoveDeal,
}: {
    deal: Deal;
    onClose: () => void;
    onMoveDeal: (dealId: string, newStage: PipelineStage) => void;
}) {
    const stageInfo = PIPELINE_STAGES[deal.stage];
    const currentIndex = STAGE_ORDER.indexOf(deal.stage);
    const prevStage = currentIndex > 0 ? STAGE_ORDER[currentIndex - 1] : null;
    const nextStage = currentIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentIndex + 1] : null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Fırsat Detayı</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Başlık ve aşama */}
                    <div>
                        <h3 className="text-xl font-bold">{deal.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className={cn(stageInfo.color, "text-white")}>
                                {stageInfo.label}
                            </Badge>
                            <Badge className={DEAL_PRIORITIES[deal.priority].color}>
                                {DEAL_PRIORITIES[deal.priority].label}
                            </Badge>
                        </div>
                    </div>

                    {/* Aşama değiştirme */}
                    <Card>
                        <CardContent className="p-4">
                            <Label className="text-sm text-gray-500">Aşamayı Değiştir</Label>
                            <div className="flex gap-2 mt-2">
                                {prevStage && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onMoveDeal(deal.id, prevStage)}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        {PIPELINE_STAGES[prevStage].label}
                                    </Button>
                                )}
                                {nextStage && (
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                        onClick={() => onMoveDeal(deal.id, nextStage)}
                                    >
                                        {PIPELINE_STAGES[nextStage].label}
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                        <Sparkles className="w-3 h-3 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Değer */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Beklenen Değer</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatDealPrice(deal.expected_value)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Olasılık</p>
                                    <p className="text-xl font-bold">{stageInfo.probability}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hızlı Aksiyonlar */}
                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" className="flex-col h-auto py-3">
                            <Phone className="w-5 h-5 mb-1 text-green-600" />
                            <span className="text-xs">Ara</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3">
                            <MessageCircle className="w-5 h-5 mb-1 text-green-500" />
                            <span className="text-xs">WhatsApp</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3">
                            <Calendar className="w-5 h-5 mb-1 text-blue-600" />
                            <span className="text-xs">Randevu</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3">
                            <Edit className="w-5 h-5 mb-1 text-gray-600" />
                            <span className="text-xs">Düzenle</span>
                        </Button>
                    </div>

                    {/* Mülk bilgisi */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Mülk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <div className="w-20 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <Link href={`/dashboard/portfolio/${deal.property_id}`} className="font-medium text-sm hover:text-blue-600">
                                        {deal.property_title}
                                    </Link>
                                    <p className="text-sm text-blue-600 font-bold">{formatDealPrice(deal.property_price)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Müşteri bilgisi */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Müşteri
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link href={`/dashboard/customers/${deal.customer_id}`} className="font-medium hover:text-blue-600">
                                        {deal.customer_name}
                                    </Link>
                                    <p className="text-sm text-gray-500">{deal.customer_phone}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Profil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sonraki aksiyon */}
                    {deal.next_action && (
                        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                    <AlertCircle className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-medium">Sonraki Aksiyon</p>
                                        <p className="text-sm">{deal.next_action}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notlar */}
                    {deal.notes && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Notlar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{deal.notes}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* XP bilgisi */}
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <span className="font-medium">Aşama ilerletme XP</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Gösterim</span>
                                    <span className="text-green-600">+20 XP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Teklif</span>
                                    <span className="text-green-600">+30 XP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sözleşme</span>
                                    <span className="text-green-600">+50 XP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Kapanış</span>
                                    <span className="text-green-600">+100 XP</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
