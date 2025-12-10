# Panduan Deployment ke Hostinger

## File yang Diperlukan
File `renovasi-hostinger-deploy.zip` berisi semua file yang diperlukan untuk deployment:

### Isi File Zip:
- **dist/** - Folder berisi build production aplikasi React
  - `index.html` - File HTML utama
  - `assets/` - CSS, JS, dan gambar yang sudah dioptimasi
  - `favicon.ico`, `logo.svg`, `placeholder.svg`, `robots.txt`
- **.env** - File environment variables (pastikan sudah dikonfigurasi untuk production)
- **package.json** - Informasi dependencies aplikasi
- **package-lock.json** - Lock file untuk konsistensi dependencies

## Langkah-langkah Deployment ke Hostinger:

### 1. Persiapan Hosting
- Login ke panel Hostinger
- Pastikan sudah memiliki hosting dengan support Node.js atau Static Site
- Akses File Manager atau gunakan FTP

### 2. Upload File
- Extract file `renovasi-hostinger-deploy.zip`
- Upload semua isi folder `dist/` ke folder `public_html/` di hosting
- Upload file `.env` ke root directory (di luar public_html)

### 3. Konfigurasi Environment
- Edit file `.env` sesuai dengan konfigurasi production:
  ```
  VITE_SUPABASE_URL=your_production_supabase_url
  VITE_SUPABASE_ANON_KEY=your_production_supabase_key
  ```

### 4. Konfigurasi Domain
- Pastikan domain sudah mengarah ke folder `public_html/`
- Jika menggunakan subdomain, arahkan ke folder yang sesuai

### 5. Testing
- Akses website melalui domain
- Test semua fitur utama:
  - Landing page
  - Authentication (login/register)
  - Dashboard user
  - Admin panel
  - Responsivitas mobile

## Catatan Penting:

### Database (Supabase)
- Pastikan Supabase project sudah dikonfigurasi untuk production
- Update URL dan API keys di file `.env`
- Verifikasi CORS settings di Supabase untuk domain production

### Performance
- File sudah dioptimasi dengan Vite build
- Gzip compression direkomendasikan di server
- Enable caching untuk static assets

### Security
- Jangan expose file `.env` di public directory
- Pastikan API keys menggunakan environment yang benar
- Enable HTTPS di hosting

### Troubleshooting
- Jika ada error 404 pada routing, pastikan server mendukung SPA routing
- Untuk Hostinger, mungkin perlu file `.htaccess` untuk Apache:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```

## File Size Info:
- **Total size**: ~347KB (sudah terkompresi)
- **Main JS bundle**: ~728KB (sebelum gzip)
- **CSS bundle**: ~77KB
- **Assets**: ~68KB (gambar hero)

## Support
Jika mengalami masalah deployment, periksa:
1. Console browser untuk error JavaScript
2. Network tab untuk failed requests
3. Server logs di Hostinger panel
4. Supabase logs untuk database issues

---
**Generated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Build Version**: Production optimized with Vite
**Mobile Responsive**: ✅ All admin pages optimized