# 🚀 PANDUAN DEPLOYMENT SERVISOO KE HOSTING KONVENSIONAL

## 📦 File yang Sudah Siap Deploy

✅ **File ZIP**: `servisoo-production-deploy.zip` (294KB)

## 🎯 Langkah-langkah Upload ke Hostinger

### 1. Login ke Hostinger Control Panel
- Masuk ke [hpanel.hostinger.com](https://hpanel.hostinger.com)
- Pilih domain/hosting yang akan digunakan

### 2. Upload File
- Buka **File Manager** di control panel
- Navigasi ke folder `public_html` (atau folder root domain)
- **Hapus semua file lama** jika ada
- Upload file `servisoo-production-deploy.zip`
- **Extract/Unzip** file tersebut
- Pindahkan semua isi folder hasil extract ke root `public_html`

### 3. Struktur File yang Benar
```
public_html/
├── assets/
│   ├── hero-construction--S05V5pL.jpg
│   ├── index-CJGxD4HO.js
│   └── index-CTvFeBsS.css
├── .env
├── .htaccess
├── favicon.ico
├── index.html
├── logo.svg
├── placeholder.svg
└── robots.txt
```

### 4. Konfigurasi Domain
- Pastikan domain sudah pointing ke hosting
- Tunggu propagasi DNS (maksimal 24 jam)

### 5. Verifikasi Deployment
- Buka website di browser
- Test semua halaman:
  - ✅ Landing page (`/`)
  - ✅ Login/Register (`/auth`)
  - ✅ Dashboard (`/dashboard`)
  - ✅ Simulasi RAB (`/dashboard/simulate`)
  - ✅ Admin panel (`/admin`)

## 🔧 Fitur yang Sudah Dioptimasi

### ✅ Performance
- **Gzip compression** untuk file CSS/JS
- **Cache headers** untuk asset static
- **Minified** CSS dan JavaScript
- **Optimized images**

### ✅ Security
- **Security headers** (XSS Protection, Content-Type, Frame Options)
- **HTTPS redirect** ready
- **Environment variables** protection

### ✅ SEO
- **Meta tags** lengkap
- **Open Graph** tags
- **Twitter Card** tags
- **Robots.txt** configured

### ✅ Mobile Responsive
- **Mobile-first design**
- **Touch-friendly** interface
- **Responsive breakpoints**

## 🎨 Fitur Aplikasi yang Sudah Siap

### 👤 User Features
- ✅ **Registrasi & Login** dengan Supabase Auth
- ✅ **Dashboard** user dengan statistik
- ✅ **Simulasi RAB** dengan auto-fill harga
- ✅ **Breakdown harga** detail (material + upah)
- ✅ **Export PDF** RAB
- ✅ **Histori proyek**
- ✅ **Billing & deposit**
- ✅ **Profile management**

### 🔧 Admin Features
- ✅ **Admin dashboard** dengan analytics
- ✅ **Manajemen RAB** proyek
- ✅ **Manajemen harga material**
- ✅ **Manajemen upah tenaga kerja**
- ✅ **User management**
- ✅ **Gallery management**
- ✅ **Content management**
- ✅ **Deposit billing management**

### 🏗️ RAB Features
- ✅ **Auto-fill harga** dari database material & upah
- ✅ **Sub kategori spesifik** (bata merah, bata ringan, genteng, spandek)
- ✅ **Breakdown detail** material dan upah
- ✅ **Perhitungan otomatis** (subtotal, overhead, profit, PPN)
- ✅ **Export PDF** dengan format profesional

## 🌐 Environment Variables

File `.env` sudah disertakan dengan konfigurasi Supabase:
```
VITE_SUPABASE_PROJECT_ID="tkqvozgorpapofejphyn"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://tkqvozgorpapofejphyn.supabase.co"
```

## 🆘 Troubleshooting

### Jika halaman tidak muncul:
1. Cek file `.htaccess` sudah ada
2. Pastikan mod_rewrite aktif di hosting
3. Cek permission file (755 untuk folder, 644 untuk file)

### Jika routing tidak bekerja:
1. Pastikan `.htaccess` ada di root domain
2. Cek konfigurasi Apache mod_rewrite

### Jika database tidak connect:
1. Cek file `.env` sudah ada
2. Verifikasi Supabase credentials
3. Cek network/firewall hosting

## 📞 Support

Jika ada masalah deployment, cek:
1. **Error logs** di hosting control panel
2. **Browser console** untuk JavaScript errors
3. **Network tab** untuk failed requests

---

🎉 **Aplikasi SERVISOO siap digunakan!**

Total size: ~294KB (sangat ringan dan cepat loading)
Compatible dengan: Hostinger, cPanel, DirectAdmin, dan hosting konvensional lainnya.