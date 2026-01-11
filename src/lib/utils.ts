import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui için className birleştirme yardımcı fonksiyonu
// clsx ve tailwind-merge kullanarak class çakışmalarını çözer
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
