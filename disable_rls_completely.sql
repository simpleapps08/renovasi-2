-- EMERGENCY: COMPLETELY DISABLE RLS FOR TESTING
-- This removes ALL security restrictions - USE ONLY FOR TESTING

-- Step 1: Disable RLS completely
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies with force
DROP POLICY IF EXISTS "allow_all_authenticated" ON profiles;
DROP POLICY IF EXISTS "allow_anon_select" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- Step 3: Grant ALL permissions to everyone
GRANT ALL ON profiles TO public;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;

-- Step 4: Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED ❌'
        ELSE 'RLS DISABLED ✅'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'profiles';

-- Step 5: Show current policies (should be empty)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

SELECT 'RLS completely disabled - all restrictions removed' as status;