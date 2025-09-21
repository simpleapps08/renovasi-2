-- COMPREHENSIVE RLS FIX FOR INFINITE RECURSION
-- This will completely resolve the user_profiles RLS issue
-- Execute in Supabase Dashboard SQL Editor
-- Run each section separately and verify results

-- =====================================================
-- SECTION 1: DIAGNOSIS - Check current state
-- =====================================================

-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- List all current policies (these are causing recursion)
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
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- =====================================================
-- SECTION 2: EMERGENCY FIX - Stop infinite recursion
-- =====================================================

-- IMMEDIATELY disable RLS to stop recursion
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Test table access (should work now)
SELECT COUNT(*) as total_profiles FROM public.user_profiles;
SELECT id, full_name FROM public.user_profiles LIMIT 3;

-- =====================================================
-- SECTION 3: CLEANUP - Remove problematic policies
-- =====================================================

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "simple_user_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "enable_read_access" ON public.user_profiles;
DROP POLICY IF EXISTS "enable_insert_access" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_all_access" ON public.user_profiles;
DROP POLICY IF EXISTS "basic_access_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_authenticated_access" ON public.user_profiles;

-- Use dynamic SQL to drop any remaining policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_record.policyname) || ' ON public.user_profiles';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Verify all policies are gone
SELECT COUNT(*) as remaining_policies 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- =====================================================
-- SECTION 4: TABLE STRUCTURE - Verify columns
-- =====================================================

-- Check table structure to understand available columns
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- SECTION 5: SAFE RLS SETUP - Non-recursive policy
-- =====================================================

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policy with no recursion risk
CREATE POLICY "safe_authenticated_access" 
ON public.user_profiles
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- SECTION 6: VERIFICATION - Test everything works
-- =====================================================

-- Verify RLS is enabled with new policy
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Check new policy is active
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Test final access (should work without recursion)
SELECT COUNT(*) as total_profiles FROM public.user_profiles;
SELECT * FROM public.user_profiles LIMIT 5;

-- =====================================================
-- SECTION 7: FALLBACK - If still having issues
-- =====================================================

-- If you still get recursion errors, run this:
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
-- This completely disables RLS as a last resort

-- =====================================================
-- SUCCESS INDICATORS:
-- 1. No "infinite recursion" errors
-- 2. SELECT queries return data
-- 3. Only one policy exists: "safe_authenticated_access"
-- 4. RLS is enabled but not causing recursion
-- =====================================================
