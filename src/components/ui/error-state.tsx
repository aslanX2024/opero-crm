"use client";

import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showBackButton?: boolean;
    backHref?: string;
}

export function ErrorState({
    title = "Bir hata oluştu",
    message = "Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.",
    onRetry,
    showBackButton = false,
    backHref = "/dashboard",
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                {message}
            </p>
            <div className="flex gap-3">
                {showBackButton && (
                    <Button variant="outline" asChild>
                        <Link href={backHref}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>
                )}
                {onRetry && (
                    <Button onClick={onRetry}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tekrar Dene
                    </Button>
                )}
            </div>
        </div>
    );
}

// Loading Timeout bileşeni
interface LoadingWithTimeoutProps {
    isLoading: boolean;
    timeout?: number; // ms
    onTimeout?: () => void;
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
}

export function LoadingWithTimeout({
    isLoading,
    timeout = 15000,
    onTimeout,
    children,
    loadingComponent,
}: LoadingWithTimeoutProps) {
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setTimedOut(false);
            return;
        }

        const timer = setTimeout(() => {
            if (isLoading) {
                setTimedOut(true);
                onTimeout?.();
            }
        }, timeout);

        return () => clearTimeout(timer);
    }, [isLoading, timeout, onTimeout]);

    if (timedOut) {
        return (
            <ErrorState
                title="Yükleme zaman aşımına uğradı"
                message="Veriler yüklenirken zaman aşımına uğradı. İnternet bağlantınızı kontrol edip tekrar deneyin."
                onRetry={() => {
                    setTimedOut(false);
                    onTimeout?.();
                }}
            />
        );
    }

    if (isLoading) {
        return loadingComponent || (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
