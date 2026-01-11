"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Şifremi unuttum sayfası
export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();

    // State
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form gönder
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await resetPassword(email);

            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Beklenmeyen bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    // Başarılı gönderim
    if (success) {
        return (
            <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📧</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">E-posta Gönderildi</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Şifre sıfırlama linki e-posta adresinize gönderildi.
                        <br />
                        Lütfen e-postanızı kontrol edin.
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
                {/* İkon */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🔑</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Şifremi Unuttum</CardTitle>
                <CardDescription>
                    E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {/* Gönder butonu */}
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
                                Gönderiliyor...
                            </span>
                        ) : (
                            "Şifre Sıfırlama Linki Gönder"
                        )}
                    </Button>

                    {/* Giriş linki */}
                    <Link
                        href="/login"
                        className="text-sm text-center text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                        ← Giriş sayfasına dön
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
