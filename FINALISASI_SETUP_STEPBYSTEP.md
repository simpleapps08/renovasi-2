# 📋 Panduan Finalisasi Email Expiry - Step by Step

## 🎯 Tujuan Akhir
Mengatur password reset email link agar **berlaku 1 jam (3600 detik)** di Supabase.

---

## ✅ METODE A: Dashboard Supabase (PALING MUDAH - 2 MENIT)

### Langkah 1: Buka Supabase Dashboard
```
1. Buka browser (Chrome, Firefox, Edge, dll)
2. Kunjungi: https://app.supabase.com
3. Login dengan akun Supabase Anda
```

**Harapan:** Anda akan melihat halaman dashboard dengan daftar project.

---

### Langkah 2: Pilih Project
```
1. Cari project: "tkqvozgorpapofejphyn"
   atau
   Cari: "renovasi-servisoo"

2. Klik project tersebut
```

**Harapan:** Masuk ke dalam project dashboard.

---

### Langkah 3: Navigasi ke Email Configuration
```
1. Dari sidebar kiri, cari: "Authentication"
   (biasanya ada di bagian tengah sidebar)

2. Klik "Authentication"

3. Dari menu yang muncul, klik "Providers"

4. Di halaman providers, cari dan klik "Email"
```

**Harapan:** Anda akan melihat pengaturan Email Provider dengan berbagai opsi.

---

### Langkah 4: Cari Setting Token Expiry
Cari salah satu dari setting berikut di halaman Email:

| Setting Name | Deskripsi |
|------|-----------|
| `password_recovery_token_expires_in` | Token reset password |
| `password_reset_token_expires_in` | Token reset password |
| `email_otp_expiry` | Expiry email OTP |
| Email token expiry | Setting umum |

**Jika tidak menemukan:**
- Scroll ke bawah halaman
- Cari field dengan label "expiry" atau "expires"
- Atau cari "3600" jika sudah ada setting

---

### Langkah 5: Update Nilai ke 3600
```
1. Cari field token expiry
   Current value: Mungkin 900 atau 600 atau lebih kecil

2. Hapus nilai lama

3. Ketik: 3600
   (3600 = 1 jam = 60 menit = 3600 detik)

4. Klik tombol: "Save" atau "Update" atau "Apply"

5. Tunggu konfirmasi (biasanya 2-5 detik)
```

**Harapan:** Akan muncul pesan "Saved successfully" atau "Updated"

---

### Langkah 6: Verifikasi Perubahan
```
1. Refresh halaman (tekan F5)
2. Masuk kembali ke Authentication > Providers > Email
3. Verifikasi bahwa field menampilkan: 3600
```

**Selesai! ✅**

---

## 📋 METODE B: Query SQL (Jika Dashboard Tidak Bekerja)

### Langkah 1: Buka SQL Editor
```
1. Di Supabase Dashboard, klik: "SQL Editor"
   (biasanya di sidebar kiri, bagian atas)
```

---

### Langkah 2: Jalankan Query
Copy dan paste query berikut ke editor:

```sql
-- Konfigurasi password recovery token expiry
INSERT INTO auth.config (name, value) 
VALUES ('password_recovery_token_expires_in', '3600')
ON CONFLICT (name) DO UPDATE SET value = '3600';

-- Verifikasi setting
SELECT name, value FROM auth.config 
WHERE name LIKE '%password%' OR name LIKE '%recovery%';
```

---

### Langkah 3: Jalankan
```
1. Klik tombol: "Run" atau "Execute"
   (biasanya tombol hijau dengan ikon play)

2. Tunggu hasil query
```

**Harapan Output:**
```
password_recovery_token_expires_in | 3600
```

**Selesai! ✅**

---

## 💻 METODE C: Script Node.js (Advanced)

Jika Metode A atau B tidak bisa, gunakan script:

### Langkah 1: Persiapkan Script
Script sudah tersedia di folder project:
```
scripts/configure-email-expiry.ts
```

### Langkah 2: Jalankan Script
Buka terminal dan jalankan:

```bash
cd d:\Project_Web\renovasi-2

npm run ts-node scripts/configure-email-expiry.ts
```

Atau dengan bun:
```bash
bun scripts/configure-email-expiry.ts
```

### Langkah 3: Lihat Output
Script akan:
- ✅ Validasi kredensial Supabase
- ✅ Mencoba konfigurasi via API
- ✅ Memberikan instruksi langkah berikutnya

**Harapan Output:**
```
🔧 Configuring Supabase Email Expiry
✅ Service Role Key: Verified
✅ Admin Client: Connected
⏰ Target Expiry: 1 hour (3600 seconds)
```

---

## 🧪 TESTING (Setelah Konfigurasi)

