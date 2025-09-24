-- Script alternatif untuk membuat user servisoo_store (Versi Sederhana)
-- Jalankan di Supabase Dashboard > SQL Editor

-- METODE 1: Menggunakan fungsi admin (Memerlukan service role)
-- Uncomment jika menggunakan service role key
/*
SELECT auth.admin_create_user(
  'store@servisoo.com',
  '09081982',
  '{
    "name": "servisoo_store",
    "email_confirmed": true
  }'
);
*/

-- METODE 2: Insert langsung ke profiles (Jika user sudah ada di auth)
-- Pastikan constraint role sudah diupdate
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'super_admin', 'store_owner', 'admin_toko'));

-- Insert profil baru (user_id akan diisi manual setelah user dibuat)
-- Ganti 'USER_ID_DISINI' dengan UUID user yang sebenarnya
/*
INSERT INTO profiles (
    user_id,
    nama,
    email,
    role,
    lokasi,
    saldo_deposit,
    created_at,
    updated_at
) VALUES (
    'USER_ID_DISINI', -- Ganti dengan UUID user yang sebenarnya
    'servisoo_store',
    'store@servisoo.com',
    'store_owner',
    'Jakarta',
    0,
    NOW(),
    NOW()
);
*/

-- METODE 3: Cek dan update user yang sudah ada
-- Jika user store@servisoo.com sudah ada, update rolenya
UPDATE profiles 
SET 
    role = 'store_owner',
    nama = 'servisoo_store',
    updated_at = NOW()
WHERE email = 'store@servisoo.com';

-- Verifikasi hasil
SELECT 
    nama,
    email,
    role,
    lokasi,
    created_at,
    updated_at
FROM profiles 
WHERE email = 'store@servisoo.com';

-- Cek semua store owners
SELECT 
    nama,
    email,
    role,
    lokasi,
    created_at
FROM profiles 
WHERE role IN ('store_owner', 'admin_toko')
ORDER BY created_at DESC;

-- INSTRUKSI MANUAL:
-- 1. Jika user belum ada, buat dulu di Supabase Dashboard > Authentication > Users
-- 2. Email: store@servisoo.com
-- 3. Password: 09081982
-- 4. Kemudian jalankan METODE 2 atau 3 di atas
-- 5. User dapat login dan akses /admin/toko