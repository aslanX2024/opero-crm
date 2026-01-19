import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Korumalı rotalar - giriş gerektirenler
const protectedRoutes = ["/dashboard", "/broker"];

// Herkese açık auth rotaları
const authRoutes = ["/login", "/register", "/forgot-password"];

// Middleware fonksiyonu - tüm isteklerde çalışır
export async function middleware(request: NextRequest) {
    // Env vars yoksa middleware'ı atla
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next();
    }

    // Response oluştur
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Güvenlik Header'ları Ekle
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );

    // Supabase server client oluştur
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    // Cookie'yi hem request hem response'a ekle
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    // Headerları tekrar set et (response yeniden oluşturulduğu için)
                    response.headers.set("X-Frame-Options", "DENY");
                    response.headers.set("X-Content-Type-Options", "nosniff");
                    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.headers.set(
                        "Permissions-Policy",
                        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
                    );
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    // Cookie'yi sil
                    request.cookies.set({ name, value: "", ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                     // Headerları tekrar set et
                    response.headers.set("X-Frame-Options", "DENY");
                    response.headers.set("X-Content-Type-Options", "nosniff");
                    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.headers.set(
                        "Permissions-Policy",
                        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
                    );
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    // Oturumu kontrol et (Güvenlik: getSession yerine getUser kullan)
    // getUser veritabanına sorgu atarak token'ın hala geçerli olduğunu doğrular
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Korumalı rotalara erişim kontrolü
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Giriş yapmamış kullanıcı korumalı sayfaya erişmeye çalışıyor
    if (isProtectedRoute && !user) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Giriş yapmış kullanıcı auth sayfalarına erişmeye çalışıyor
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

// Middleware'in çalışacağı yollar
export const config = {
    matcher: [
        /*
         * Şu yollar hariç tüm isteklerde çalış:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
