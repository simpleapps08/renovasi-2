# Setup Role Admin Store

## Status Saat Ini
Berdasarkan pengecekan database, role yang tersedia saat ini adalah:
- `user` (9 users)
- `admin` (1 user)
- `super_admin` (1 user)

## Untuk Menambahkan Role Admin Store

Jika Anda ingin menambahkan role `admin_store`, ikuti langkah berikut:

### 1. Buka Supabase Dashboard
- Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- Pilih project Anda
- Buka **SQL Editor**

### 2. Jalankan SQL Command
Jalankan command berikut untuk memperbarui constraint:

```sql
-- Hapus constraint lama
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Tambahkan constraint baru dengan admin_store
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin', 'super_admin', 'admin_store'));
```

### 3. Update AdminUserManagement.tsx
Setelah constraint diperbarui, update file `src/pages/AdminUserManagement.tsx` pada fungsi `fetchRoles()`:

```javascript
setAvailableRoles([
  { id: 'super_admin', name: 'Super Admin', level: 1 },
  { id: 'admin', name: 'Admin', level: 2 },
  { id: 'admin_store', name: 'Admin Store', level: 3 },
  { id: 'user', name: 'User', level: 4 }
])
```

### 4. Test Role Assignment
Setelah constraint diperbarui, Anda dapat:
- Mengubah role user existing menjadi `admin_store`
- Membuat user baru dengan role `admin_store`

## Role yang Saat Ini Tersedia di UI
- Super Admin
- Admin  
- User

**Catatan**: Role `admin_store` belum ditambahkan ke constraint database, sehingga belum bisa digunakan.