# 🚀 SERVISOO - INSTRUKSI DEPLOYMENT HOSTINGER

## ⚠️ PENTING: BACA SEBELUM UPLOAD!

### File yang Harus Digunakan:
**`servisoo-hostinger-404-fix.zip`** (293KB)

---

## 📋 LANGKAH DEPLOYMENT (IKUTI URUTAN INI!)

### 1️⃣ PERSIAPAN
- [ ] Login ke Hostinger Control Panel
- [ ] Pastikan domain sudah pointing ke hosting
- [ ] Backup website lama (jika ada)

### 2️⃣ AKSES FILE MANAGER
- [ ] Klik **"File Manager"** di control panel
- [ ] **JANGAN** pilih "File Manager 2"
- [ ] Pastikan berada di folder **`public_html`**

### 3️⃣ BERSIHKAN FOLDER (WAJIB!)
- [ ] **Pilih SEMUA file** di public_html
- [ ] Klik **"Delete"** untuk hapus semua file lama
- [ ] Pastikan folder public_html **KOSONG TOTAL**

### 4️⃣ UPLOAD FILE ZIP
- [ ] Klik tombol **"Upload"** (ikon panah ke atas)
- [ ] Pilih file **`servisoo-hostinger-404-fix.zip`**
- [ ] Tunggu upload selesai 100%

### 5️⃣ EKSTRAK FILE (KUNCI UTAMA!)
- [ ] **Klik kanan** pada file zip yang sudah ter-upload
- [ ] Pilih **"Extract"** atau **"Extract Here"**
- [ ] **PASTIKAN** file ter-ekstrak di **ROOT public_html**
- [ ] **JANGAN** biarkan file dalam subfolder!

### 6️⃣ VERIFIKASI STRUKTUR
Setelah ekstrak, struktur harus seperti ini:
```
public_html/
├── index.html          ← HARUS ADA DI ROOT
├── .htaccess           ← HARUS ADA DI ROOT  
├── .env                ← HARUS ADA DI ROOT
├── assets/             ← FOLDER ASSETS
│   ├── index-Bz495fMA.js
│   ├── index-CTvFeBsS.css
│   └── hero-construction--S05V5pL.jpg
├── favicon.ico
├── logo.svg
├── placeholder.svg
└── robots.txt
```

### 7️⃣ HAPUS FILE ZIP
- [ ] Hapus file **`servisoo-hostinger-404-fix.zip`** dari public_html
- [ ] File zip tidak diperlukan lagi setelah ekstrak

---

## 🔍 TESTING & VERIFIKASI

### Test 1: Akses File Assets
Buka di browser (ganti dengan domain Anda):
- ✅ `https://www.servisoo.com/assets/index-CTvFeBsS.css`
- ✅ `https://www.servisoo.com/assets/index-Bz495fMA.js`

**Hasil yang Benar:** File CSS/JS ter-download, bukan halaman error

### Test 2: Akses Website
- ✅ Buka `https://www.servisoo.com`
- ✅ Website loading dengan benar
- ✅ Tidak ada error di console browser (F12)

### Test 3: Fungsionalitas
- ✅ Menu navigasi berfungsi
- ✅ Halaman login dapat diakses
- ✅ Simulasi RAB berfungsi
- ✅ Responsive di mobile

---

## 🚨 TROUBLESHOOTING

### Jika Masih Error 404:

#### Problem 1: File di Subfolder
**Gejala:** File ter-ekstrak di `public_html/servisoo-hostinger-404-fix/`
**Solusi:** 
1. Masuk ke subfolder tersebut
2. Pilih SEMUA file
3. Cut (Ctrl+X)
4. Kembali ke public_html
5. Paste (Ctrl+V)
6. Hapus folder kosong

#### Problem 2: Permission Error
**Solusi:**
1. Pilih semua file dan folder
2. Klik kanan → Properties/Permissions
3. Set File: 644, Folder: 755

#### Problem 3: Case Sensitivity
**Solusi:**
1. Pastikan nama file persis sama
2. Cek huruf besar/kecil
3. Re-upload jika perlu

---

## 📞 BANTUAN DARURAT

### Jika Semua Gagal:

#### Opsi 1: Upload Manual
1. Extract zip di komputer lokal
2. Upload file satu per satu via File Manager
3. Buat folder `assets` manual
4. Upload file JS/CSS ke folder assets

#### Opsi 2: FTP Client
1. Download FileZilla
2. Connect ke hosting via FTP
3. Upload semua file ke public_html

#### Opsi 3: Hubungi Support
**Template Pesan untuk Hostinger Support:**
```
Halo, saya mengalami error 404 pada website saya.

Domain: www.servisoo.com
Masalah: File CSS dan JS tidak ditemukan (error 404)
File: /assets/index-CTvFeBsS.css dan /assets/index-Bz495fMA.js

Sudah upload file ke public_html tapi masih error.
Mohon bantuan cek struktur file dan permission.

Terima kasih.
```

---

## ✅ CHECKLIST FINAL

Sebelum menghubungi support, pastikan:
- [ ] File zip ter-upload ke public_html
- [ ] File ter-ekstrak di ROOT public_html (bukan subfolder)
- [ ] File index.html ada di public_html (bukan di subfolder)
- [ ] Folder assets ada dengan 3 file di dalamnya
- [ ] File .htaccess dan .env ada di root
- [ ] Sudah test akses file CSS dan JS
- [ ] Sudah cek console browser untuk error

---

**🎯 INGAT:** Kunci sukses adalah memastikan semua file ter-ekstrak di **ROOT public_html**, bukan di subfolder!

**SERVISOO** - Platform Renovasi Digital Terpercaya