-- Script untuk menambahkan role admin_store ke database
-- Menambahkan user dengan role admin_store untuk testing

-- Update beberapa user existing menjadi admin_store untuk testing
UPDATE profiles 
SET role = 'admin_store', updated_at = NOW()
WHERE user_id IN (
  SELECT user_id FROM profiles 
  WHERE role = 'user' 
  LIMIT 1
);

-- Verifikasi perubahan
SELECT 
  id,
  user_id,
  nama,
  email,
  role,
  created_at
FROM profiles 
WHERE role = 'admin_store';

-- Tampilkan semua role yang ada
SELECT DISTINCT role, COUNT(*) as jumlah
FROM profiles 
GROUP BY role
ORDER BY role;