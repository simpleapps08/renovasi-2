# 🔍 SERVISOO.COM - Troubleshooting Checklist
## Website Masih Blank Setelah Upload Manual

### ⚠️ **MASALAH SAAT INI**
- Website servisoo.com masih menampilkan halaman kosong
- Upload manual sudah dilakukan tapi konten tidak muncul
- Perlu diagnosa lebih mendalam

---

## 🔧 **LANGKAH TROUBLESHOOTING SISTEMATIS**

### **1. VERIFIKASI FILE UPLOAD** ✅
```bash
# Cek via cPanel File Manager atau FTP:
- Pastikan semua file dari folder dist/ sudah terupload ke public_html/
- Verifikasi file index.html ada di root public_html/
- Cek ukuran file index.html (tidak boleh 0 KB)
- Pastikan folder assets/ dan file CSS/JS terupload
```

### **2. CEK BROWSER CONSOLE ERRORS** 🚨
```javascript
// Buka Developer Tools (F12) di browser:
1. Kunjungi servisoo.com
2. Buka tab Console
3. Refresh halaman (Ctrl+F5)
4. Catat semua error messages:
   - 404 errors (file tidak ditemukan)
   - CORS errors
   - JavaScript errors
   - Network errors
```

### **3. TEST AKSES FILE LANGSUNG** 📁
```
# Test akses langsung ke file static:
- https://servisoo.com/index.html
- https://servisoo.com/assets/index-[hash].css
- https://servisoo.com/assets/index-[hash].js
- https://servisoo.com/favicon.ico

# Jika 404 = file tidak terupload dengan benar
# Jika 403 = masalah permission
# Jika 200 tapi blank = masalah JavaScript/environment
```

### **4. VERIFIKASI .HTACCESS** ⚙️
```apache
# Pastikan .htaccess ada di public_html/ dengan content:
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Jika tidak ada, website SPA tidak akan berfungsi
```

### **5. CEK ENVIRONMENT VARIABLES** 🔐
```bash
# Pastikan .env file ada di root directory (bukan public_html)
# Isi .env harus:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Jika .env tidak ada atau salah = koneksi database gagal
```

### **6. VERIFIKASI HOSTING CONFIGURATION** 🌐
```
# Cek di cPanel:
1. PHP Version: Minimal 7.4+ (untuk .htaccess)
2. Apache Modules: mod_rewrite harus aktif
3. File Permissions: 644 untuk files, 755 untuk folders
4. Directory Index: index.html harus di urutan pertama
```

---

## 🚨 **KEMUNGKINAN PENYEBAB UTAMA**

### **A. FILE TIDAK TERUPLOAD DENGAN BENAR**
- **Gejala**: 404 errors di console
- **Solusi**: Re-upload semua file dari folder dist/
- **Verifikasi**: Cek ukuran file dan timestamp

### **B. MASALAH SPA ROUTING**
- **Gejala**: Homepage blank, direct URL 404
- **Solusi**: Upload .htaccess dengan konfigurasi yang benar
- **Verifikasi**: Test https://servisoo.com/admin

### **C. ENVIRONMENT VARIABLES TIDAK TERBACA**
- **Gejala**: JavaScript errors, Supabase connection failed
- **Solusi**: Pastikan .env di lokasi yang benar
- **Verifikasi**: Cek console untuk Supabase errors

### **D. HOSTING TIDAK SUPPORT SPA**
- **Gejala**: .htaccess tidak berfungsi
- **Solusi**: Hubungi hosting support untuk aktifkan mod_rewrite
- **Verifikasi**: Test rewrite rules

### **E. CACHE BROWSER/CDN**
- **Gejala**: Masih menampilkan versi lama
- **Solusi**: Hard refresh (Ctrl+Shift+R)
- **Verifikasi**: Test di browser incognito

---

## 🔄 **LANGKAH PERBAIKAN CEPAT**

### **OPTION 1: RE-UPLOAD COMPLETE**
```bash
1. Hapus semua file di public_html/
2. Extract servisoo-fixed-deploy.zip
3. Upload semua file dari folder dist/ ke public_html/
4. Upload .htaccess ke public_html/
5. Upload .env ke root directory (di luar public_html)
6. Set file permissions: 644
7. Test website
```

### **OPTION 2: MANUAL VERIFICATION**
```bash
1. Cek https://servisoo.com/index.html (harus load)
2. Cek console errors (F12)
3. Cek Network tab untuk failed requests
4. Fix satu per satu berdasarkan error
```

---

## 📞 **JIKA MASIH BERMASALAH**

### **INFORMASI YANG DIBUTUHKAN:**
1. Screenshot console errors (F12)
2. Screenshot cPanel file structure
3. Hasil test akses langsung ke file
4. Hosting provider dan paket yang digunakan
5. Domain DNS settings

### **KONTAK SUPPORT:**
- Hosting support untuk masalah server
- Developer untuk masalah kode
- DNS provider untuk masalah domain

---

## ✅ **CHECKLIST FINAL**
- [ ] File index.html ada di public_html/
- [ ] Folder assets/ terupload lengkap
- [ ] File .htaccess ada dan benar
- [ ] File .env ada di root directory
- [ ] File permissions 644/755
- [ ] Console browser tidak ada errors
- [ ] Test direct file access berhasil
- [ ] SPA routing berfungsi
- [ ] Environment variables terbaca
- [ ] Database connection berhasil

**Jika semua checklist ✅, website harus berfungsi normal!**