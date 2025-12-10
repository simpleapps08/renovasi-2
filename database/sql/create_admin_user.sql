-- SQL Script untuk membuat user admin pertama
-- Jalankan script ini SETELAH menjalankan fix_database_structure.sql
-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Buat atau update profile untuk admin@servisoo.com
INSERT INTO profiles (
  user_id, 
  nama, 
  email, 
  role, 
  lokasi, 
  saldo_deposit,
  created_at, 
  updated_at
)
SELECT 
  auth_users.id,
  'Super Admin',
  auth_users.email,
  'super_admin',
  'Jakarta',
  0,
  NOW(),
  NOW()
FROM auth.users auth_users
WHERE auth_users.email = 'admin@servisoo.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  nama = EXCLUDED.nama,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  lokasi = EXCLUDED.lokasi,
  updated_at = NOW();

-- 2. Alternatif: Update existing profile jika sudah ada
UPDATE profiles 
SET 
  nama = 'Super Admin',
  role = 'super_admin',
  lokasi = 'Jakarta',
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@servisoo.com'
);

-- 3. Verifikasi user admin telah dibuat
SELECT 
  p.id,
  p.user_id,
  p.nama,
  p.email,
  p.role,
  p.lokasi,
  p.saldo_deposit,
  au.email as auth_email,
  au.created_at as user_created_at
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE au.email = 'admin@servisoo.com';

-- 4. Jika user belum ada di auth.users, tampilkan instruksi
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@servisoo.com') THEN
    RAISE NOTICE 'USER admin@servisoo.com BELUM ADA DI AUTH.USERS!';
    RAISE NOTICE 'Silakan buat user terlebih dahulu melalui:';
    RAISE NOTICE '1. Supabase Dashboard > Authentication > Users > Add User';
    RAISE NOTICE '2. Email: admin@servisoo.com';
    RAISE NOTICE '3. Password: (sesuai kebutuhan)';
    RAISE NOTICE '4. Kemudian jalankan script ini lagi';
  ELSE
    RAISE NOTICE 'User admin@servisoo.com ditemukan dan profile telah diupdate!';
  END IF;
END $$;

COMMIT;