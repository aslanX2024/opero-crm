"use client";

import { useState } from "react";
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    Smartphone,
    Save,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
    const [theme, setTheme] = useState("system");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        newLead: true,
        appointmentReminder: true,
        dealUpdate: true,
        weeklyReport: true,
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Ayarlar</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Hesap ve uygulama ayarlarınızı yönetin
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="w-4 h-4" />
                        Profil
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        Bildirimler
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Görünüm
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Güvenlik
                    </TabsTrigger>
                </TabsList>

                {/* Profil */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Bilgileri</CardTitle>
                            <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarFallback className="text-2xl">DK</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline" size="sm">Fotoğraf Değiştir</Button>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ad</Label>
                                    <Input defaultValue="Demo" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Soyad</Label>
                                    <Input defaultValue="Kullanıcı" />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input defaultValue="demo@emlakcrm.com" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input defaultValue="+90 532 123 4567" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Biyografi</Label>
                                    <Input defaultValue="İstanbul'da 5 yıllık deneyimli emlak danışmanı" />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-blue-600">
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bildirimler */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bildirim Ayarları</CardTitle>
                            <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium">Bildirim Kanalları</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">E-posta Bildirimleri</p>
                                            <p className="text-xs text-gray-500">Önemli güncellemeleri e-posta ile al</p>
                                        </div>
                                        <Switch
                                            checked={notifications.email}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">Push Bildirimleri</p>
                                            <p className="text-xs text-gray-500">Tarayıcı bildirimleri</p>
                                        </div>
                                        <Switch
                                            checked={notifications.push}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, push: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">SMS Bildirimleri</p>
                                            <p className="text-xs text-gray-500">Kritik güncellemeleri SMS ile al</p>
                                        </div>
                                        <Switch
                                            checked={notifications.sms}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium">Bildirim Türleri</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Yeni Lead</p>
                                        <Switch
                                            checked={notifications.newLead}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, newLead: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Randevu Hatırlatması</p>
                                        <Switch
                                            checked={notifications.appointmentReminder}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, appointmentReminder: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Deal Güncellemesi</p>
                                        <Switch
                                            checked={notifications.dealUpdate}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, dealUpdate: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Haftalık Rapor</p>
                                        <Switch
                                            checked={notifications.weeklyReport}
                                            onCheckedChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-blue-600">
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Görünüm */}
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Görünüm Ayarları</CardTitle>
                            <CardDescription>Uygulama görünümünü özelleştirin</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label>Tema</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${theme === "light" ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                                            }`}
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                        <p className="font-medium text-sm">Açık</p>
                                    </div>
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${theme === "dark" ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                                            }`}
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                                        <p className="font-medium text-sm">Koyu</p>
                                    </div>
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${theme === "system" ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                                            }`}
                                        onClick={() => setTheme("system")}
                                    >
                                        <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                                        <p className="font-medium text-sm">Sistem</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Dil</Label>
                                <Select defaultValue="tr">
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                                        <SelectItem value="en">🇬🇧 English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-blue-600">
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Güvenlik */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Güvenlik Ayarları</CardTitle>
                            <CardDescription>Hesap güvenliğinizi yönetin</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium">Şifre Değiştir</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Mevcut Şifre</Label>
                                        <Input type="password" />
                                    </div>
                                    <div></div>
                                    <div className="space-y-2">
                                        <Label>Yeni Şifre</Label>
                                        <Input type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Yeni Şifre (Tekrar)</Label>
                                        <Input type="password" />
                                    </div>
                                </div>
                                <Button variant="outline">Şifreyi Güncelle</Button>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-medium">İki Faktörlü Doğrulama</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm">SMS ile doğrulama</p>
                                        <p className="text-xs text-gray-500">Giriş yaparken SMS kodu iste</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-medium text-red-600">Tehlikeli Bölge</h3>
                                <Button variant="outline" className="text-red-600 border-red-200">
                                    Hesabı Sil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
