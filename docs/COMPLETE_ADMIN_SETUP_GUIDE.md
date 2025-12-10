# 🔧 Panduan Lengkap Setup Admin User

## 📊 Status Saat Ini
- ✅ Tabel `user_roles` sudah ada dengan role admin (ID: `3bc6d526-0060-4179-b9bd-1ba33c506bc2`)
- ✅ Tabel `user_profiles` sudah ada dengan struktur: `id`, `full_name`, `role_id`, `created_at`, `updated_at`
- ❌ Belum ada user dengan role admin
- ❌ RLS policy mencegah insert langsung via API

## 🎯 Tujuan
Membuat user admin dengan:
- **Email**: admin@servisoo.com
- **Password**: 09081982
- **Role**: admin

## 📋 Langkah-Langkah Manual

### Step 1: Buat Auth User Terlebih Dahulu

⚠️ **PENTING**: Karena foreign key constraint, auth user harus dibuat dulu!

1. Buka **Supabase Dashboard** → **Authentication** → **Users**
2. Klik **"Add user"**
3. Isi form:
   - **Email**: `admin@servisoo.com`
   - **Password**: `09081982`
   - **Confirm email**: ✅ Yes
4. Klik **"Create user"**
5. **📝 CATAT USER ID** yang di-generate (contoh: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 2: Buat Admin Profile di Database

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Jalankan SQL berikut (ganti `USER_ID_DARI_STEP_1` dengan ID sebenarnya):

```sql
-- Buat admin profile dengan ID dari auth user
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id,
    created_at,
    updated_at
) VALUES (
    'USER_ID_DARI_STEP_1',  -- Ganti dengan ID dari Step 1
    'System Administrator',
    '3bc6d526-0060-4179-b9bd-1ba33c506bc2',
    NOW(),
    NOW()
);
```

**Alternatif - Jika Ingin Hapus Constraint:**
```sql
-- Opsi advanced: Hapus constraint sementara
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Insert dengan UUID custom
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id,
    created_at,
    updated_at
) VALUES (
    'd535ec7f-c84d-4cd7-a864-19d40bc7f316',
    'System Administrator',
    '3bc6d526-0060-4179-b9bd-1ba33c506bc2',
    NOW(),
    NOW()
);
```

### Step 3: Verifikasi Setup

Setelah kedua langkah di atas selesai, verifikasi bahwa setup berhasil:

```sql
-- Verifikasi admin profile
SELECT 
    up.id,
    up.full_name,
    ur.role_name,
    ur.role_level
FROM user_profiles up
JOIN user_roles ur ON up.role_id = ur.id
WHERE ur.role_name = 'admin';

-- Verifikasi auth user
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
WHERE email = 'admin@servisoo.com';
```

**Via Script:**
```bash
node scripts/create-admin-profile-only.js
```

### Step 4: Test Login

1. Buka aplikasi di browser
2. Login dengan:
   - **Email**: admin@servisoo.com
   - **Password**: 09081982
3. Verifikasi akses admin panel
4. Test fitur user management

## 🔍 Troubleshooting

### Problem: Foreign Key Constraint Error
**Error**: `insert or update on table "user_profiles" violates foreign key constraint "user_profiles_id_fkey"`
**Solution**: Buat auth user terlebih dahulu di Authentication → Users, lalu gunakan ID-nya untuk user_profiles

### Problem: RLS Policy Error
**Solution**: Gunakan SQL manual di Dashboard, bukan API

### Problem: Auth User Tidak Bisa Login
**Solution**: 
- Pastikan email confirmed
- Reset password jika perlu
- Cek di Authentication → Users

### Problem: Role Tidak Terdeteksi
**Solution**:
- Pastikan user_profiles.id = auth.users.id
- Cek foreign key ke user_roles

## 📁 File Terkait

- `scripts/fix-foreign-key-issue.cjs` - Analisis masalah foreign key constraint
- `scripts/create-admin-profile-only.js` - Generate SQL dan verifikasi
- `scripts/create-auth-user-manual.js` - Buat auth user (perlu service key)
- `scripts/check-admin-users.js` - Verifikasi setup
- `CREATE_ADMIN_USER_MANUAL.md` - Panduan sebelumnya

## ✅ Hasil yang Diharapkan

Setelah setup berhasil:
- ✅ User admin@servisoo.com bisa login
- ✅ Role admin terdeteksi di aplikasi
- ✅ Akses ke admin panel tersedia
- ✅ User management berfungsi

---

**💡 Tips**: Simpan User ID dari Step 2 untuk referensi future troubleshooting.