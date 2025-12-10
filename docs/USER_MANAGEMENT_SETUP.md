# Setup Manajemen User - Panduan Lengkap

## Masalah yang Diperbaiki

Halaman CMS fitur manajemen user sebelumnya belum terhubung dengan database Supabase dan tidak memiliki fungsi CRUD yang lengkap.

## Perbaikan yang Dilakukan

### 1. Database Schema Updates

#### a. Menambahkan Admin Policies
File: `supabase/migrations/20250126000001_add_admin_policies_user_profiles.sql`
- Policy untuk admin melihat semua user profiles
- Policy untuk admin mengupdate semua user profiles  
- Policy untuk admin menghapus user profiles
- Policy untuk admin membuat user profiles baru

#### b. Menambahkan Kolom full_name
File: `supabase/migrations/20250126000002_add_full_name_to_user_profiles.sql`
- Menambahkan kolom `full_name` ke tabel `user_profiles`
- Membuat index untuk performa pencarian yang lebih baik

### 2. Perbaikan Kode AdminUserManagement.tsx

#### a. Fungsi fetchUsers()
- **Sebelum**: Query sederhana yang tidak bisa mengambil email dari auth.users
- **Sesudah**: 
  - Mengambil data dari `user_profiles` table
  - Menggunakan `supabase.auth.admin.listUsers()` untuk mendapatkan email
  - Menggabungkan data profile dengan email dari auth users
  - Error handling yang lebih baik dengan pesan yang informatif

#### b. Fungsi Create User
- **Sebelum**: Hanya menampilkan pesan bahwa pembuatan user harus melalui registrasi
- **Sesudah**:
  - Menggunakan `supabase.auth.admin.createUser()` untuk membuat user baru
  - Membuat entry di tabel `user_profiles` secara otomatis
  - Password sementara: `TempPassword123!`
  - Cleanup otomatis jika terjadi error
  - Notifikasi password sementara kepada admin

#### c. Fungsi Update User
- Tetap menggunakan update ke tabel `user_profiles`
- Menggunakan kolom `full_name` yang baru
- Error handling yang diperbaiki

#### d. Fungsi Delete User
- Menghapus dari tabel `user_profiles`
- RLS policy memastikan hanya admin yang bisa menghapus

#### e. Fungsi Change Role
- Update role user di tabel `user_profiles`
- Validasi admin melalui RLS policy

### 3. Konfigurasi Supabase

File: `supabase/config.toml`
- Memperbaiki konfigurasi yang rusak
- Menambahkan konfigurasi Google OAuth yang benar
- Mengatur project reference

## Cara Menjalankan Migration

### Opsi 1: Manual SQL (Direkomendasikan)

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Masuk ke SQL Editor
4. Jalankan file `run_migrations.sql` yang sudah dibuat

### Opsi 2: Via Supabase CLI (Jika sudah di-link)

```bash
npx supabase db push
```

## Fitur CRUD yang Tersedia

### ✅ CREATE (Tambah User Baru)
- Admin dapat membuat user baru dengan email dan data profil
- Password sementara akan digenerate: `TempPassword123!`
- User baru akan menerima email konfirmasi
- Profile otomatis dibuat di tabel `user_profiles`

### ✅ READ (Lihat Daftar User)
- Menampilkan semua user dengan data lengkap
- Email diambil dari `auth.users`
- Data profil diambil dari `user_profiles`
- Pencarian berdasarkan nama dan email
- Filter berdasarkan role (admin/user)
- Pagination untuk performa yang baik

### ✅ UPDATE (Edit User)
- Admin dapat mengedit semua data profil user
- Update data di tabel `user_profiles`
- Validasi input yang proper
- Notifikasi sukses/error

### ✅ DELETE (Hapus User)
- Admin dapat menghapus user dari sistem
- Menghapus dari tabel `user_profiles`
- Konfirmasi sebelum menghapus
- User auth tetap ada di `auth.users` (untuk keamanan)

### ✅ ROLE MANAGEMENT
- Ubah role user antara 'user' dan 'admin'
- Update langsung ke database
- Validasi admin permission

### ✅ EXPORT DATA
- Export daftar user ke format CSV
- Termasuk semua data profil
- Berguna untuk backup dan analisis

## Keamanan (Row Level Security)

- **User biasa**: Hanya bisa melihat dan mengedit profil sendiri
- **Admin**: Dapat mengelola semua user profiles
- **Policy validation**: Setiap operasi divalidasi melalui RLS
- **Auth integration**: Menggunakan `auth.uid()` untuk validasi

## Testing

1. Login sebagai admin
2. Buka halaman `/admin/users`
3. Test semua fungsi CRUD:
   - Tambah user baru
   - Edit data user existing
   - Ubah role user
   - Hapus user
   - Export data ke CSV
   - Pencarian dan filter

## Troubleshooting

### Jika Migration Gagal
1. Pastikan Anda login sebagai admin di Supabase Dashboard
2. Jalankan SQL migration secara manual
3. Periksa log error di browser console

### Jika Tidak Bisa Membuat User Baru
1. Pastikan Anda login sebagai admin
2. Periksa RLS policies sudah aktif
3. Pastikan kolom `full_name` sudah ditambahkan

### Jika Email Tidak Muncul
1. Pastikan `supabase.auth.admin.listUsers()` berfungsi
2. Periksa permission admin di Supabase
3. Pastikan service role key digunakan untuk admin operations

## Status

✅ **SELESAI**: Fitur manajemen user sudah terhubung dengan database Supabase dan memiliki fungsi CRUD lengkap.

**File yang diubah:**
- `src/pages/AdminUserManagement.tsx` - Implementasi CRUD lengkap
- `supabase/migrations/20250126000001_add_admin_policies_user_profiles.sql` - Admin policies
- `supabase/migrations/20250126000002_add_full_name_to_user_profiles.sql` - Kolom full_name
- `supabase/config.toml` - Konfigurasi Supabase
- `run_migrations.sql` - Migration manual

**Fitur baru:**
- Create user dengan auth integration
- Read users dengan email dari auth.users
- Update user profiles
- Delete user profiles
- Role management
- Export to CSV
- Search dan filter
- Pagination
- Error handling yang robust