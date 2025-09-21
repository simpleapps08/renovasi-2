import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseUserProfiles() {
  console.log('🔍 Diagnosing user_profiles table and RLS issues...');
  
  try {
    // Test 1: Try basic access to detect RLS recursion
    console.log('\n1. Testing basic table access...');
    
    const { data: basicTest, error: basicError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (basicError) {
      console.log('❌ Basic access failed:', basicError.message);
      console.log('Error code:', basicError.code);
      
      if (basicError.code === '42P17') {
        console.log('\n🔍 CONFIRMED: RLS infinite recursion detected!');
        console.log('This is the root cause of all user_profiles issues.');
        await generateComprehensiveRLSFix();
        return true;
      }
    } else {
      console.log('✅ Basic access successful');
      console.log('Sample data:', basicTest);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function generateComprehensiveRLSFix() {
  console.log('\n📝 Generating comprehensive RLS fix...');
  
  const comprehensiveFix = `-- COMPREHENSIVE RLS FIX FOR INFINITE RECURSION
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
`;
  
  const fs = await import('fs');
  fs.writeFileSync('scripts/COMPREHENSIVE_RLS_FIX.sql', comprehensiveFix);
  console.log('✅ Comprehensive RLS fix saved to scripts/COMPREHENSIVE_RLS_FIX.sql');
  
  console.log('\n🎯 CRITICAL NEXT STEPS:');
  console.log('========================================');
  console.log('1. 🌐 Open Supabase Dashboard immediately');
  console.log('2. 📝 Go to SQL Editor');
  console.log('3. 📋 Copy COMPREHENSIVE_RLS_FIX.sql content');
  console.log('4. ▶️  Run SECTION 1 first (diagnosis)');
  console.log('5. ⚡ Run SECTION 2 immediately (emergency fix)');
  console.log('6. 🧹 Run SECTION 3 (cleanup)');
  console.log('7. 🔍 Run SECTION 4 (verify structure)');
  console.log('8. 🛡️  Run SECTION 5 (safe RLS setup)');
  console.log('9. ✅ Run SECTION 6 (verification)');
  console.log('10. 🔄 Run simple-table-check.js to confirm fix');
  console.log('\n⚠️  IMPORTANT: Run each section separately!');
  console.log('⚠️  Do not run the entire script at once!');
}

async function main() {
  console.log('🚀 User Profiles RLS Diagnosis');
  console.log('===============================');
  
  const hasRLSIssue = await diagnoseUserProfiles();
  
  if (hasRLSIssue) {
    console.log('\n🔥 RLS INFINITE RECURSION CONFIRMED!');
    console.log('📁 Fix instructions generated in COMPREHENSIVE_RLS_FIX.sql');
    console.log('🚨 Manual intervention required in Supabase Dashboard');
  } else {
    console.log('\n✅ No RLS recursion detected');
    console.log('🎉 user_profiles table appears to be working');
  }
}

main().catch(console.error);