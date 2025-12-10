-- Fix Foreign Key Issues and Database Structure
-- Run this in Supabase Dashboard SQL Editor

-- 1. Check current users table structure
SELECT 'Current users table:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- 2. Check if we have any users in the users table
SELECT 'Current users count:' as info;
SELECT COUNT(*) as user_count FROM auth.users;

-- 3. Create a test user in auth.users if needed (for testing)
-- Note: This is just for testing purposes
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'test@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 4. Also create entry in public.users if that table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        INSERT INTO public.users (id, email, created_at, updated_at)
        VALUES (
            '550e8400-e29b-41d4-a716-446655440000',
            'test@example.com',
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- 5. Check foreign key constraints on profiles table
SELECT 'Foreign key constraints on profiles:' as info;
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'profiles'
    AND tc.table_schema = 'public';

-- 6. Temporarily disable foreign key constraint for testing (DANGEROUS - only for testing)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 7. Add a more flexible foreign key constraint that references auth.users
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. Verify the changes
SELECT 'Verification - profiles table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Test insert should now work
SELECT 'Testing insert capability:' as info;
INSERT INTO public.profiles (
    id,
    user_id,
    nama,
    email,
    role
) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'Test User',
    'test@example.com',
    'user'
) ON CONFLICT (user_id) DO UPDATE SET
    nama = EXCLUDED.nama,
    email = EXCLUDED.email;

SELECT 'Insert test completed successfully!' as result;