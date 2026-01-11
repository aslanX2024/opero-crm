"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // PWA zaten kurulu mu kontrol et
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
            return;
        }

        // Install prompt eventini yakala
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // 5 saniye sonra prompt göster
            setTimeout(() => {
                setShowPrompt(true);
            }, 5000);
        };

        // Uygulama kurulduğunda
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // 1 gün sonra tekrar göster
        localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
    };

    // Kurulu veya prompt hazır değilse gösterme
    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96">
            <Card className="shadow-xl border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">OPERO'yu Yükleyin</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Uygulamamızı ana ekranınıza ekleyerek hızlı erişim sağlayın
                            </p>
                            <div className="flex gap-2 mt-3">
                                <Button
                                    size="sm"
                                    onClick={handleInstall}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Yükle
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleDismiss}
                                >
                                    Daha Sonra
                                </Button>
                            </div>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={handleDismiss}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// iOS için özel prompt (Safari'de beforeinstallprompt desteklenmiyor)
export function IOSInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;
        const dismissed = localStorage.getItem("ios-prompt-dismissed");

        if (isIOS && !isInStandaloneMode && !dismissed) {
            setTimeout(() => setShowPrompt(true), 5000);
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("ios-prompt-dismissed", "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50">
            <Card className="shadow-xl border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">Ana Ekrana Ekleyin</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Safari'de paylaş <span className="inline-block">
                                    <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                    </svg>
                                </span> butonuna, ardından "Ana Ekrana Ekle" seçeneğine tıklayın
                            </p>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleDismiss}
                                className="mt-2"
                            >
                                Anladım
                            </Button>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={handleDismiss}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
