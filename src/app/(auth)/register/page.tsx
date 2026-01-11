"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, SignUpData } from "@/context/auth-context";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Kayıt sayfası
export default function RegisterPage() {
    const { signUp } = useAuth();

    // Form state
    const [formData, setFormData] = useState<SignUpData>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "danisman", // Varsayılan rol: Danışman
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Input değişikliği
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Rol değişikliği
    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value as "danisman" | "broker" }));
    };

    // Form doğrulama
    const validateForm = (): string | null => {
        if (!formData.fullName.trim()) {
            return "Ad soyad gereklidir";
        }
        if (!formData.email.trim()) {
            return "E-posta adresi gereklidir";
        }
        if (!formData.phone.trim()) {
            return "Telefon numarası gereklidir";
        }
        if (formData.password.length < 6) {
            return "Şifre en az 6 karakter olmalıdır";
        }
        if (formData.password !== confirmPassword) {
            return "Şifreler eşleşmiyor";
        }
        return null;
    };

    // Form gönder
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Form doğrulama
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const result = await signUp(formData);

            if (result.error) {
                setError(result.error);
            } else {
                // Başarılı kayıt - email doğrulama mesajı göster
                setSuccess(true);
            }
        } catch (err) {
            setError("Beklenmeyen bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    // Başarılı kayıt mesajı
    if (success) {
        return (
            <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <span className="text-4xl">✉️</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Kayıt Başarılı!
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        E-posta adresinize bir doğrulama linki gönderdik.
                        <br />
                        Lütfen e-postanızı kontrol edin ve hesabınızı doğrulayın.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Link href="/login">
                        <Button variant="outline">Giriş Sayfasına Dön</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🏠</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
                <CardDescription>
                    Yeni bir Emlak CRM hesabı oluşturun
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {/* Hata mesajı */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Ad Soyad */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Ad Soyad</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Ahmet Yılmaz"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ornek@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Telefon */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="0532 123 45 67"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Rol Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={formData.role}
                            onValueChange={handleRoleChange}
                            disabled={loading}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Rol seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="danisman">Emlak Danışmanı</SelectItem>
                                <SelectItem value="broker">Broker / Yönetici</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.role === "broker"
                                ? "Broker olarak ekip yönetimi ve raporlama özelliklerine erişebilirsiniz."
                                : "Danışman olarak portföy ve müşteri yönetimi yapabilirsiniz."}
                        </p>
                    </div>

                    {/* Şifre */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Şifre Tekrar */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {/* Kayıt butonu */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Kayıt yapılıyor...
                            </span>
                        ) : (
                            "Kayıt Ol"
                        )}
                    </Button>

                    {/* Giriş linki */}
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Zaten hesabınız var mı?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                        >
                            Giriş yapın
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
