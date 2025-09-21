# Panduan Perbaikan Database Supabase

## Masalah yang Ditemukan

1. **Inkonsistensi Nama Tabel**: Kode menggunakan tabel `profiles` tetapi database memiliki `user_profiles`
2. **Kolom yang Hilang**: Tabel tidak memiliki kolom `nama`, `email`, `lokasi`, `saldo_deposit` yang dibutuhkan kode
3. **RLS Policies**: Policies tidak sesuai dengan kebutuhan aplikasi admin

## Langkah Perbaikan

### 1. Backup Database (Opsional)
```sql
-- Backup existing data
CREATE TABLE user_profiles_backup AS SELECT * FROM user_profiles;
```

### 2. Jalankan Script Perbaikan Struktur

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Copy dan paste isi file `fix_database_structure.sql`
5. Klik **Run** untuk menjalankan script

### 3. Buat User Admin Pertama

#### Opsi A: Buat User Melalui Dashboard
1. Klik **Authentication** > **Users**
2. Klik **Add User**
3. Isi:
   - Email: `admin@servisoo.com`
   - Password: (pilih password yang aman)
   - Email Confirm: ✅ (centang)
4. Klik **Create User**

#### Opsi B: Buat User Melalui SQL
```sql
-- Jalankan di SQL Editor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@servisoo.com',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### 4. Buat Profile Admin

1. Setelah user dibuat, jalankan script `create_admin_user.sql`
2. Copy dan paste isi file ke SQL Editor
3. Klik **Run**

### 5. Verifikasi Perbaikan

```sql
-- Cek struktur tabel profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Cek user admin
SELECT 
  p.nama, p.email, p.role, p.lokasi,
  au.email as auth_email
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.role IN ('admin', 'super_admin');

-- Cek RLS policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

## Struktur Tabel Profiles yang Benar

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama VARCHAR(255),           -- Nama lengkap user
  email VARCHAR(255),          -- Email (sync dari auth.users)
  phone VARCHAR(20),           -- Nomor telepon
  address TEXT,                -- Alamat lengkap
  city VARCHAR(100),           -- Kota
  lokasi VARCHAR(255),         -- Lokasi (alias untuk city/address)
  province VARCHAR(100),       -- Provinsi
  postal_code VARCHAR(10),     -- Kode pos
  date_of_birth DATE,          -- Tanggal lahir
  gender VARCHAR(10),          -- Jenis kelamin
  occupation VARCHAR(200),     -- Pekerjaan
  bio TEXT,                    -- Biografi
  role VARCHAR(20) DEFAULT 'user', -- Role: user, admin, super_admin
  saldo_deposit DECIMAL(15,2) DEFAULT 0, -- Saldo deposit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## Testing Setelah Perbaikan

1. **Test Login Admin**:
   - Buka aplikasi
   - Klik "Admin Login"
   - Login dengan `admin@servisoo.com`
   - Pastikan berhasil masuk ke dashboard admin

2. **Test User Management**:
   - Di dashboard admin, klik "User Management"
   - Pastikan data user tampil dengan benar
   - Test create, update, delete user

3. **Test Profile Management**:
   - Login sebagai user biasa
   - Klik "Profile"
   - Test update profile
   - Pastikan data tersimpan dengan benar

## Troubleshooting

### Error: "relation 'profiles' does not exist"
- Pastikan script `fix_database_structure.sql` sudah dijalankan
- Cek apakah tabel `user_profiles` berhasil di-rename ke `profiles`

### Error: "column 'nama' does not exist"
- Pastikan semua kolom baru sudah ditambahkan
- Jalankan ulang bagian ALTER TABLE dari script

### Error: "RLS policy violation"
- Pastikan RLS policies sudah dibuat dengan benar
- Cek apakah user memiliki role yang sesuai

### Login Admin Gagal
- Pastikan user `admin@servisoo.com` ada di `auth.users`
- Pastikan profile memiliki role `admin` atau `super_admin`
- Cek RLS policies untuk tabel profiles

## File yang Dibuat

1. `fix_database_structure.sql` - Script utama perbaikan struktur
2. `create_admin_user.sql` - Script membuat user admin
3. `DATABASE_FIX_GUIDE.md` - Panduan ini

## Catatan Penting

- **Backup data** sebelum menjalankan script
- **Test di environment development** terlebih dahulu
- **Jalankan script secara berurutan**
- **Verifikasi setiap langkah** sebelum melanjutkan

---

**Status**: ✅ Script siap dijalankan  
**Estimasi Waktu**: 10-15 menit  
**Risk Level**: Medium (ada perubahan struktur tabel)