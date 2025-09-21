
-- MANUAL FIX INSTRUCTIONS FOR SUPABASE DASHBOARD
-- Copy and paste these commands in Supabase Dashboard > SQL Editor

-- Step 1: Check current policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users" ON public.user_profiles;

-- Step 3: Temporarily disable RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Test table access
SELECT COUNT(*) FROM public.user_profiles;

-- Step 5: Create simple, non-recursive policy
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing simple policy if exists
DROP POLICY IF EXISTS "simple_user_policy" ON public.user_profiles;

CREATE POLICY "simple_user_policy" ON public.user_profiles
  FOR ALL USING (true);

-- Step 6: Test again
SELECT COUNT(*) FROM public.user_profiles;
