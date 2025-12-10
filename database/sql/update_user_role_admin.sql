-- Script untuk mengubah role user ajuz.priyono@gmail.com menjadi admin
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- Update role user menjadi admin berdasarkan email
UPDATE public.user_profiles 
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'ajuz.priyono@gmail.com'
);

-- Verifikasi perubahan
SELECT 
  au.email,
  up.role,
  up.updated_at
FROM auth.users au
JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email = 'ajuz.priyono@gmail.com';

-- Jika user belum memiliki profile, buat profile baru dengan role admin
INSERT INTO public.user_profiles (user_id, role, created_at, updated_at)
SELECT 
  au.id,
  'admin',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'ajuz.priyono@gmail.com'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.user_profiles up 
    WHERE up.user_id = au.id
  );

-- Verifikasi final - tampilkan semua admin
SELECT 
  au.email,
  up.role,
  up.created_at,
  up.updated_at
FROM auth.users au
JOIN public.user_profiles up ON au.id = up.user_id
WHERE up.role = 'admin'
ORDER BY up.created_at;