"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Clock,
    MapPin,
    User,
    Building2,
    Phone,
    MessageCircle,
    Edit,
    Trash2,
    CheckCircle,
    X,
    Filter,
    ChevronDown,
    FileText,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    Appointment,
    DEMO_APPOINTMENTS,
    APPOINTMENT_TYPES,
    APPOINTMENT_STATUSES,
    DAYS_TR,
    DAYS_FULL_TR,
    MONTHS_TR,
    getMonthDays,
    getWeekDays,
    formatDate,
    isSameDay,
    isToday,
    AppointmentType,
    AppointmentStatus,
} from "@/types/appointment";
import { ShowingFeedbackModal, ShowingStatsCard, ShowingFeedback } from "@/components/feedback/showing-feedback";

// Takvim sayfası
export default function AppointmentsPage() {
    const [view, setView] = useState<"day" | "week" | "month" | "list">("week");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);

    // Filtreler
    const [filterType, setFilterType] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("");

    // Feedback modal
    const [feedbackAppointment, setFeedbackAppointment] = useState<Appointment | null>(null);

    // Filtrelenmiş randevular
    const filteredAppointments = useMemo(() => {
        return appointments.filter((apt) => {
            if (filterType && apt.type !== filterType) return false;
            if (filterStatus && apt.status !== filterStatus) return false;
            return true;
        });
    }, [appointments, filterType, filterStatus]);

    // Navigasyon
    const goToToday = () => setSelectedDate(new Date());

    const goToPrev = () => {
        const newDate = new Date(selectedDate);
        if (view === "day") newDate.setDate(newDate.getDate() - 1);
        else if (view === "week") newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setSelectedDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(selectedDate);
        if (view === "day") newDate.setDate(newDate.getDate() + 1);
        else if (view === "week") newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        setSelectedDate(newDate);
    };

    // Tarih başlığı
    const getDateTitle = () => {
        if (view === "day") {
            return `${selectedDate.getDate()} ${MONTHS_TR[selectedDate.getMonth()]} ${selectedDate.getFullYear()}, ${DAYS_FULL_TR[selectedDate.getDay()]}`;
        } else if (view === "week") {
            const weekDays = getWeekDays(selectedDate);
            const start = weekDays[0];
            const end = weekDays[6];
            if (start.getMonth() === end.getMonth()) {
                return `${start.getDate()} - ${end.getDate()} ${MONTHS_TR[start.getMonth()]} ${start.getFullYear()}`;
            }
            return `${start.getDate()} ${MONTHS_TR[start.getMonth()]} - ${end.getDate()} ${MONTHS_TR[end.getMonth()]} ${start.getFullYear()}`;
        }
        return `${MONTHS_TR[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    };

    // Randevu durumu değiştir
    const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status, updated_at: new Date().toISOString() } : apt
        ));
        setSelectedAppointment(null);
    };

    // Gösterim için tamamla (feedback ile)
    const completeShowingWithFeedback = (appointment: Appointment) => {
        if (appointment.type === "gosterim") {
            setFeedbackAppointment(appointment);
            setSelectedAppointment(null);
        } else {
            updateAppointmentStatus(appointment.id, "tamamlandi");
        }
    };

    // Feedback gönderildiğinde
    const handleFeedbackSubmit = (feedback: ShowingFeedback) => {
        if (feedbackAppointment) {
            updateAppointmentStatus(feedbackAppointment.id, "tamamlandi");
            // Feedback'i kaydet (gerçek uygulamada API'ye gönderilir)
            console.log("Feedback:", feedback);
        }
        setFeedbackAppointment(null);
    };

    // Randevu sil
    const deleteAppointment = (id: string) => {
        if (confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) {
            setAppointments(prev => prev.filter(apt => apt.id !== id));
            setSelectedAppointment(null);
        }
    };

    // Günün randevuları
    const todayAppointments = useMemo(() => {
        const today = formatDate(new Date());
        return filteredAppointments
            .filter(apt => apt.date === today && apt.status === "planlanmis")
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
    }, [filteredAppointments]);

    // Sonraki 5 randevu
    const upcomingAppointments = useMemo(() => {
        const today = formatDate(new Date());
        return filteredAppointments
            .filter(apt => apt.date >= today && apt.status === "planlanmis")
            .sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return a.start_time.localeCompare(b.start_time);
            })
            .slice(0, 5);
    }, [filteredAppointments]);

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Randevular</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {todayAppointments.length} randevu bugün
                    </p>
                </div>
                <Link href="/dashboard/appointments/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Randevu
                    </Button>
                </Link>
            </div>

            {/* Kontroller */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Görünüm ve Navigasyon */}
                <div className="flex items-center gap-2">
                    <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
                        <TabsList>
                            <TabsTrigger value="day">Gün</TabsTrigger>
                            <TabsTrigger value="week">Hafta</TabsTrigger>
                            <TabsTrigger value="month">Ay</TabsTrigger>
                            <TabsTrigger value="list">Liste</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-1 ml-4">
                        <Button variant="outline" size="icon" onClick={goToPrev}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={goToToday} className="px-3">
                            Bugün
                        </Button>
                        <Button variant="outline" size="icon" onClick={goToNext}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <span className="ml-4 font-medium">{getDateTitle()}</span>
                </div>

                {/* Filtreler */}
                <div className="flex items-center gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Tür" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(APPOINTMENT_TYPES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Durum" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {Object.entries(APPOINTMENT_STATUSES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Ana İçerik */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Takvim */}
                <div className="lg:col-span-3">
                    {view === "month" && (
                        <MonthView
                            selectedDate={selectedDate}
                            appointments={filteredAppointments}
                            onDateClick={(date) => {
                                setSelectedDate(date);
                                setView("day");
                            }}
                            onAppointmentClick={setSelectedAppointment}
                        />
                    )}

                    {view === "week" && (
                        <WeekView
                            selectedDate={selectedDate}
                            appointments={filteredAppointments}
                            onAppointmentClick={setSelectedAppointment}
                        />
                    )}

                    {view === "day" && (
                        <DayView
                            selectedDate={selectedDate}
                            appointments={filteredAppointments}
                            onAppointmentClick={setSelectedAppointment}
                        />
                    )}

                    {view === "list" && (
                        <ListView
                            appointments={filteredAppointments}
                            onAppointmentClick={setSelectedAppointment}
                        />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Günün Özeti */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                Bugün
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todayAppointments.length > 0 ? (
                                todayAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => setSelectedAppointment(apt)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", APPOINTMENT_TYPES[apt.type].color)} />
                                            <span className="text-sm font-medium">{apt.start_time}</span>
                                        </div>
                                        <p className="text-sm mt-1 line-clamp-1">{apt.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Bugün randevu yok
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Yaklaşan Randevular */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Yaklaşan Randevular
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setSelectedAppointment(apt)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", APPOINTMENT_TYPES[apt.type].color)} />
                                            <span className="text-xs text-gray-500">{apt.date}</span>
                                        </div>
                                        <span className="text-xs font-medium">{apt.start_time}</span>
                                    </div>
                                    <p className="text-sm mt-1 line-clamp-1">{apt.title}</p>
                                    <p className="text-xs text-gray-500">{apt.customer_name}</p>
                                </div>
                            ))}
                            {upcomingAppointments.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Yaklaşan randevu yok
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Renk Açıklaması */}
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-gray-500 mb-2">Randevu Türleri</p>
                            <div className="space-y-2">
                                {Object.entries(APPOINTMENT_TYPES).map(([key, { label, color }]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className={cn("w-3 h-3 rounded-full", color)} />
                                        <span className="text-sm">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Randevu Detay Popup */}
            {selectedAppointment && (
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onComplete={() => completeShowingWithFeedback(selectedAppointment)}
                    onCancel={() => updateAppointmentStatus(selectedAppointment.id, "iptal")}
                    onNoShow={() => updateAppointmentStatus(selectedAppointment.id, "noshow")}
                    onDelete={() => deleteAppointment(selectedAppointment.id)}
                />
            )}

            {/* Gösterim Feedback Modal */}
            {feedbackAppointment && (
                <ShowingFeedbackModal
                    appointmentId={feedbackAppointment.id}
                    propertyTitle={feedbackAppointment.property_title || ""}
                    customerName={feedbackAppointment.customer_name || ""}
                    onClose={() => setFeedbackAppointment(null)}
                    onSubmit={handleFeedbackSubmit}
                />
            )}
        </div>
    );
}

// Ay görünümü
function MonthView({
    selectedDate,
    appointments,
    onDateClick,
    onAppointmentClick,
}: {
    selectedDate: Date;
    appointments: Appointment[];
    onDateClick: (date: Date) => void;
    onAppointmentClick: (apt: Appointment) => void;
}) {
    const days = getMonthDays(selectedDate.getFullYear(), selectedDate.getMonth());
    const today = new Date();

    const getAppointmentsForDay = (date: Date) => {
        const dateStr = formatDate(date);
        return appointments.filter((apt) => apt.date === dateStr);
    };

    return (
        <Card>
            <CardContent className="p-4">
                {/* Gün başlıkları */}
                <div className="grid grid-cols-7 mb-2">
                    {DAYS_TR.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Günler */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                        const dayAppointments = getAppointmentsForDay(day);

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "min-h-24 p-1 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                                    !isCurrentMonth && "bg-gray-50 dark:bg-gray-900",
                                    isToday(day) && "border-blue-500 border-2"
                                )}
                                onClick={() => onDateClick(day)}
                            >
                                <div className={cn(
                                    "text-sm font-medium mb-1",
                                    !isCurrentMonth && "text-gray-400",
                                    isToday(day) && "text-blue-600"
                                )}>
                                    {day.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayAppointments.slice(0, 2).map((apt) => (
                                        <div
                                            key={apt.id}
                                            className={cn(
                                                "text-xs p-1 rounded truncate",
                                                APPOINTMENT_TYPES[apt.type].bgColor
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAppointmentClick(apt);
                                            }}
                                        >
                                            {apt.start_time} {apt.title}
                                        </div>
                                    ))}
                                    {dayAppointments.length > 2 && (
                                        <div className="text-xs text-gray-500 pl-1">
                                            +{dayAppointments.length - 2} daha
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Hafta görünümü
function WeekView({
    selectedDate,
    appointments,
    onAppointmentClick,
}: {
    selectedDate: Date;
    appointments: Appointment[];
    onAppointmentClick: (apt: Appointment) => void;
}) {
    const weekDays = getWeekDays(selectedDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 - 19:00

    const getAppointmentsForDay = (date: Date) => {
        const dateStr = formatDate(date);
        return appointments.filter((apt) => apt.date === dateStr);
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-8 gap-1">
                    {/* Saat sütunu */}
                    <div className="text-sm">
                        <div className="h-12" /> {/* Başlık boşluğu */}
                        {hours.map((hour) => (
                            <div key={hour} className="h-16 text-right pr-2 text-gray-500 text-xs">
                                {hour.toString().padStart(2, "0")}:00
                            </div>
                        ))}
                    </div>

                    {/* Gün sütunları */}
                    {weekDays.map((day, idx) => {
                        const dayAppointments = getAppointmentsForDay(day);

                        return (
                            <div key={idx} className="relative">
                                {/* Gün başlığı */}
                                <div className={cn(
                                    "text-center py-2 border-b mb-1",
                                    isToday(day) && "bg-blue-50 dark:bg-blue-900/20"
                                )}>
                                    <div className="text-xs text-gray-500">{DAYS_TR[day.getDay()]}</div>
                                    <div className={cn(
                                        "text-lg font-medium",
                                        isToday(day) && "text-blue-600"
                                    )}>
                                        {day.getDate()}
                                    </div>
                                </div>

                                {/* Saat çizgileri */}
                                <div className="relative">
                                    {hours.map((hour) => (
                                        <div key={hour} className="h-16 border-b border-gray-100 dark:border-gray-800" />
                                    ))}

                                    {/* Randevular */}
                                    {dayAppointments.map((apt) => {
                                        const startHour = parseInt(apt.start_time.split(":")[0]);
                                        const startMinute = parseInt(apt.start_time.split(":")[1]);
                                        const endHour = parseInt(apt.end_time.split(":")[0]);
                                        const endMinute = parseInt(apt.end_time.split(":")[1]);

                                        const top = (startHour - 8) * 64 + (startMinute / 60) * 64;
                                        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                                        const height = (duration / 60) * 64;

                                        return (
                                            <div
                                                key={apt.id}
                                                className={cn(
                                                    "absolute left-0 right-0 mx-0.5 p-1 rounded text-xs cursor-pointer overflow-hidden",
                                                    APPOINTMENT_TYPES[apt.type].bgColor,
                                                    apt.status === "tamamlandi" && "opacity-60",
                                                    apt.status === "iptal" && "opacity-40 line-through"
                                                )}
                                                style={{ top: `${top}px`, height: `${height}px` }}
                                                onClick={() => onAppointmentClick(apt)}
                                            >
                                                <div className="font-medium">{apt.start_time}</div>
                                                <div className="truncate">{apt.title}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Gün görünümü
function DayView({
    selectedDate,
    appointments,
    onAppointmentClick,
}: {
    selectedDate: Date;
    appointments: Appointment[];
    onAppointmentClick: (apt: Appointment) => void;
}) {
    const dateStr = formatDate(selectedDate);
    const dayAppointments = appointments
        .filter((apt) => apt.date === dateStr)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-12 gap-4">
                    {/* Saat ve randevular */}
                    <div className="col-span-8 relative">
                        {hours.map((hour) => (
                            <div key={hour} className="flex h-20">
                                <div className="w-16 text-right pr-3 text-sm text-gray-500">
                                    {hour.toString().padStart(2, "0")}:00
                                </div>
                                <div className="flex-1 border-t border-gray-100 dark:border-gray-800 relative">
                                    {dayAppointments
                                        .filter((apt) => parseInt(apt.start_time.split(":")[0]) === hour)
                                        .map((apt) => {
                                            const duration =
                                                (parseInt(apt.end_time.split(":")[0]) - parseInt(apt.start_time.split(":")[0])) * 60 +
                                                (parseInt(apt.end_time.split(":")[1]) - parseInt(apt.start_time.split(":")[1]));

                                            return (
                                                <div
                                                    key={apt.id}
                                                    className={cn(
                                                        "absolute left-2 right-2 p-2 rounded-lg cursor-pointer",
                                                        APPOINTMENT_TYPES[apt.type].bgColor,
                                                        apt.status === "tamamlandi" && "opacity-60",
                                                        apt.status === "iptal" && "opacity-40"
                                                    )}
                                                    style={{ height: `${(duration / 60) * 80}px` }}
                                                    onClick={() => onAppointmentClick(apt)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-2 h-2 rounded-full", APPOINTMENT_TYPES[apt.type].color)} />
                                                        <span className="font-medium text-sm">
                                                            {apt.start_time} - {apt.end_time}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium mt-1">{apt.title}</p>
                                                    <p className="text-sm text-gray-600">{apt.customer_name}</p>
                                                    {apt.location && (
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {apt.location}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gün listesi */}
                    <div className="col-span-4 space-y-3">
                        <h3 className="font-medium text-sm text-gray-500">Günün Randevuları</h3>
                        {dayAppointments.length > 0 ? (
                            dayAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className={cn(
                                        "p-3 rounded-lg cursor-pointer border",
                                        APPOINTMENT_TYPES[apt.type].bgColor
                                    )}
                                    onClick={() => onAppointmentClick(apt)}
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge className={APPOINTMENT_STATUSES[apt.status].color}>
                                            {APPOINTMENT_STATUSES[apt.status].label}
                                        </Badge>
                                        <span className="text-sm font-medium">{apt.start_time}</span>
                                    </div>
                                    <p className="font-medium mt-2">{apt.title}</p>
                                    <p className="text-sm text-gray-600">{apt.customer_name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">
                                Bu gün için randevu yok
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Liste görünümü
function ListView({
    appointments,
    onAppointmentClick,
}: {
    appointments: Appointment[];
    onAppointmentClick: (apt: Appointment) => void;
}) {
    const sortedAppointments = [...appointments].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.start_time.localeCompare(b.start_time);
    });

    // Tarihe göre grupla
    const groupedByDate = sortedAppointments.reduce((acc, apt) => {
        if (!acc[apt.date]) acc[apt.date] = [];
        acc[apt.date].push(apt);
        return acc;
    }, {} as Record<string, Appointment[]>);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, apts]) => {
                        const dateObj = new Date(date);
                        return (
                            <div key={date}>
                                <h3 className={cn(
                                    "font-medium mb-3 pb-2 border-b",
                                    isToday(dateObj) && "text-blue-600"
                                )}>
                                    {dateObj.getDate()} {MONTHS_TR[dateObj.getMonth()]}, {DAYS_FULL_TR[dateObj.getDay()]}
                                    {isToday(dateObj) && <Badge className="ml-2 bg-blue-100 text-blue-700">Bugün</Badge>}
                                </h3>
                                <div className="space-y-2">
                                    {apts.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                            onClick={() => onAppointmentClick(apt)}
                                        >
                                            <div className={cn("w-1 h-12 rounded-full", APPOINTMENT_TYPES[apt.type].color)} />
                                            <div className="w-20 text-sm">
                                                <p className="font-medium">{apt.start_time}</p>
                                                <p className="text-gray-500">{apt.end_time}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{apt.title}</p>
                                                <p className="text-sm text-gray-500">{apt.customer_name} • {apt.location}</p>
                                            </div>
                                            <Badge className={APPOINTMENT_TYPES[apt.type].bgColor}>
                                                {APPOINTMENT_TYPES[apt.type].label}
                                            </Badge>
                                            <Badge className={APPOINTMENT_STATUSES[apt.status].color}>
                                                {APPOINTMENT_STATUSES[apt.status].label}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(groupedByDate).length === 0 && (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">Henüz randevu yok</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Randevu detay modal
function AppointmentDetailModal({
    appointment,
    onClose,
    onComplete,
    onCancel,
    onNoShow,
    onDelete,
}: {
    appointment: Appointment;
    onClose: () => void;
    onComplete: () => void;
    onCancel: () => void;
    onNoShow: () => void;
    onDelete: () => void;
}) {
    const typeInfo = APPOINTMENT_TYPES[appointment.type];
    const statusInfo = APPOINTMENT_STATUSES[appointment.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative w-full max-w-md">
                <CardHeader className={cn("border-l-4", typeInfo.color.replace("bg-", "border-"))}>
                    <div className="flex items-center justify-between">
                        <div>
                            <Badge className={typeInfo.bgColor}>{typeInfo.label}</Badge>
                            <Badge className={cn("ml-2", statusInfo.color)}>{statusInfo.label}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <CardTitle className="mt-2">{appointment.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Saat */}
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="font-medium">{appointment.start_time} - {appointment.end_time}</p>
                            <p className="text-sm text-gray-500">{appointment.date}</p>
                        </div>
                    </div>

                    {/* Müşteri */}
                    {appointment.customer_name && (
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                                <Link href={`/dashboard/customers/${appointment.customer_id}`} className="font-medium hover:text-blue-600">
                                    {appointment.customer_name}
                                </Link>
                                <p className="text-sm text-gray-500">{appointment.customer_phone}</p>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Phone className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MessageCircle className="w-4 h-4 text-green-500" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Mülk */}
                    {appointment.property_title && (
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <Link href={`/dashboard/portfolio/${appointment.property_id}`} className="hover:text-blue-600">
                                {appointment.property_title}
                            </Link>
                        </div>
                    )}

                    {/* Konum */}
                    {appointment.location && (
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{appointment.location}</span>
                        </div>
                    )}

                    {/* Notlar */}
                    {appointment.notes && (
                        <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                    )}

                    {/* Aksiyonlar */}
                    {appointment.status === "planlanmis" && (
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onComplete}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Tamamla
                            </Button>
                            <Button size="sm" variant="outline" onClick={onCancel}>
                                İptal
                            </Button>
                            <Button size="sm" variant="outline" className="text-orange-600" onClick={onNoShow}>
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Gelmedi
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                        </Button>
                        <Button variant="outline" className="text-red-600" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
