# Panduan Login Administrator SERVISOO

## Cara Mengakses Panel Admin

### 1. Melalui Halaman Login Admin Khusus
- Kunjungi: `http://localhost:5173/admin/login`
- Atau klik link "Admin" di footer halaman utama
- Masukkan kredensial administrator

### 2. Melalui Halaman Login Reguler
- Kunjungi: `http://localhost:5173/auth`
- Login dengan akun yang memiliki role "admin"
- Sistem akan otomatis mengarahkan ke panel admin

## Akun Administrator Default

**Catatan Penting:** Untuk menggunakan fitur admin, Anda perlu:

1. **Membuat akun admin di database** atau
2. **Mengubah role pengguna existing menjadi 'admin'**

### Cara Membuat Admin (Manual Database)

1. Daftar akun baru melalui `/auth`
2. Buka database Supabase
3. Pada tabel `profiles`, ubah field `role` dari `'user'` menjadi `'admin'`

### Contoh Query SQL (Supabase)
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@servisoo.com';
```

## Fitur Panel Admin

Setelah login sebagai admin, Anda dapat mengakses:

- **Dashboard Admin** (`/admin`)
  - Statistik pengguna
  - Manajemen galeri
  - Harga material & upah
  - Manajemen user
  - Deposit & billing

- **Admin RAB** (`/admin/rab`)
  - Manajemen data RAB
  - CRUD material dan upah
  - Import/Export CSV
  - Search & filter

## Keamanan

- Halaman admin dilindungi dengan middleware autentikasi
- Hanya user dengan role 'admin' yang dapat mengakses
- User biasa akan diarahkan kembali ke dashboard reguler
- Session admin menggunakan sistem autentikasi Supabase

## Troubleshooting

### "Akses Ditolak"
- Pastikan akun Anda memiliki role 'admin' di database
- Logout dan login kembali setelah mengubah role

### "Login Gagal"
- Periksa email dan password
- Pastikan akun sudah terdaftar di sistem

### Tidak Bisa Akses `/admin/rab`
- Pastikan sudah login sebagai admin
- Periksa role di database

---

**Kontak Support:** admin@servisoo.com