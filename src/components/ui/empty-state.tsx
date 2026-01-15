"use client";

import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                {description}
            </p>
            {(actionLabel && (actionHref || onAction)) && (
                actionHref ? (
                    <Button asChild>
                        <Link href={actionHref}>
                            <Plus className="w-4 h-4 mr-2" />
                            {actionLabel}
                        </Link>
                    </Button>
                ) : (
                    <Button onClick={onAction}>
                        <Plus className="w-4 h-4 mr-2" />
                        {actionLabel}
                    </Button>
                )
            )}
        </div>
    );
}
