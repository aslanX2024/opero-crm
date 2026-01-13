-- Demo Tokens Tablosu
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın

-- Tablo oluştur
CREATE TABLE IF NOT EXISTS demo_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE demo_tokens ENABLE ROW LEVEL SECURITY;

-- Anonim kullanıcılar token oluşturabilir
CREATE POLICY "Allow anonymous insert" ON demo_tokens
    FOR INSERT TO anon WITH CHECK (true);

-- Token doğrulama için select izni
CREATE POLICY "Allow anonymous select" ON demo_tokens
    FOR SELECT TO anon USING (true);

-- Token update izni (used_at güncellemesi için)
CREATE POLICY "Allow anonymous update" ON demo_tokens
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Admin kullanıcı oluşturma
-- ajanssiper@gmail.com kullanıcısını admin yap
-- NOT: Önce kullanıcının kayıtlı olması gerekiyor
-- UPDATE profiles SET role = 'admin' WHERE email = 'ajanssiper@gmail.com';
