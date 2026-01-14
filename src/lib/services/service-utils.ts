/**
 * Service Layer Error Handling Utilities
 * Tüm servis fonksiyonlarında tutarlı hata yönetimi sağlar
 */

import { PostgrestError } from "@supabase/supabase-js";

// Servis sonuç tipi - başarılı veya hatalı
export type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string };

// Supabase hata mesajlarını Türkçeye çevir
const ERROR_MESSAGES: Record<string, string> = {
    // Supabase/PostgreSQL hataları
    "23505": "Bu kayıt zaten mevcut",
    "23503": "İlişkili kayıt bulunamadı",
    "42501": "Bu işlem için yetkiniz yok",
    "PGRST301": "Kayıt bulunamadı",
    "PGRST116": "Birden fazla kayıt bulundu",
    // Genel hatalar
    "FetchError": "Bağlantı hatası. İnternet bağlantınızı kontrol edin.",
    "AuthError": "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
    "default": "Bir hata oluştu. Lütfen tekrar deneyin.",
};

// Supabase hatasını kullanıcı dostu mesaja çevir
export function getServiceErrorMessage(error: PostgrestError | Error | unknown): string {
    if (!error) return ERROR_MESSAGES.default;

    // PostgrestError (Supabase)
    if (typeof error === "object" && "code" in error) {
        const pgError = error as PostgrestError;
        return ERROR_MESSAGES[pgError.code] || pgError.message || ERROR_MESSAGES.default;
    }

    // Standard Error
    if (error instanceof Error) {
        // Bağlantı hataları
        if (error.message.includes("fetch") || error.message.includes("network")) {
            return ERROR_MESSAGES.FetchError;
        }
        return error.message;
    }

    return ERROR_MESSAGES.default;
}

// Başarılı sonuç oluştur
export function success<T>(data: T): ServiceResult<T> {
    return { success: true, data };
}

// Hatalı sonuç oluştur
export function failure(error: string, code?: string): ServiceResult<never> {
    return { success: false, error, code };
}

// Supabase sorgu sonucunu ServiceResult'a çevir
export function handleQueryResult<T>(
    data: T | null,
    error: PostgrestError | null,
    notFoundMessage?: string
): ServiceResult<T> {
    if (error) {
        return failure(getServiceErrorMessage(error), error.code);
    }

    if (data === null || (Array.isArray(data) && data.length === 0 && notFoundMessage)) {
        return failure(notFoundMessage || "Kayıt bulunamadı", "NOT_FOUND");
    }

    return success(data as T);
}

// Async fonksiyon wrapper - hataları yakalar ve ServiceResult döner
export async function wrapAsync<T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string
): Promise<ServiceResult<T>> {
    try {
        const data = await asyncFn();
        return success(data);
    } catch (error) {
        console.error("Service error:", error);
        return failure(errorMessage || getServiceErrorMessage(error));
    }
}
