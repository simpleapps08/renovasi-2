# Instruksi Setup Database Supabase

## Masalah yang Ditemukan
Tabel `user_roles` belum ada di database Supabase project ID: `tkqvozgorpapofejphyn`

## ⚠️ PENTING: Fix Database Issues Terlebih Dahulu

**Jika Anda mendapat error seperti:**

1. **Column user_id error:**
   ```
   ERROR: null value in column "user_id" of relation "user_profiles" violates not-null constraint
   ```
   👉 Baca panduan: <mcfile name="FIX_USER_PROFILES_STRUCTURE.md" path="D:\WEBSITE\renovasi-2\FIX_USER_PROFILES_STRUCTURE.md"></mcfile>

2. **Infinite recursion error:**
   ```
   ERROR: infinite recursion detected in policy for relation "user_profiles"
   ```
   👉 Baca panduan: <mcfile name="FIX_RLS_INFINITE_RECURSION.md" path="D:\WEBSITE\renovasi-2\FIX_RLS_INFINITE_RECURSION.md"></mcfile>

**Diagnosis cepat:**
```bash
node scripts/simple-table-check.js
```

## Langkah-langkah Setup Manual

### 1. Buka Supabase Dashboard
1. Kunjungi [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login ke akun Supabase Anda
3. Pilih project dengan ID: `tkqvozgorpapofejphyn`

### 2. Buka SQL Editor
1. Di sidebar kiri, klik **SQL Editor**
2. Klik **New Query** untuk membuat query baru

### 3. Jalankan SQL untuk Membuat Tabel user_roles

Copy dan paste SQL berikut ke SQL Editor, lalu klik **Run**:

```sql
-- Step 1: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_level INTEGER NOT NULL,
    permissions JSONB DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_level ON public.user_roles(role_level);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);

-- Step 2: Insert default roles
INSERT INTO public.user_roles (role_name, role_level, permissions, description) VALUES
('super_admin', 1, '{"all": true, "manage_users": true, "manage_roles": true, "manage_system": true}', 'Super Administrator with full system access'),
('admin', 2, '{"manage_users": true, "manage_content": true, "view_analytics": true}', 'Administrator with user and content management'),
('manager', 3, '{"manage_content": true, "view_analytics": true, "manage_team": true}', 'Manager with content and team management'),
('editor', 4, '{"manage_content": true, "edit_posts": true}', 'Editor with content management permissions'),
('user', 5, '{"view_content": true, "create_posts": true}', 'Regular user with basic permissions')
ON CONFLICT (role_name) DO NOTHING;
```

### 4. Modifikasi Tabel user_profiles

**PENTING:** Berdasarkan analisis database, tabel user_profiles saat ini hanya memiliki kolom `id`. Kita perlu menambahkan kolom yang diperlukan.

Jalankan SQL berikut di **SQL Editor**:

```sql
-- Add role_id column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL;

-- Add full_name column (optional, for user display name)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add timestamps
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON public.user_profiles(role_id);

-- Set default role for existing users (if any)
UPDATE public.user_profiles 
SET role_id = (
    SELECT id FROM public.user_roles WHERE role_name = 'user' LIMIT 1
)
WHERE role_id IS NULL;

-- Create function to automatically assign default role
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role_id IS NULL THEN
        NEW.role_id := (
            SELECT id FROM public.user_roles 
            WHERE role_name = 'user' 
            LIMIT 1
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign default role
DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.user_profiles;
CREATE TRIGGER assign_default_role_trigger
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_role();
```

### 5. Buat User Admin

**PENTING:** Tabel `user_profiles` tidak memiliki kolom `email`. Email disimpan di tabel `auth.users` (sistem autentikasi Supabase).

**Langkah 5a: Buat Auth User terlebih dahulu**

1. Buka **Authentication** → **Users** di Supabase Dashboard
2. Klik **Add User** 
3. Masukkan:
   - Email: `admin@servisoo`
   - Password: (buat password yang kuat)
   - Auto Confirm User: ✅ (centang)
4. Klik **Create User**
5. **Catat User ID** yang muncul (format UUID)

**Langkah 5b: Buat Profile untuk Admin User**

Jalankan SQL berikut di **SQL Editor** (ganti `USER_ID_FROM_STEP_5A` dengan ID user yang baru dibuat):

```sql
-- Create admin user profile
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id,
    created_at,
    updated_at
) 
SELECT 
    'USER_ID_FROM_STEP_5A',  -- Ganti dengan ID user dari auth.users
    'System Administrator',
    ur.id,
    NOW(),
    NOW()
FROM public.user_roles ur 
WHERE ur.role_name = 'admin'
ON CONFLICT (id) DO UPDATE SET
    role_id = EXCLUDED.role_id,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
```

**Contoh dengan ID nyata:**
```sql
-- Contoh jika User ID adalah: 12345678-1234-1234-1234-123456789abc
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id,
    created_at,
    updated_at
) 
SELECT 
    '12345678-1234-1234-1234-123456789abc',
    'System Administrator',
    ur.id,
    NOW(),
    NOW()
FROM public.user_roles ur 
WHERE ur.role_name = 'admin';
```

**Alternatif: Jika sudah ada user dengan email admin@servisoo**

Jika user sudah ada di auth.users, gunakan query ini untuk mendapatkan ID-nya:

```sql
-- Cari user ID berdasarkan email (hanya bisa dijalankan dengan service role key)
SELECT id, email FROM auth.users WHERE email = 'admin@servisoo';
```

### 6. Verifikasi Setup

Setelah menjalankan semua SQL di atas, verifikasi setup dengan cara berikut:

**6a. Cek struktur tabel user_profiles:**
```bash
node scripts/check-actual-table-structure.js
```

**6b. Cek admin user:**
```bash
node scripts/create-admin-user-correct.js
```

**6c. Verifikasi manual di Supabase Dashboard:**

1. **Cek Tabel user_roles:**
   - Buka **Table Editor** → **user_roles**
   - Pastikan ada 5 role: super_admin, admin, manager, editor, user

2. **Cek Tabel user_profiles:**
   - Buka **Table Editor** → **user_profiles**
   - Pastikan ada kolom: id, role_id, full_name, created_at, updated_at
   - Pastikan ada 1 record untuk admin user

3. **Cek Auth Users:**
   - Buka **Authentication** → **Users**
   - Pastikan ada user dengan email admin@servisoo

**6d. Test login admin:**

1. Buka aplikasi di browser
2. Login dengan:
   - Email: admin@servisoo
   - Password: (password yang dibuat di step 5a)
3. Pastikan bisa mengakses halaman admin

**6e. Verifikasi dengan SQL Query:**

Jalankan query berikut di SQL Editor untuk memverifikasi:

```sql
-- Check roles
SELECT * FROM public.user_roles ORDER BY role_level;

-- Check admin user profile
SELECT 
    up.id,
    up.full_name,
    ur.role_name,
    ur.role_level,
    up.created_at
FROM public.user_profiles up
JOIN public.user_roles ur ON up.role_id = ur.id;

-- Check auth user (requires service role key)
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@servisoo';
```

### 7. Troubleshooting

**Jika tabel user_profiles masih hanya memiliki kolom 'id':**
- Jalankan ulang SQL di Step 4
- Pastikan tidak ada error di SQL Editor

**Jika admin user tidak bisa login:**
- Cek di Authentication → Users apakah user sudah confirmed
- Cek di Table Editor → user_profiles apakah profile sudah dibuat
- Cek apakah role_id di user_profiles sesuai dengan id role 'admin'

**Jika ada error permission:**
- Pastikan RLS policies sudah dibuat
- Cek apakah user_roles table accessible oleh authenticated users

## Setelah Setup Manual Selesai

Setelah menjalankan semua SQL di atas dan verifikasi berhasil, Anda dapat:

1. **Menjalankan script verifikasi:**
   ```bash
   node scripts/check-admin-users.js
   ```

2. **Menguji aplikasi:**
   - Buka aplikasi di browser
   - Login dengan email: `admin@servisoo`
   - Verifikasi bahwa user memiliki akses admin

3. **Membuat user admin tambahan (opsional):**
   ```bash
   node scripts/create-admin-user-correct.js
   ```

## Troubleshooting Lanjutan

### Jika Tabel user_profiles Tidak Ada
Jika tabel `user_profiles` juga tidak ada, buat dengan SQL berikut:

```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_name IN ('admin', 'super_admin')
        )
    );
```

### Jika Ada Error Permission
- Pastikan Anda menggunakan **service role key** bukan **anon key** untuk operasi admin
- Cek RLS policies sudah dibuat dengan benar
- Pastikan user_roles table dapat diakses oleh authenticated users

### Jika Script Node.js Error
- Pastikan file `.env` sudah dikonfigurasi dengan benar
- Cek SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY
- Pastikan dependencies sudah diinstall: `npm install`

---

**Catatan:** Setup manual ini diperlukan karena Supabase client tidak memiliki permission untuk membuat tabel secara programatis dengan anon key. Setelah setup manual selesai, aplikasi akan dapat berfungsi dengan normal.