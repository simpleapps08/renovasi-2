-- Script untuk mengubah password Haryo Abrianto menjadi 12345678
-- Jalankan di Supabase SQL Editor

-- 1. Verifikasi user yang akan diubah
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'haryoabrianto220393@gmail.com';

-- 2. Update password untuk user Haryo Abrianto
-- Password akan di-hash menggunakan bcrypt
UPDATE auth.users 
SET 
    encrypted_password = crypt('12345678', gen_salt('bf')),
    updated_at = now()
WHERE id = 'b14f6550-ccb6-4c31-afb0-b5eac039d0c2';

-- 3. Verifikasi bahwa update berhasil
SELECT 
    id,
    email,
    updated_at,
    'Password updated successfully' as status
FROM auth.users 
WHERE id = 'b14f6550-ccb6-4c31-afb0-b5eac039d0c2';

-- 4. Optional: Reset email confirmation jika diperlukan
-- UPDATE auth.users 
-- SET email_confirmed_at = now()
-- WHERE id = 'b14f6550-ccb6-4c31-afb0-b5eac039d0c2';

-- INSTRUKSI:
-- 1. Copy script ini
-- 2. Buka Supabase Dashboard
-- 3. Pergi ke SQL Editor
-- 4. Paste dan jalankan script ini
-- 5. Verifikasi hasilnya

-- CATATAN:
-- - Password baru: 12345678
-- - User: haryoabrianto220393@gmail.com
-- - User ID: b14f6550-ccb6-4c31-afb0-b5eac039d0c2