### Test 1: Reset Password Langsung
```
1. Buka aplikasi: http://localhost:8081/auth
2. Klik: "Lupa Password" atau "Forgot Password"
3. Masukkan email Anda
4. Buka email (cek folder spam jika tidak ada)
5. Klik link reset password
   
Harapan: ✅ Halaman reset password terbuka
```

---

### Test 2: Tunggu 1 Jam (Opsional)
```
1. Jangan reset password di step 1

2. Tunggu setidaknya 1 jam 5 menit

3. Klik link yang sama lagi

Harapan: ❌ Tampil pesan "Link Tidak Valid"
         (atau "Email link is invalid or has expired")
```

---

### Test 3: Request Link Baru
```
1. Dari halaman "Link Tidak Valid"

2. Klik tombol: "Minta Link Reset Baru"
   (atau "Request New Link")

3. Masukkan email Anda lagi

Harapan: ✅ Email baru dikirim dengan link baru
```

---

## 🔍 Troubleshooting

### Masalah: Tidak Bisa Menemukan Email Settings di Dashboard

**Solusi:**
1. Pastikan sudah klik "Authentication" (bukan "Auth")
2. Klik "Providers" (bukan "Settings")
3. Pastikan di halaman "Email" Provider
4. Scroll ke bawah untuk mencari field expiry

**Screenshot Referensi:**
```
Sidebar Kiri:
├─ Authentication ← Klik ini
│  ├─ Providers ← Kemudian klik ini
│  │  └─ Email ← Kemudian klik ini
│  ├─ Users
│  └─ Policies
```

---

### Masalah: Tidak Ada Field "Expiry" di Email Settings

**Solusi:**
1. Gunakan **Metode B (SQL Query)** untuk update langsung
2. Atau hubungi Supabase support untuk verifikasi plan Anda

---

### Masalah: Script Berkata "SERVICE_ROLE_KEY Missing"

**Solusi:**
1. Buka file `.env` di root project
2. Cari: `VITE_SUPABASE_SERVICE_ROLE_KEY=`
3. Jika kosong atau tidak ada, update dengan:
   - Login ke Supabase Dashboard
   - Settings > API
   - Copy "Service Role Key" (bukan Anon Key!)
   - Paste ke `.env`

---

### Masalah: Link Reset Password Masih Expired Sebelum 1 Jam

**Solusi Debugging:**
1. Refresh browser (Ctrl+F5)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Tunggu 5 menit agar perubahan propagate
4. Minta reset password baru
5. Jika masih belum work, gunakan **Metode B (SQL)** untuk verifikasi

---

## ✨ CHECKLIST FINALISASI

Sebelum dianggap selesai, pastikan:

- [ ] **Langkah 1:** Dashboard dibuka dan login
- [ ] **Langkah 2:** Project yang benar dipilih (tkqvozgorpapofejphyn)
- [ ] **Langkah 3:** Masuk ke Authentication > Providers > Email
- [ ] **Langkah 4:** Field token expiry ditemukan
- [ ] **Langkah 5:** Nilai diubah ke 3600
- [ ] **Langkah 6:** Perubahan disimpan (ada konfirmasi)
- [ ] **Test 1:** Reset password langsung berhasil ✅
- [ ] **Test 2 (Opsional):** Tunggu 1 jam, link tidak valid ✅
- [ ] **Test 3 (Opsional):** Bisa request link baru ✅

---

## 📊 Ringkasan

| Metode | Waktu | Kesulitan | Rekomendasi |
|--------|-------|-----------|-------------|
| **A: Dashboard** | 2 menit | Mudah | ⭐⭐⭐⭐⭐ |
| **B: SQL Query** | 1 menit | Sedang | ⭐⭐⭐⭐ |
| **C: Script** | 2 menit | Tinggi | ⭐⭐⭐ |

**Rekomendasi:** Gunakan **Metode A** terlebih dahulu.

---

## 🎉 Setelah Selesai

✅ Email reset password akan berlaku 1 jam  
✅ User dapat reset password dalam waktu 1 jam  
✅ Link expired menampilkan error yang jelas  
✅ User bisa request link baru  
✅ Sistem siap untuk production  

---

## 📞 Butuh Bantuan?

Jika ada masalah, cek file-file ini:

1. **Untuk details teknis:**
   - `docs/EMAIL_EXPIRY_SETUP_GUIDE.md`

2. **Untuk overview:**
   - `IMPLEMENTATION_SUMMARY.md`

3. **Untuk quick reference:**
   - `CONFIGURE_EMAIL_EXPIRY_NOW.md`

---

**Mulai dengan Metode A sekarang! Hanya 2 menit.** ⚡
