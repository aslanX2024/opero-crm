"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Check, Calendar, Phone, Mail, Building2 } from "lucide-react";
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

export default function DemoPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        teamSize: "",
        preferredTime: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Talebiniz Alındı!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Ekibimiz en kısa sürede sizinle iletişime geçecek. Genellikle 24 saat içinde dönüş yapıyoruz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium"
                        >
                            Ana Sayfaya Dön
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                        >
                            Hemen Ücretsiz Dene
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Canlı Demo ile{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            OPERO&apos;yu Keşfedin
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Uzman ekibimiz size özel bir demo sunumuyla OPERO&apos;nun
                        işletmenize nasıl fayda sağlayacağını göstersin.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Demo Talep Formu
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Ad Soyad *</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Ahmet Yılmaz"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-posta *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="ahmet@sirket.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefon *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="0532 123 45 67"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Şirket / Ofis Adı</Label>
                                        <Input
                                            id="company"
                                            placeholder="Yılmaz Emlak"
                                            value={formData.company}
                                            onChange={(e) =>
                                                setFormData({ ...formData, company: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="teamSize">Ekip Büyüklüğü</Label>
                                        <Select
                                            value={formData.teamSize}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, teamSize: value })
                                            }
                                        >
                                            <SelectTrigger id="teamSize">
                                                <SelectValue placeholder="Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Sadece ben</SelectItem>
                                                <SelectItem value="2-5">2-5 kişi</SelectItem>
                                                <SelectItem value="6-10">6-10 kişi</SelectItem>
                                                <SelectItem value="11-25">11-25 kişi</SelectItem>
                                                <SelectItem value="25+">25+ kişi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="preferredTime">Tercih Edilen Zaman</Label>
                                        <Select
                                            value={formData.preferredTime}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, preferredTime: value })
                                            }
                                        >
                                            <SelectTrigger id="preferredTime">
                                                <SelectValue placeholder="Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="morning">Sabah (09:00-12:00)</SelectItem>
                                                <SelectItem value="afternoon">Öğleden Sonra (12:00-17:00)</SelectItem>
                                                <SelectItem value="evening">Akşam (17:00-19:00)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Eklemek İstedikleriniz</Label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Özel sorularınız veya ihtiyaçlarınız..."
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    disabled={loading}
                                >
                                    {loading ? "Gönderiliyor..." : "Demo Talep Et"}
                                </Button>

                                <p className="text-sm text-center text-gray-500">
                                    Bilgileriniz gizli tutulur ve 3. taraflarla paylaşılmaz.
                                </p>
                            </form>
                        </div>

                        {/* Side Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Demo&apos;da Neler Göreceksiniz?
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "Portföy ve müşteri yönetimi",
                                        "Satış pipeline ve kanban görünümü",
                                        "Komisyon hesaplama ve takibi",
                                        "Ekip yönetimi (Ofis planı)",
                                        "Raporlar ve analytics",
                                        "Mobil uygulama deneyimi",
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Hızlı İletişim
                                </h3>
                                <div className="space-y-4">
                                    <a
                                        href="tel:+902121234567"
                                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                    >
                                        <Phone className="w-5 h-5" />
                                        +90 212 123 45 67
                                    </a>
                                    <a
                                        href="mailto:demo@opero.tr"
                                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                    >
                                        <Mail className="w-5 h-5" />
                                        demo@opero.tr
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Demo Süresi: ~30 dakika
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Zoom veya Google Meet üzerinden online demo yapılır.
                                    İhtiyaçlarınıza göre özelleştirilmiş sunum hazırlanır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
