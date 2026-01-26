import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// PWA yapılandırması
const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

// Next.js yapılandırması
const nextConfig: NextConfig = {
    // Görsel Optimizasyonu
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co', // Supabase Storage
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com', // Demo görselleri için
            }
        ],
        minimumCacheTTL: 60,
    },
    // Derleyici Seçenekleri
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    // Deneysel Özellikler
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            'recharts'
        ],
    },
};

export default withPWA(nextConfig);
