-- Script untuk menghapus tabel user_profiles dan user_roles yang tidak digunakan lagi
-- PERINGATAN: Pastikan semua data penting sudah dipindahkan ke tabel 'profiles'

-- 1. Drop foreign key constraints terlebih dahulu
ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS fk_user_profiles_role;
ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_id_fkey;

-- 2. Drop policies untuk user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can view all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can update all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can delete all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "simple_user_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "basic_access_policy" ON public.user_profiles;

-- 3. Drop policies untuk user_roles
DROP POLICY IF EXISTS "Everyone can view active roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only super_admin can manage roles" ON public.user_roles;

-- 4. Drop triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS sync_user_profile_data_trigger ON public.user_profiles;
DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.user_profiles;
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;

-- 5. Drop functions yang terkait
DROP FUNCTION IF EXISTS public.sync_user_profile_data();
DROP FUNCTION IF EXISTS public.update_user_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.create_admin_user_profile(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_user_role_level();
DROP FUNCTION IF EXISTS public.update_user_roles_updated_at();

-- 6. Drop indexes
DROP INDEX IF EXISTS public.idx_user_profiles_user_id;
DROP INDEX IF EXISTS public.idx_user_profiles_full_name;
DROP INDEX IF EXISTS public.idx_user_profiles_is_active;
DROP INDEX IF EXISTS public.idx_user_profiles_last_login;
DROP INDEX IF EXISTS public.idx_user_profiles_role;
DROP INDEX IF EXISTS public.idx_user_profiles_role_id;
DROP INDEX IF EXISTS public.idx_user_roles_name;
DROP INDEX IF EXISTS public.idx_user_roles_level;
DROP INDEX IF EXISTS public.idx_user_roles_active;

-- 7. Drop tables
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 8. Revoke permissions
REVOKE ALL ON public.user_profiles FROM authenticated;
REVOKE ALL ON public.user_profiles FROM service_role;
REVOKE ALL ON public.user_roles FROM authenticated;
REVOKE ALL ON public.user_roles FROM service_role;

-- Konfirmasi bahwa tabel sudah dihapus
SELECT 'Tabel user_profiles dan user_roles berhasil dihapus' as status;

-- Verifikasi bahwa tabel profiles masih ada dan berfungsi
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT DISTINCT role FROM public.profiles;

-- Verifikasi bahwa tabel user_profiles dan user_roles sudah tidak ada
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') 
    THEN 'PERINGATAN: Tabel user_profiles masih ada!' 
    ELSE 'OK: Tabel user_profiles sudah dihapus' 
  END as status_user_profiles,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') 
    THEN 'PERINGATAN: Tabel user_roles masih ada!' 
    ELSE 'OK: Tabel user_roles sudah dihapus' 
  END as status_user_roles;