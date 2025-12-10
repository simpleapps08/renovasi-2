# Panduan Manual Membuat User Admin

## Status Saat Ini
- ❌ **Tidak ada user dengan role admin** di database
- ✅ Tabel `user_roles` sudah ada dengan role admin (ID: 3bc6d526-0060-4179-b9bd-1ba33c506bc2)
- ❌ Tabel `user_profiles` kosong (0 records)
- ⚠️ Tidak dapat mengakses `auth.users` dengan publishable key

## Langkah Manual di Supabase Dashboard

### 1. Buka Supabase Dashboard SQL Editor
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **SQL Editor**

### 2. Jalankan SQL Berikut (Satu per Satu)

#### Step 1: Cek Role Admin yang Tersedia
```sql
-- Cek role admin yang tersedia
SELECT id, role_name, role_level 
FROM public.user_roles 
WHERE role_name IN ('admin', 'super_admin')
ORDER BY role_level;
```

#### Step 2: Buat User Admin di user_profiles
```sql
-- Buat user admin langsung di user_profiles
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role_id,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@servisoo.com',
    'System Administrator',
    '3bc6d526-0060-4179-b9bd-1ba33c506bc2', -- Admin role ID
    NOW(),
    NOW()
);
```

#### Step 3: Verifikasi User Admin Berhasil Dibuat
```sql
-- Verifikasi user admin
SELECT 
    up.id,
    up.email,
    up.full_name,
    ur.role_name,
    ur.role_level,
    up.created_at
FROM public.user_profiles up
JOIN public.user_roles ur ON up.role_id = ur.id
WHERE ur.role_name IN ('admin', 'super_admin')
ORDER BY ur.role_level;
```

### 3. Alternatif: Buat Super Admin
Jika ingin membuat super admin (level tertinggi):

```sql
-- Buat super admin
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role_id,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'superadmin@servisoo.com',
    'Super Administrator',
    '3fe6462f-b884-47cf-8ec6-2104c12fd9e3', -- Super admin role ID
    NOW(),
    NOW()
);
```

## Setelah User Admin Dibuat

### 1. Verifikasi dengan Script
Jalankan script untuk memverifikasi:
```bash
node scripts/check-admin-users.js
```

### 2. Login ke Aplikasi
- Email: `admin@servisoo.com`
- Password: (Perlu diatur melalui Supabase Auth)

### 3. Atur Password Admin
Di Supabase Dashboard → Authentication → Users:
1. Cari user dengan email `admin@servisoo.com`
2. Klik "Send magic link" atau "Reset password"
3. Atau buat password manual

## Troubleshooting

### Jika Error "User already exists"
```sql
-- Update user existing menjadi admin
UPDATE public.user_profiles 
SET 
    role_id = '3bc6d526-0060-4179-b9bd-1ba33c506bc2',
    full_name = 'System Administrator',
    updated_at = NOW()
WHERE email = 'admin@servisoo.com';
```

### Jika Role ID Berbeda
Gunakan query ini untuk mendapatkan role ID yang benar:
```sql
SELECT id, role_name FROM public.user_roles WHERE role_name = 'admin';
```

## Hasil yang Diharapkan
- ✅ User admin berhasil dibuat di `user_profiles`
- ✅ User memiliki role admin dengan level 2
- ✅ Script `check-admin-users.js` menampilkan user admin
- ✅ Dapat login ke halaman admin aplikasi

## Catatan Penting
- Gunakan **Service Role Key** untuk operasi admin yang lebih kompleks
- User yang dibuat di `user_profiles` perlu diintegrasikan dengan `auth.users` untuk login
- Pastikan RLS policies mengizinkan akses admin