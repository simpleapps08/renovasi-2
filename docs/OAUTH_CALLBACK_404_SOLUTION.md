# OAuth Callback 404 Error - Solusi Lengkap

## Analisis Masalah

Berdasarkan URL callback yang diterima:
```
https://www.servisoo.com/auth/callback#access_token=...
```

User berhasil melakukan OAuth dengan Google, tetapi mendapat **404: NOT_FOUND** karena:

1. **Redirect URI Mismatch**: Google Console memiliki 3 redirect URIs:
   - `https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback` ✅ (Supabase)
   - `https://servisoo.com/auth/callback` ❌ (Production - tidak ada www)
   - `http://localhost:8080/auth/callback` ✅ (Development)

2. **Production Deployment Issue**: Aplikasi tidak ter-deploy dengan benar di `servisoo.com`

3. **URL Inconsistency**: Google mengarahkan ke `www.servisoo.com` tapi redirect URI di console adalah `servisoo.com`

## Solusi Lengkap

### 1. Update Google Console Redirect URIs

Masuk ke [Google Cloud Console](https://console.cloud.google.com/) dan update Authorized redirect URIs:

```
https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback
https://servisoo.com/auth/callback
https://www.servisoo.com/auth/callback
http://localhost:8080/auth/callback
```

**Penting**: Tambahkan kedua versi (dengan dan tanpa www)

### 2. Verifikasi Deployment Production

Pastikan aplikasi ter-deploy dengan benar:

#### A. Struktur File di Server
```
public_html/
├── index.html
├── assets/
├── .htaccess
└── (semua file dari folder dist/)

ROOT directory/
└── .env
```

#### B. File .htaccess untuk SPA Routing
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### 3. Update Supabase Configuration

Pastikan konfigurasi Supabase mendukung multiple domains:

#### File: supabase/config.toml
```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback"
```

### 4. Environment Variables Production

#### File: .env (di root server)
```env
VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Deployment Steps

#### A. Build Production
```bash
npm run build
```

#### B. Create Deployment Package
```bash
# Buat package dengan semua file yang diperlukan
zip -r servisoo-oauth-fix.zip dist/ .htaccess .env
```

#### C. Upload ke Server
1. Login ke cPanel/File Manager
2. Backup existing files
3. Upload `servisoo-oauth-fix.zip`
4. Extract ke `public_html/`
5. Upload `.env` ke ROOT directory (di luar public_html)
6. Set permissions:
   - Files: 644
   - Directories: 755

### 6. Testing OAuth Flow

#### A. Test URLs
1. `https://servisoo.com` - Harus load aplikasi
2. `https://www.servisoo.com` - Harus redirect atau load aplikasi
3. `https://servisoo.com/auth/callback` - Harus load AuthCallback component

#### B. Test OAuth
1. Buka `https://servisoo.com`
2. Klik "Login dengan Google"
3. Setelah authorize, harus redirect ke `/dashboard`

### 7. Troubleshooting

#### Jika masih 404:
1. **Cek .htaccess**: Pastikan ada dan readable
2. **Cek routing**: Pastikan React Router berfungsi
3. **Cek console**: Lihat error di browser developer tools
4. **Cek server logs**: Lihat error di cPanel Error Logs

#### Jika OAuth gagal:
1. **Cek redirect URIs**: Pastikan semua variant domain ada
2. **Cek Supabase**: Pastikan project aktif
3. **Cek credentials**: Pastikan Client ID/Secret benar

## Checklist Deployment

- [ ] Update Google Console redirect URIs (tambah www variant)
- [ ] Build aplikasi dengan `npm run build`
- [ ] Upload dist/ ke public_html/
- [ ] Upload .htaccess ke public_html/
- [ ] Upload .env ke ROOT directory
- [ ] Set file permissions (644 untuk files, 755 untuk directories)
- [ ] Test https://servisoo.com loads
- [ ] Test https://www.servisoo.com loads
- [ ] Test OAuth flow end-to-end
- [ ] Verify redirect ke /dashboard setelah login

## Expected Result

Setelah implementasi:
1. ✅ OAuth Google berhasil
2. ✅ Redirect ke `https://servisoo.com/auth/callback` berhasil
3. ✅ AuthCallback component memproses token
4. ✅ User redirect ke `/dashboard`
5. ✅ No more 404 errors

## Contact

Jika masih ada masalah, cek:
1. Browser developer console untuk JavaScript errors
2. cPanel Error Logs untuk server errors
3. Supabase Dashboard untuk auth logs