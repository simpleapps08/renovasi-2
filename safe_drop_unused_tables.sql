-- Script aman untuk menghapus tabel user_profiles dan user_roles
-- Script ini akan memeriksa keberadaan tabel sebelum mencoba menghapusnya

-- Periksa status tabel saat ini
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') 
    THEN 'Ada - akan dihapus' 
    ELSE 'Sudah tidak ada' 
  END as status_user_profiles,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') 
    THEN 'Ada - akan dihapus' 
    ELSE 'Sudah tidak ada' 
  END as status_user_roles;

-- Hanya jalankan DROP jika tabel masih ada
DO $$
BEGIN
    -- Drop user_profiles jika ada
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        -- Drop constraints terlebih dahulu
        EXECUTE 'ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS fk_user_profiles_role';
        EXECUTE 'ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_id_fkey';
        
        -- Drop policies
        EXECUTE 'DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admin can view all user profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admin can update all user profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admin can delete all user profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admin can insert user profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "simple_user_policy" ON public.user_profiles';
        EXECUTE 'DROP POLICY IF EXISTS "basic_access_policy" ON public.user_profiles';
        
        -- Drop triggers
        EXECUTE 'DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles';
        EXECUTE 'DROP TRIGGER IF EXISTS sync_user_profile_data_trigger ON public.user_profiles';
        EXECUTE 'DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.user_profiles';
        
        -- Drop indexes
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_user_id';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_full_name';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_is_active';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_last_login';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_role';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_profiles_role_id';
        
        -- Drop table
        EXECUTE 'DROP TABLE IF EXISTS public.user_profiles CASCADE';
        
        RAISE NOTICE 'Tabel user_profiles berhasil dihapus';
    ELSE
        RAISE NOTICE 'Tabel user_profiles sudah tidak ada';
    END IF;
    
    -- Drop user_roles jika ada
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        -- Drop policies
        EXECUTE 'DROP POLICY IF EXISTS "Everyone can view active roles" ON public.user_roles';
        EXECUTE 'DROP POLICY IF EXISTS "Only super_admin can manage roles" ON public.user_roles';
        
        -- Drop triggers
        EXECUTE 'DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles';
        
        -- Drop indexes
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_roles_name';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_roles_level';
        EXECUTE 'DROP INDEX IF EXISTS public.idx_user_roles_active';
        
        -- Drop table
        EXECUTE 'DROP TABLE IF EXISTS public.user_roles CASCADE';
        
        RAISE NOTICE 'Tabel user_roles berhasil dihapus';
    ELSE
        RAISE NOTICE 'Tabel user_roles sudah tidak ada';
    END IF;
END $$;

-- Drop functions yang terkait (aman untuk dijalankan meskipun tidak ada)
DROP FUNCTION IF EXISTS public.sync_user_profile_data();
DROP FUNCTION IF EXISTS public.update_user_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.create_admin_user_profile(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_user_role_level();
DROP FUNCTION IF EXISTS public.update_user_roles_updated_at();

-- Verifikasi hasil akhir
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

-- Verifikasi bahwa tabel profiles masih ada dan berfungsi
SELECT 'Verifikasi tabel profiles:' as info;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT DISTINCT role FROM public.profiles WHERE role IS NOT NULL;

SELECT 'Pembersihan database selesai!' as status_final;