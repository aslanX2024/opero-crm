# Supabase E-posta Şablonları

Bu şablonları **Supabase Dashboard → Authentication → Email Templates** bölümünde kullanın.

---

## 1. Confirm Signup (E-posta Doğrulama)

**Subject:**
```
OPERO - E-posta Adresinizi Doğrulayın
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">OPERO</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Emlak CRM Platformu</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px; font-weight: 600;">Hoş Geldiniz! 👋</h2>
              <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                OPERO'ya kayıt olduğunuz için teşekkür ederiz. Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                      E-postamı Doğrula
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                Bu linkin süresi 24 saat sonra dolacaktır. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                © 2025 OPERO. Tüm hakları saklıdır.<br>
                <a href="https://opero.tr" style="color: #2563eb; text-decoration: none;">opero.tr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Reset Password (Şifre Sıfırlama)

**Subject:**
```
OPERO - Şifrenizi Sıfırlayın
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">OPERO</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Emlak CRM Platformu</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px; font-weight: 600;">Şifre Sıfırlama 🔐</h2>
              <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                Şifrenizi sıfırlamak için bir istek aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                      Şifremi Sıfırla
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                Bu linkin süresi 1 saat sonra dolacaktır. Eğer bu işlemi siz yapmadıysanız, şifrenizi değiştirmenizi öneririz.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                © 2025 OPERO. Tüm hakları saklıdır.<br>
                <a href="https://opero.tr" style="color: #2563eb; text-decoration: none;">opero.tr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Magic Link (Giriş Linki)

**Subject:**
```
OPERO - Giriş Linkiniz
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">OPERO</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Emlak CRM Platformu</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px; font-weight: 600;">Giriş Yapın ✨</h2>
              <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                OPERO hesabınıza giriş yapmak için aşağıdaki butona tıklayın. Bu link tek kullanımlıktır.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                      Giriş Yap
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                Bu linkin süresi 1 saat sonra dolacaktır. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                © 2025 OPERO. Tüm hakları saklıdır.<br>
                <a href="https://opero.tr" style="color: #2563eb; text-decoration: none;">opero.tr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Invite User (Kullanıcı Davet)

**Subject:**
```
OPERO - Ekibe Davet Edildiniz
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">OPERO</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Emlak CRM Platformu</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px; font-weight: 600;">Ekibe Davet Edildiniz! 🎉</h2>
              <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                OPERO platformunda bir ekibe katılmaya davet edildiniz. Daveti kabul etmek ve hesabınızı oluşturmak için aşağıdaki butona tıklayın.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                      Daveti Kabul Et
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                Bu davet linki 7 gün geçerlidir. Sorularınız için yöneticinizle iletişime geçin.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                © 2025 OPERO. Tüm hakları saklıdır.<br>
                <a href="https://opero.tr" style="color: #2563eb; text-decoration: none;">opero.tr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```
