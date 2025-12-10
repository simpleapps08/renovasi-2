# Panduan Perbaikan Masalah Admin Login

## Masalah yang Ditemukan

User `simple.apps08@gmail.com` tidak bisa mengakses dashboard admin karena:

1. ✅ User **SUDAH TERDAFTAR** di sistem autentikasi
2. ❌ User **BELUM MEMILIKI PROFILE** atau role admin yang benar di tabel `profiles`

## Analisis Masalah

Berdasarkan investigasi:
- User `simple.apps08@gmail.com` ada di tabel `auth.users` (terbukti dari error "Invalid login credentials")
- User tidak memiliki profile di tabel `profiles` atau profile tidak memiliki role 'admin'
- Sistem autentikasi mengarahkan user ke dashboard biasa karena role default adalah 'user'

## Solusi 1: Melalui Supabase Dashboard (RECOMMENDED)

### Langkah 1: Akses Supabase Dashboard
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login ke project `tkqvozgorpapofejphyn`
3. Pilih project SERVISOO

### Langkah 2: Cari User ID
1. Klik **Authentication** di sidebar kiri
2. Klik **Users**
3. Cari user dengan email `simple.apps08@gmail.com`
4. **COPY USER ID** (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

### Langkah 3: Periksa/Buat Profile
1. Klik **Table Editor** di sidebar kiri
2. Pilih tabel **profiles**
3. Cari row dengan `user_id` yang sama dengan User ID dari langkah 2

### Langkah 4A: Jika Profile SUDAH ADA
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_DARI_LANGKAH_2';
```

### Langkah 4B: Jika Profile BELUM ADA
```sql
INSERT INTO profiles (user_id, nama, role, lokasi) 
VALUES (
  'USER_ID_DARI_LANGKAH_2',
  'Admin SERVISOO',
  'admin',
  'Jakarta'
);
```

## Solusi 2: Melalui SQL Editor

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan query berikut:

```sql
-- Cek apakah user ada dan ambil user_id
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'simple.apps08@gmail.com';

-- Cek apakah profile sudah ada
SELECT * 
FROM profiles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'simple.apps08@gmail.com');

-- Jika profile ada, update role menjadi admin
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'simple.apps08@gmail.com');

-- Jika profile tidak ada, buat profile baru dengan role admin
INSERT INTO profiles (user_id, nama, role, lokasi)
SELECT 
  id,
  'Admin SERVISOO',
  'admin',
  'Jakarta'
FROM auth.users 
WHERE email = 'simple.apps08@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.users.id
);
```

## Solusi 3: Reset Password (Jika Diperlukan)

Jika user lupa password:

1. Di **Authentication > Users**
2. Klik user `simple.apps08@gmail.com`
3. Klik **Send Password Reset**
4. User akan menerima email reset password

## Verifikasi Perbaikan

Setelah menjalankan salah satu solusi di atas:

1. **Logout** dari semua session yang ada
2. Buka `http://localhost:5173/admin/login`
3. Login dengan `simple.apps08@gmail.com` dan password yang benar
4. User harus diarahkan ke `/admin` (dashboard admin)

## Troubleshooting Tambahan

### Jika Masih Diarahkan ke Dashboard User

1. **Clear browser cache dan cookies**
2. **Restart development server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
3. **Periksa console browser** untuk error JavaScript
4. **Periksa Network tab** untuk error API

### Jika Error "Access Denied"

1. Pastikan role di database benar-benar 'admin' (bukan 'Admin' atau 'ADMIN')
2. Periksa RLS policies di tabel profiles
3. Restart development server

### Jika User Tidak Bisa Login Sama Sekali

1. Periksa apakah email sudah dikonfirmasi:
   ```sql
   SELECT email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'simple.apps08@gmail.com';
   ```

2. Jika `email_confirmed_at` adalah NULL, konfirmasi email:
   ```sql
   UPDATE auth.users 
   SET email_confirmed_at = NOW() 
   WHERE email = 'simple.apps08@gmail.com';
   ```

## Pencegahan Masalah Serupa

Untuk mencegah masalah serupa di masa depan:

1. **Pastikan trigger `handle_new_user()` berfungsi** dengan benar
2. **Test registrasi user baru** untuk memastikan profile otomatis dibuat
3. **Buat admin user melalui script** yang sudah disediakan
4. **Dokumentasikan proses pembuatan admin** untuk tim

## Kontak

Jika masalah masih berlanjut, hubungi developer dengan informasi:
- User ID dari tabel auth.users
- Screenshot error message
- Browser console logs
- Network request logs

---

**Status:** Masalah teridentifikasi - User terdaftar tapi tidak memiliki profile admin yang benar
**Solusi:** Update/buat profile dengan role 'admin' di tabel profiles
**Estimasi Waktu:** 2-5 menit melalui Supabase Dashboard