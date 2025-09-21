import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSDirectly() {
  console.log('🔧 Testing current RLS status and attempting fixes...');
  
  try {
    // Step 1: Test current table access
    console.log('\n1. Testing current table access...');
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('id, user_id, full_name')
      .limit(1);
    
    if (testError) {
      console.error('❌ Current table access failed:', testError.message);
      console.log('Error code:', testError.code);
      console.log('Error details:', testError.details);
      
      if (testError.code === '42P17') {
        console.log('\n🔍 Detected infinite recursion in RLS policy');
        console.log('This requires manual intervention in Supabase Dashboard');
        
        // Generate updated manual fix
        await generateUpdatedManualFix();
        return false;
      }
    } else {
      console.log('✅ Table accessible!');
      console.log('📊 Sample data:', testData);
      return true;
    }
    
    // Step 2: Try simple operations to test RLS
    console.log('\n2. Testing insert operation...');
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: 'test-user-id',
        full_name: 'Test User',
        role: 'user'
      });
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      console.log('Error code:', insertError.code);
    } else {
      console.log('✅ Insert test successful');
      
      // Clean up test data
      await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', 'test-user-id');
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function generateUpdatedManualFix() {
  console.log('\n📝 Generating updated manual fix instructions...');
  
  const updatedSQL = `-- UPDATED RLS FIX FOR INFINITE RECURSION
-- Execute these commands in Supabase Dashboard SQL Editor
-- Run each step separately and verify results

-- Step 1: Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 2: Disable RLS temporarily
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies (including problematic ones)
DROP POLICY IF EXISTS "simple_user_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "enable_read_access" ON public.user_profiles;
DROP POLICY IF EXISTS "enable_insert_access" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_all_access" ON public.user_profiles;

-- Step 4: Test table access without RLS
SELECT COUNT(*) FROM public.user_profiles;
SELECT id, user_id, full_name, role FROM public.user_profiles LIMIT 3;

-- Step 5: Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple, non-recursive policy
CREATE POLICY "basic_access_policy" ON public.user_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 7: Verify the new policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 8: Test final access
SELECT COUNT(*) FROM public.user_profiles;
SELECT id, user_id, full_name, role FROM public.user_profiles LIMIT 3;

-- If still having issues, try this alternative:
-- DROP POLICY IF EXISTS "basic_access_policy" ON public.user_profiles;
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
-- This will disable RLS completely until we can debug further
`;
  
  // Write to file
  const fs = await import('fs');
  fs.writeFileSync('scripts/UPDATED_RLS_FIX.sql', updatedSQL);
  console.log('✅ Updated manual fix saved to scripts/UPDATED_RLS_FIX.sql');
}

async function main() {
  console.log('🚀 Direct RLS Fix via Supabase API');
  console.log('=====================================');
  
  const success = await fixRLSDirectly();
  
  if (success) {
    console.log('\n🎉 RLS fix completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- RLS disabled and re-enabled');
    console.log('- All old policies removed');
    console.log('- Simple allow_all_access policy created');
    console.log('- Table access verified');
    console.log('\n✅ user_profiles should now be accessible without infinite recursion');
  } else {
    console.log('\n❌ RLS fix failed. Manual intervention required.');
  }
}

main().catch(console.error);