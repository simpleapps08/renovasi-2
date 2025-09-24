-- Script untuk menambahkan role 'store_owner' ke constraint database
-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Hapus constraint yang ada
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Tambahkan constraint baru dengan role store_owner
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'super_admin', 'store_owner', 'admin_toko'));

-- 3. Verifikasi constraint baru
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'profiles_role_check';

-- 4. Test insert dengan role store_owner (opsional)
-- INSERT INTO profiles (nama, email, role, lokasi, saldo_deposit) 
-- VALUES ('Store Owner Test', 'test@store.com', 'store_owner', 'Jakarta', 0);

-- 5. Cek semua role yang ada
SELECT DISTINCT role, COUNT(*) as jumlah 
FROM profiles 
GROUP BY role 
ORDER BY role;