// Randevu tipleri ve sabit değerler

export type AppointmentType = "gosterim" | "toplanti" | "degerleme" | "imza";
export type AppointmentStatus = "planlanmis" | "tamamlandi" | "iptal" | "noshow";

// Randevu arayüzü
export interface Appointment {
    id: string;
    title: string;
    type: AppointmentType;
    status: AppointmentStatus;
    date: string; // YYYY-MM-DD
    start_time: string; // HH:MM
    end_time: string; // HH:MM
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    property_id?: string;
    property_title?: string;
    location?: string;
    notes?: string;
    reminder_sent: boolean;
    assigned_to: string;
    created_at: string;
    updated_at: string;
}

// Randevu tipleri
export const APPOINTMENT_TYPES: Record<AppointmentType, { label: string; color: string; bgColor: string }> = {
    gosterim: { label: "Gösterim", color: "bg-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    toplanti: { label: "Toplantı", color: "bg-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
    degerleme: { label: "Değerleme", color: "bg-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    imza: { label: "İmza", color: "bg-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
};

// Randevu durumları
export const APPOINTMENT_STATUSES: Record<AppointmentStatus, { label: string; color: string }> = {
    planlanmis: { label: "Planlanmış", color: "bg-blue-100 text-blue-700" },
    tamamlandi: { label: "Tamamlandı", color: "bg-green-100 text-green-700" },
    iptal: { label: "İptal", color: "bg-gray-100 text-gray-700" },
    noshow: { label: "Gelmedi", color: "bg-red-100 text-red-700" },
};

// Türkçe gün isimleri
export const DAYS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
export const DAYS_FULL_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

// Türkçe ay isimleri
export const MONTHS_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

// Demo randevular
export const DEMO_APPOINTMENTS: Appointment[] = [
    {
        id: "1",
        title: "Kadıköy 3+1 Gösterimi",
        type: "gosterim",
        status: "planlanmis",
        date: "2026-01-09",
        start_time: "10:00",
        end_time: "11:00",
        customer_id: "1",
        customer_name: "Ahmet Yılmaz",
        customer_phone: "0532 111 22 33",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        location: "Kadıköy, Moda Caddesi No: 45",
        notes: "Müşteri sabah erken saati tercih ediyor",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-07T10:00:00Z",
        updated_at: "2026-01-07T10:00:00Z",
    },
    {
        id: "2",
        title: "Ataşehir Ofis Değerleme",
        type: "degerleme",
        status: "planlanmis",
        date: "2026-01-09",
        start_time: "14:00",
        end_time: "15:30",
        customer_id: "8",
        customer_name: "Deniz Koç",
        customer_phone: "0555 888 99 00",
        property_id: "2",
        property_title: "Merkezi Konumda Satılık Ofis",
        location: "Ataşehir, Atatürk Mahallesi",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-06T14:00:00Z",
        updated_at: "2026-01-06T14:00:00Z",
    },
    {
        id: "3",
        title: "Yatırımcı Toplantısı",
        type: "toplanti",
        status: "planlanmis",
        date: "2026-01-09",
        start_time: "16:00",
        end_time: "17:00",
        customer_id: "4",
        customer_name: "Ayşe Öztürk",
        customer_phone: "0555 444 55 66",
        location: "Ofis",
        notes: "Yatırım portföyü hakkında görüşme",
        reminder_sent: false,
        assigned_to: "demo-user-id",
        created_at: "2026-01-08T09:00:00Z",
        updated_at: "2026-01-08T09:00:00Z",
    },
    {
        id: "4",
        title: "Beşiktaş Villa Gösterimi",
        type: "gosterim",
        status: "planlanmis",
        date: "2026-01-10",
        start_time: "11:00",
        end_time: "12:30",
        customer_id: "4",
        customer_name: "Ayşe Öztürk",
        customer_phone: "0555 444 55 66",
        property_id: "3",
        property_title: "Bahçeli Müstakil Villa",
        location: "Beşiktaş, Etiler",
        reminder_sent: false,
        assigned_to: "demo-user-id",
        created_at: "2026-01-08T10:00:00Z",
        updated_at: "2026-01-08T10:00:00Z",
    },
    {
        id: "5",
        title: "Sözleşme İmza",
        type: "imza",
        status: "planlanmis",
        date: "2026-01-10",
        start_time: "15:00",
        end_time: "16:00",
        customer_id: "6",
        customer_name: "Zeynep Arslan",
        customer_phone: "0544 666 77 88",
        property_id: "1",
        property_title: "Deniz Manzaralı Lüks Daire",
        location: "Noterlik - Kadıköy",
        notes: "Tapu devri için hazırlık",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-05T10:00:00Z",
        updated_at: "2026-01-05T10:00:00Z",
    },
    {
        id: "6",
        title: "Şişli Daire Gösterimi",
        type: "gosterim",
        status: "tamamlandi",
        date: "2026-01-08",
        start_time: "10:00",
        end_time: "11:00",
        customer_id: "3",
        customer_name: "Mehmet Kaya",
        customer_phone: "0544 333 44 55",
        property_id: "4",
        property_title: "Metro Yakını Kiralık Daire",
        location: "Şişli, Mecidiyeköy",
        notes: "Müşteri beğendi, düşünecek",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-06T10:00:00Z",
        updated_at: "2026-01-08T11:30:00Z",
    },
    {
        id: "7",
        title: "Üsküdar Residence Gösterimi",
        type: "gosterim",
        status: "noshow",
        date: "2026-01-07",
        start_time: "14:00",
        end_time: "15:00",
        customer_id: "7",
        customer_name: "Can Yıldız",
        customer_phone: "0533 777 88 99",
        property_id: "6",
        property_title: "Boğaz Manzaralı Residence",
        location: "Üsküdar, Çengelköy",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-04T10:00:00Z",
        updated_at: "2026-01-07T15:00:00Z",
    },
    {
        id: "8",
        title: "Bakırköy Değerleme",
        type: "degerleme",
        status: "tamamlandi",
        date: "2026-01-06",
        start_time: "11:00",
        end_time: "12:30",
        customer_id: "8",
        customer_name: "Deniz Koç",
        customer_phone: "0555 888 99 00",
        property_id: "8",
        property_title: "Deniz Manzaralı Dublex",
        location: "Bakırköy, Ataköy",
        notes: "Değerleme tamamlandı: 6.5M TL",
        reminder_sent: true,
        assigned_to: "demo-user-id",
        created_at: "2026-01-03T10:00:00Z",
        updated_at: "2026-01-06T13:00:00Z",
    },
];

// Tarih yardımcı fonksiyonları
export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function getMonthDays(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Önceki aydan günler
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push(d);
    }

    // Bu ayın günleri
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    // Sonraki aydan günler (6 satır tamamlamak için)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return days;
}

export function getWeekDays(date: Date): Date[] {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
        days.push(new Date(date.getFullYear(), date.getMonth(), diff + i));
    }

    return days;
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}
