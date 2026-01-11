"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Bize Ulaşın
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Sorularınız, önerileriniz veya geri bildirimleriniz için buradayız.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Telefon</h3>
                                        <a href="tel:+902121234567" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                                            +90 212 123 45 67
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">E-posta</h3>
                                        <a href="mailto:destek@opero.tr" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                                            destek@opero.tr
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Adres</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            İstanbul, Türkiye
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Çalışma Saatleri</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Pazartesi - Cuma: 09:00 - 18:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                                {success ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <Check className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            Mesajınız Gönderildi!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            En kısa sürede size dönüş yapacağız.
                                        </p>
                                        <Button onClick={() => setSuccess(false)} variant="outline">
                                            Yeni Mesaj Gönder
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                            Mesaj Gönderin
                                        </h2>
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName">Ad Soyad *</Label>
                                                    <Input
                                                        id="fullName"
                                                        placeholder="Adınız Soyadınız"
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
                                                        placeholder="ornek@email.com"
                                                        value={formData.email}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, email: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Konu *</Label>
                                                <Input
                                                    id="subject"
                                                    placeholder="Mesajınızın konusu"
                                                    value={formData.subject}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, subject: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Mesajınız *</Label>
                                                <textarea
                                                    id="message"
                                                    rows={5}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    placeholder="Mesajınızı buraya yazın..."
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, message: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    "Gönderiliyor..."
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Gönder
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Hızlı cevaplar için:
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/sss"
                            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            SSS
                        </Link>
                        <Link
                            href="/demo"
                            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Demo Talep
                        </Link>
                        <Link
                            href="/fiyatlandirma"
                            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Fiyatlandırma
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
