"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Building2,
    ArrowLeft,
    Save,
    Phone,
    Video,
    Home,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useEmail } from "@/hooks/use-email";
import { Checkbox } from "@/components/ui/checkbox";

// Demo müşteriler
const DEMO_CUSTOMERS = [
    { id: "1", name: "Ahmet Yılmaz", phone: "+90 532 111 2233", email: "ahmet.yilmaz@ornek.com" },
    { id: "2", name: "Ayşe Demir", phone: "+90 533 444 5566", email: "ayse.demir@ornek.com" },
    { id: "3", name: "Mehmet Kaya", phone: "+90 534 777 8899", email: "mehmet.kaya@ornek.com" },
    { id: "4", name: "Fatma Şahin", phone: "+90 535 000 1122", email: "fatma.sahin@ornek.com" },
];

// Demo mülkler
const DEMO_PROPERTIES = [
    { id: "prop-1", title: "Kadıköy'de 3+1 Daire" },
    { id: "prop-2", title: "Beşiktaş'ta Deniz Manzaralı Daire" },
    { id: "prop-3", title: "Üsküdar'da Villa" },
    { id: "prop-4", title: "Şişli'de Stüdyo Daire" },
];

// Randevu tipleri
const APPOINTMENT_TYPES = [
    { value: "gosterim", label: "Mülk Gösterimi", icon: Home },
    { value: "toplanti", label: "Toplantı", icon: User },
    { value: "telefon", label: "Telefon Görüşmesi", icon: Phone },
    { value: "video", label: "Video Görüşme", icon: Video },
    { value: "sozlesme", label: "Sözleşme", icon: FileText },
];

export default function NewAppointmentPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        type: "",
        customerId: "",
        propertyId: "",
        date: "",
        time: "",
        duration: "60",
        location: "",
        notes: "",
        sendEmail: true,
    });

    const { sendAppointmentConfirmation } = useEmail();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.type || !form.customerId || !form.date || !form.time) {
            alert("Lütfen zorunlu alanları doldurun");
            return;
        }

        setSaving(true);

        // Simüle kayıt
        await new Promise((r) => setTimeout(r, 1000));

        // Email gönderimi
        if (form.sendEmail) {
            const customer = DEMO_CUSTOMERS.find(c => c.id === form.customerId);
            const property = DEMO_PROPERTIES.find(p => p.id === form.propertyId);
            const type = APPOINTMENT_TYPES.find(t => t.value === form.type);

            if (customer && customer.email) {
                await sendAppointmentConfirmation(customer.email, {
                    title: type?.label || "Randevu",
                    date: form.date,
                    time: form.time,
                    duration: form.duration,
                    location: form.location,
                    customerName: customer.name,
                    propertyTitle: property?.title,
                });
            }
        }

        alert("Randevu oluşturuldu! +15 XP kazandınız! 🎉");
        router.push("/dashboard/appointments");
    };

    const selectedType = APPOINTMENT_TYPES.find((t) => t.value === form.type);
    const selectedCustomer = DEMO_CUSTOMERS.find((c) => c.id === form.customerId);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Başlık */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/appointments">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Yeni Randevu</h1>
                    <p className="text-gray-500">Randevu oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Randevu Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Randevu Tipi */}
                        <div className="space-y-2">
                            <Label>Randevu Tipi *</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {APPOINTMENT_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <div
                                            key={type.value}
                                            className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${form.type === type.value
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "hover:border-gray-400"
                                                }`}
                                            onClick={() => setForm({ ...form, type: type.value })}
                                        >
                                            <Icon className="w-6 h-6 mx-auto mb-1" />
                                            <p className="text-xs font-medium">{type.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Müşteri Seçimi */}
                        <div className="space-y-2">
                            <Label>Müşteri *</Label>
                            <Select
                                value={form.customerId}
                                onValueChange={(v) => setForm({ ...form, customerId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Müşteri seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEMO_CUSTOMERS.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                {customer.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedCustomer && (
                                <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                            )}
                        </div>

                        {/* Mülk Seçimi (Gösterim için) */}
                        {form.type === "gosterim" && (
                            <div className="space-y-2">
                                <Label>Gösterilecek Mülk</Label>
                                <Select
                                    value={form.propertyId}
                                    onValueChange={(v) => setForm({ ...form, propertyId: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mülk seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEMO_PROPERTIES.map((property) => (
                                            <SelectItem key={property.id} value={property.id}>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    {property.title}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Tarih ve Saat */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tarih *</Label>
                                <Input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Saat *</Label>
                                <Input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Süre */}
                        <div className="space-y-2">
                            <Label>Süre</Label>
                            <Select
                                value={form.duration}
                                onValueChange={(v) => setForm({ ...form, duration: v })}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 dk</SelectItem>
                                    <SelectItem value="30">30 dk</SelectItem>
                                    <SelectItem value="45">45 dk</SelectItem>
                                    <SelectItem value="60">1 saat</SelectItem>
                                    <SelectItem value="90">1.5 saat</SelectItem>
                                    <SelectItem value="120">2 saat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Konum */}
                        {(form.type === "gosterim" || form.type === "toplanti") && (
                            <div className="space-y-2">
                                <Label>Konum / Adres</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        className="pl-10"
                                        placeholder="Buluşma yeri..."
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Notlar */}
                        <div className="space-y-2">
                            <Label>Notlar</Label>
                            <Textarea
                                placeholder="Ek notlar..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Email Bildirimi */}
                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-gray-50 dark:bg-gray-900/10">
                            <Checkbox
                                id="sendEmail"
                                checked={form.sendEmail}
                                onCheckedChange={(checked) => setForm({ ...form, sendEmail: checked as boolean })}
                            />
                            <Label htmlFor="sendEmail" className="cursor-pointer font-normal text-sm">
                                Müşteriye randevu detaylarını içeren <strong>bilgilendirme e-postası</strong> gönder
                            </Label>
                        </div>

                        {/* Butonlar */}
                        <div className="flex gap-3 pt-4">
                            <Link href="/dashboard/appointments" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    İptal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Randevu Oluştur
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
