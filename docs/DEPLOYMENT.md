# 🚀 OPERO - Production Deployment Guide

## Gereksinimler

- Node.js 18+
- Supabase hesabı
- Vercel/Railway hesabı
- Domain (opero.tr)
- PayTR hesabı (ödeme için)

---

## 1. Supabase Kurulumu

### 1.1 Proje Oluşturma
1. [supabase.com](https://supabase.com) → New Project
2. Region: Frankfurt (eu-central-1)
3. Database password kaydet

### 1.2 Schema Migration
```bash
# Supabase CLI kurulumu
npm install -g supabase

# Login
supabase login

# Projeyi bağla
supabase link --project-ref YOUR_PROJECT_REF

# Migration'ları çalıştır
supabase db push
```

### 1.3 Environment Variables
Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (backend için)

---

## 2. Auth Yapılandırması

### 2.1 Email Templates
Supabase Dashboard → Auth → Email Templates

**Confirmation Email (Türkçe):**
```html
<h2>E-posta Doğrulama</h2>
<p>Hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
<a href="{{ .ConfirmationURL }}">Hesabımı Doğrula</a>
```

### 2.2 Redirect URLs
Auth → URL Configuration:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`

---

## 3. Vercel Deployment

### 3.1 Import Project
1. [vercel.com](https://vercel.com) → Import Git Repository
2. Framework: Next.js (otomatik algılanır)

### 3.2 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3.3 Domain
Vercel → Project → Settings → Domains → Add domain

---

## 4. Ödeme Entegrasyonu (PayTR)

### 4.1 PayTR Kurulum
1. [paytr.com](https://www.paytr.com) → Üye Ol
2. Mağaza ID ve API bilgilerini al

### 4.2 Environment Variables
```
PAYTR_MERCHANT_ID=xxx
PAYTR_MERCHANT_KEY=xxx
PAYTR_MERCHANT_SALT=xxx
```

### 4.3 Callback URL
PayTR Panel → Ayarlar → Callback URL:
- `https://opero.tr/api/webhooks/paytr`

---

## 5. Monitoring

### 5.1 Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 5.2 Uptime
- [UptimeRobot](https://uptimerobot.com) veya [Better Uptime](https://betteruptime.com)
- Monitor: `https://yourdomain.com/api/health`

---

## 6. Email (Transactional)

### 6.1 Resend
```bash
npm install resend
```

**Environment:**
```
RESEND_API_KEY=re_...
```

---

## 7. Checklist

- [ ] Supabase production projesi
- [ ] RLS politikaları aktif
- [ ] Auth email templates
- [ ] Vercel deployment
- [ ] Custom domain + SSL (opero.tr)
- [ ] Environment variables
- [ ] PayTR webhook
- [ ] Sentry error tracking
- [ ] Uptime monitoring
- [ ] Backup schedule (Supabase Pro)
- [ ] Rate limiting

