-- Script untuk membuat user baru servisoo_store di Supabase
-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Pastikan constraint role sudah mendukung store_owner (jalankan jika belum)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'super_admin', 'store_owner', 'admin_toko'));

-- 2. Buat user baru di auth.users (menggunakan fungsi admin)
-- CATATAN: Script ini memerlukan akses admin/service role key
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
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
  'store@servisoo.com',
  crypt('09081982', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "servisoo_store"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 3. Ambil user_id yang baru dibuat
-- (Ganti dengan ID yang sebenarnya setelah user dibuat)
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Ambil user_id dari user yang baru dibuat
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = 'store@servisoo.com' 
    LIMIT 1;
    
    -- Buat profil untuk user baru
    IF new_user_id IS NOT NULL THEN
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
            new_user_id,
            'servisoo_store',
            'store@servisoo.com',
            'store_owner',
            'Jakarta',
            0,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'User servisoo_store berhasil dibuat dengan ID: %', new_user_id;
    ELSE
        RAISE EXCEPTION 'Gagal membuat user atau user sudah ada';
    END IF;
END $$;

-- 4. Verifikasi user yang dibuat
SELECT 
    u.id,
    u.email,
    u.created_at as user_created,
    p.nama,
    p.role,
    p.lokasi,
    p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'store@servisoo.com';

-- 5. Cek semua store owners
SELECT 
    p.nama,
    p.email,
    p.role,
    p.lokasi,
    p.created_at
FROM profiles p
WHERE p.role = 'store_owner'
ORDER BY p.created_at DESC;

-- CATATAN PENTING:
-- 1. Script ini memerlukan akses admin/service role untuk mengakses auth.users
-- 2. Jika gagal, gunakan Supabase Auth Admin API atau Dashboard
-- 3. Password akan di-hash otomatis menggunakan bcrypt
-- 4. User dapat login dengan: store@servisoo.com / 09081982
-- 5. Role store_owner memberikan akses ke /admin/toko