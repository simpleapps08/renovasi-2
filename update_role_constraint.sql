-- Script untuk memperbarui constraint role di tabel profiles
-- Menambahkan 'admin_store' ke dalam constraint yang ada

-- Hapus constraint lama
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Tambahkan constraint baru dengan role admin_store
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin', 'super_admin', 'admin_store'));

-- Verifikasi constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';