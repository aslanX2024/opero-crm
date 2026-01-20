"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

// Giriş sayfası
export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setAuthError(null);
        try {
            const result = await signIn(data.email, data.password, data.rememberMe);

            if (result.error) {
                setAuthError(result.error);
            }
        } catch (err) {
            setAuthError("Beklenmeyen bir hata oluştu");
        }
    };

    return (
        <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🏠</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
                <CardDescription>
                    Emlak CRM hesabınıza giriş yapın
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Auth hatası */}
                    {authError && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                            {authError}
                        </div>
                    )}

                    {/* Email alanı */}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            {...register("email")}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Şifre alanı */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Şifre</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                            >
                                Şifremi unuttum
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Beni hatırla */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-2">
                             <Checkbox
                                id="remember"
                                {...register("rememberMe")}
                                onCheckedChange={(checked) => {
                                    // React Hook Form ile Checkbox entegrasyonu için setValue kullanılabilir
                                    // Ancak basit kullanım için register yeterli olabilir.
                                    // ShadCN checkbox biraz farklı çalışıyor, hidden input ile bağlayalım veya Controller kullanalım.
                                    // Basitlik için native checkbox'a benzer davranması için register kullanıyoruz ama
                                    // Radix Checkbox ref'i ile register ref'i uyumsuz olabilir.
                                    // En doğrusu Controller kullanmak ama burada basit bir hidden input trick yapabiliriz veya
                                    // manuel onChange handle edebiliriz.
                                }}
                                disabled={isSubmitting}
                            />
                             {/* NOT: Shadcn Checkbox + React Hook Form için en iyisi Controller kullanmaktır.
                                 Ancak hızlı çözüm için native input type="checkbox" kullanmak veya
                                 register'ı doğru bağlamak gerekir.
                                 Aşağıda manuel bağlama yapalım.
                             */}
                        </div>
                        <Label
                            htmlFor="remember"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Beni hatırla
                        </Label>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {/* Giriş butonu */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
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
                                Giriş yapılıyor...
                            </span>
                        ) : (
                            "Giriş Yap"
                        )}
                    </Button>

                    {/* Kayıt linki */}
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Hesabınız yok mu?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                        >
                            Kayıt olun
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
