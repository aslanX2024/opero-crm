/**
 * Demo Token Sistemi
 * Demo talep edenlere sınırlı süreli erişim linki oluşturur
 */

import { supabase } from "./supabase";

// Token geçerlilik süresi (saat)
export const DEMO_TOKEN_EXPIRY_HOURS = 48;

// Demo Token tipi
export interface DemoToken {
    id: string;
    token: string;
    email: string;
    full_name?: string;
    company?: string;
    phone?: string;
    created_at: string;
    expires_at: string;
    used_at?: string;
}

// Rastgele token oluştur
function generateRandomToken(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Yeni demo token oluştur
export async function createDemoToken(data: {
    email: string;
    full_name?: string;
    company?: string;
    phone?: string;
}): Promise<{ token: string; expires_at: string } | { error: string }> {
    const token = generateRandomToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + DEMO_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    try {
        const { error } = await supabase.from("demo_tokens").insert({
            token,
            email: data.email,
            full_name: data.full_name,
            company: data.company,
            phone: data.phone,
            expires_at: expiresAt.toISOString(),
        });

        if (error) {
            console.error("Demo token oluşturma hatası:", error);
            return { error: "Token oluşturulamadı" };
        }

        return { token, expires_at: expiresAt.toISOString() };
    } catch (err) {
        console.error("Demo token hatası:", err);
        return { error: "Beklenmeyen bir hata oluştu" };
    }
}

// Token doğrula
export async function validateDemoToken(token: string): Promise<{
    valid: boolean;
    expired?: boolean;
    data?: DemoToken;
    error?: string;
}> {
    if (!token || token.length < 10) {
        return { valid: false, error: "Geçersiz token formatı" };
    }

    try {
        const { data, error } = await supabase
            .from("demo_tokens")
            .select("*")
            .eq("token", token)
            .single();

        if (error || !data) {
            return { valid: false, error: "Token bulunamadı" };
        }

        const now = new Date();
        const expiresAt = new Date(data.expires_at);

        if (now > expiresAt) {
            return { valid: false, expired: true, error: "Token süresi dolmuş" };
        }

        return { valid: true, data: data as DemoToken };
    } catch (err) {
        console.error("Token doğrulama hatası:", err);
        return { valid: false, error: "Doğrulama hatası" };
    }
}

// Token'ı kullanıldı olarak işaretle
export async function markTokenAsUsed(token: string): Promise<void> {
    try {
        await supabase
            .from("demo_tokens")
            .update({ used_at: new Date().toISOString() })
            .eq("token", token);
    } catch (err) {
        console.error("Token güncelleme hatası:", err);
    }
}

// Demo dashboard URL'i oluştur
export function getDemoUrl(token: string): string {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/demo-dashboard?token=${token}`;
}
