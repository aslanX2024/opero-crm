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
    /* Buraya yapılandırma seçenekleri eklenebilir */
};

export default withPWA(nextConfig);
