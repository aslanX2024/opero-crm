import { createBrowserClient } from '@supabase/ssr';

// Supabase yapılandırma değerleri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase Browser Client - cookie tabanlı session yönetimi
export const supabase = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Tip tanımları - veritabanı şeması
export type UserRole = 'danisman' | 'broker' | 'admin';

// Kullanıcı profil tipi
export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: UserRole;
    xp: number;
    avatar_url?: string;
    workspace_id?: string; // Multi-tenant için workspace bağlantısı
    created_at: string;
    updated_at: string;
}

// Auth hata mesajları - Türkçe
export const AUTH_ERRORS: Record<string, string> = {
    'Invalid login credentials': 'Geçersiz e-posta veya şifre',
    'Email not confirmed': 'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.',
    'User already registered': 'Bu e-posta adresi zaten kayıtlı',
    'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır',
    'Unable to validate email address: invalid format': 'Geçersiz e-posta formatı',
    'Signup requires a valid password': 'Geçerli bir şifre gereklidir',
    'default': 'Bir hata oluştu. Lütfen tekrar deneyin.',
};

// Hata mesajını Türkçeye çevir
export function getAuthErrorMessage(error: string): string {
    return AUTH_ERRORS[error] || AUTH_ERRORS['default'];
}
