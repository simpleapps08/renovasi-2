# Panduan Perbaikan SSL - Website SERVISOO

## 🔒 Masalah: SSL Aktif di Panel Hostinger tapi Kunci Keamanan Tidak Muncul

### Analisis Masalah
Jika SSL sudah aktif di panel Hostinger tapi kunci keamanan (padlock) tidak muncul di browser, kemungkinan penyebabnya:

1. **Mixed Content Issues** - Website memuat resource HTTP di halaman HTTPS
2. **HTTPS Redirect Tidak Aktif** - Website masih bisa diakses via HTTP
3. **Cache Browser/CDN** - Browser atau CDN masih menyimpan versi HTTP
4. **Resource External** - Ada resource dari domain lain yang tidak HTTPS
5. **Konfigurasi .htaccess** - Tidak ada force HTTPS redirect

---

## 🛠️ Solusi Perbaikan

### 1. Periksa Mixed Content

**Langkah Diagnosis:**
```bash
# Buka Developer Tools di browser (F12)
# Pergi ke tab Console
# Cari error seperti:
# "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'"
```

**Penyebab Umum Mixed Content:**
- Image, CSS, JS yang dimuat via HTTP
- API calls ke endpoint HTTP
- External fonts/libraries via HTTP
- Iframe atau embed content HTTP

### 2. Update .htaccess untuk Force HTTPS

**File: `/public_html/.htaccess`**
```apache
# Force HTTPS Redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force WWW (opsional)
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA Routing untuk React
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content Security Policy (sesuaikan dengan kebutuhan)
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"
```

### 3. Periksa Konfigurasi React App

**File: `vite.config.ts`**
```typescript
// Pastikan base URL menggunakan HTTPS di production
export default defineConfig({
  // ... konfigurasi lain
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
  },
  build: {
    // Pastikan asset menggunakan relative path
    assetsDir: 'assets',
  }
})
```

**File: `src/main.tsx` atau komponen utama**
```typescript
// Pastikan semua API calls menggunakan HTTPS
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.servisoo.com' 
  : 'http://localhost:3000';
```

### 4. Update Meta Tags untuk HTTPS

**File: `index.html`**
```html
<head>
  <!-- Force HTTPS -->
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  
  <!-- Canonical URL dengan HTTPS -->
  <link rel="canonical" href="https://www.servisoo.com/" />
  
  <!-- Open Graph dengan HTTPS -->
  <meta property="og:url" content="https://www.servisoo.com/" />
  <meta property="og:image" content="https://www.servisoo.com/logo.svg" />
</head>
```

### 5. Periksa External Resources

**Pastikan semua resource external menggunakan HTTPS:**
```html
<!-- ❌ SALAH -->
<script src="http://cdn.example.com/library.js"></script>
<link href="http://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

<!-- ✅ BENAR -->
<script src="https://cdn.example.com/library.js"></script>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
```

---

## 🔧 Langkah Implementasi

### Step 1: Update .htaccess
1. Login ke cPanel Hostinger
2. Buka File Manager
3. Navigasi ke `/public_html/`
4. Edit file `.htaccess` atau buat baru
5. Tambahkan konfigurasi force HTTPS di atas

### Step 2: Clear Cache
1. **Browser Cache**: Ctrl+F5 atau Ctrl+Shift+R
2. **Hostinger Cache**: 
   - Login cPanel → Website → Optimize Website
   - Clear All Cache
3. **CDN Cache** (jika menggunakan Cloudflare):
   - Login Cloudflare Dashboard
   - Purge Everything

### Step 3: Test SSL
1. Buka https://www.ssllabs.com/ssltest/
2. Masukkan domain: `servisoo.com`
3. Tunggu hasil analisis
4. Pastikan grade A atau B

### Step 4: Periksa Mixed Content
1. Buka website: `https://www.servisoo.com`
2. Tekan F12 → Console tab
3. Refresh halaman
4. Cari error mixed content
5. Fix semua resource yang masih HTTP

---

## 🚨 Troubleshooting

### Masalah: Redirect Loop
**Solusi:**
```apache
# Tambahkan kondisi ini di .htaccess
RewriteCond %{ENV:HTTPS} !on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Masalah: CSS/JS Tidak Load
**Solusi:**
1. Periksa path asset di `index.html`
2. Pastikan menggunakan relative path
3. Update base href jika perlu

### Masalah: API Calls Gagal
**Solusi:**
```typescript
// Update semua API endpoint ke HTTPS
const apiCall = async () => {
  const response = await fetch('https://api.servisoo.com/endpoint');
  return response.json();
};
```

---

## ✅ Checklist Verifikasi

- [ ] SSL certificate aktif di Hostinger panel
- [ ] .htaccess force HTTPS redirect
- [ ] Semua resource menggunakan HTTPS
- [ ] Meta tag upgrade-insecure-requests
- [ ] Cache browser dan server sudah di-clear
- [ ] Test di SSL Labs mendapat grade A/B
- [ ] Kunci keamanan muncul di browser
- [ ] Tidak ada mixed content warning
- [ ] Website accessible via https://www.servisoo.com

---

## 📞 Bantuan Lebih Lanjut

Jika masalah masih berlanjut:
1. **Hostinger Support**: Live chat di panel cPanel
2. **SSL Test Tools**: 
   - https://www.ssllabs.com/ssltest/
   - https://www.whynopadlock.com/
3. **Mixed Content Checker**: 
   - https://mixed-content-checker.com/

---

*Panduan ini dibuat untuk mengatasi masalah SSL pada website SERVISOO di hosting Hostinger.*