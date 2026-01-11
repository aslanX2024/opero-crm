import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

// Inter fontu - modern ve okunabilir
const inter = Inter({ subsets: ["latin"] });

// PWA Viewport ayarları
export const viewport: Viewport = {
    themeColor: "#2563eb",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

// Sayfa meta bilgileri + PWA
export const metadata: Metadata = {
    title: "OPERO - Gayrimenkul Yönetim Sistemi",
    description: "Modern emlak danışmanları için gelişmiş CRM çözümü",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "OPERO",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    other: {
        "mobile-web-app-capable": "yes",
    },
};

// Ana layout bileşeni - tüm sayfaları sarar
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <head>
                {/* iOS için ek meta tagları */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="OPERO" />
                <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

                {/* Microsoft için */}
                <meta name="msapplication-TileColor" content="#2563eb" />
                <meta name="msapplication-tap-highlight" content="no" />
            </head>
            <body className={inter.className}>
                {/* Providers: React Query, Auth Context vb. */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
