# 🚀 QUICK START - Finalisasi Email Expiry

## Pilih Metode Anda

### ⚡ METODE TERCEPAT: Dashboard (2 MENIT)

```
1. Buka: https://app.supabase.com
   Login ke akun Anda

2. Pilih Project: tkqvozgorpapofejphyn

3. Klik: Authentication → Providers → Email

4. Cari field: "token expiry" atau "expires_in"
   Ganti nilai dengan: 3600

5. Klik: Save / Update
   ✅ SELESAI!
```

---

### 🔧 METODE SQL: Jika Dashboard Stuck

```
1. Di Supabase Dashboard, klik: SQL Editor

2. Copy-paste & jalankan query ini:

INSERT INTO auth.config (name, value) 
VALUES ('password_recovery_token_expires_in', '3600')
ON CONFLICT (name) DO UPDATE SET value = '3600';

3. Harusnya output:
   password_recovery_token_expires_in | 3600
   
   ✅ SELESAI!
```

---

### 💻 METODE SCRIPT: Jika Metode A & B Failed

```bash
cd d:\Project_Web\renovasi-2
npm run ts-node scripts/configure-email-expiry.ts
```

Follow instruksi yang ditampilkan.

---

## ✅ Verification

Setelah salah satu metode di atas, test dengan:

### Test Reset Password Langsung
```
1. http://localhost:8081/auth
2. Klik "Lupa Password"
3. Input email Anda
4. Klik link di email

✅ Harusnya form reset password muncul
```

### Test Link Expired (1 Jam Kemudian)
```
1. Dari test di atas, jangan reset password
2. Tunggu 1 jam 5 menit
3. Klik link yang sama

❌ Harusnya muncul: "Link Tidak Valid"
   Dengan tombol: "Minta Link Reset Baru"
```

---

## 🎯 Yang Akan Terjadi Setelah Selesai

✅ Email reset password berlaku 1 jam  
✅ Setelah 1 jam, link tidak bisa dipakai  
✅ User harus minta link baru  
✅ Sistem siap untuk production  

---

## 📚 Dokumen Lengkap

- **Panduan Detail:** `FINALISASI_SETUP_STEPBYSTEP.md`
- **Technical Deep Dive:** `docs/EMAIL_EXPIRY_SETUP_GUIDE.md`
- **Implementation Overview:** `IMPLEMENTATION_SUMMARY.md`

---

**Yang mana yang ingin Anda gunakan?**
→ A, B, atau C? Pilih yang paling mudah untuk Anda! 🚀
