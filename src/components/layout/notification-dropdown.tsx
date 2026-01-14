"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    Notification,
    NOTIFICATION_ICONS,
    NOTIFICATION_COLORS,
    DEMO_NOTIFICATIONS,
    formatNotificationTime,
} from "@/types/notification";

interface NotificationDropdownProps {
    notifications?: Notification[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
}

export function NotificationDropdown({
    notifications: propNotifications,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationDropdownProps) {
    // Demo veya prop'tan gelen bildirimler
    const [notifications, setNotifications] = useState<Notification[]>(
        propNotifications || DEMO_NOTIFICATIONS
    );

    // Okunmamış sayısı
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    // Bildirim okundu olarak işaretle
    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        onMarkAsRead?.(id);
    };

    // Tümünü okundu olarak işaretle
    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        onMarkAllAsRead?.();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                {/* Başlık */}
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-semibold">Bildirimler</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-xs text-blue-600 hover:text-blue-700"
                            onClick={(e) => {
                                e.preventDefault();
                                handleMarkAllAsRead();
                            }}
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Tümünü oku
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Bildirim listesi */}
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Bildiriminiz yok</p>
                        </div>
                    ) : (
                        notifications.slice(0, 10).map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                asChild
                                className={cn(
                                    "flex gap-3 p-3 cursor-pointer",
                                    !notification.is_read && "bg-blue-50/50 dark:bg-blue-900/10"
                                )}
                            >
                                {notification.link ? (
                                    <Link
                                        href={notification.link}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="flex gap-3 w-full"
                                    >
                                        <NotificationContent notification={notification} />
                                    </Link>
                                ) : (
                                    <div
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="flex gap-3 w-full"
                                    >
                                        <NotificationContent notification={notification} />
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                {/* Alt kısım */}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <Settings className="w-4 h-4" />
                        Bildirim Ayarları
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Bildirim içeriği bileşeni
function NotificationContent({ notification }: { notification: Notification }) {
    return (
        <>
            {/* İkon */}
            <div
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg",
                    NOTIFICATION_COLORS[notification.type]
                )}
            >
                {NOTIFICATION_ICONS[notification.type]}
            </div>

            {/* İçerik */}
            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        "text-sm line-clamp-1",
                        !notification.is_read && "font-semibold"
                    )}
                >
                    {notification.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {notification.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatNotificationTime(notification.created_at)}
                </p>
            </div>

            {/* Okunmamış göstergesi */}
            {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
            )}
        </>
    );
}
