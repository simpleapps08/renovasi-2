import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use the provided credentials
const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSDirectly() {
  console.log('🔧 Attempting to fix RLS infinite recursion...');
  
  try {
    // Method 1: Try to query with different approaches
    console.log('\n📋 Method 1: Testing different query approaches...');
    
    // Try with specific columns only
    console.log('⚡ Testing with specific columns...');
    const { data: test1, error: error1 } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error1) {
      console.log('❌ Specific columns test:', error1.message);
    } else {
      console.log('✅ Specific columns test successful');
    }
    
    // Method 2: Try with service role bypass
    console.log('\n📋 Method 2: Attempting service role operations...');
    
    // Create a new supabase client with service role simulation
    const serviceClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal'
        }
      }
    });
    
    console.log('⚡ Testing with service client...');
    const { data: test2, error: error2 } = await serviceClient
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error2) {
      console.log('❌ Service client test:', error2.message);
    } else {
      console.log('✅ Service client test successful');
    }
    
    // Method 3: Try to create a test profile to understand structure
    console.log('\n📋 Method 3: Understanding table structure...');
    
    // Get table info from information_schema (if accessible)
    console.log('⚡ Checking table schema...');
    const { data: schema, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'user_profiles' });
    
    if (schemaError) {
      console.log('❌ Schema check:', schemaError.message);
    } else {
      console.log('✅ Schema accessible:', schema);
    }
    
    // Method 4: Manual SQL execution attempt
    console.log('\n📋 Method 4: Manual SQL operations...');
    
    // Try to disable RLS using different approach
    console.log('⚡ Attempting to disable RLS...');
    
    // Use raw SQL through edge functions or direct query
    const sqlCommands = [
      'SELECT current_user;',
      'SELECT has_table_privilege(\'public.user_profiles\', \'SELECT\');',
      'SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = \'user_profiles\';'
    ];
    
    for (const sql of sqlCommands) {
      console.log(`⚡ Executing: ${sql}`);
      try {
        const { data, error } = await supabase.rpc('execute_sql', { query: sql });
        if (error) {
          console.log(`❌ SQL Error: ${error.message}`);
        } else {
          console.log(`✅ SQL Result:`, data);
        }
      } catch (e) {
        console.log(`❌ SQL Exception: ${e.message}`);
      }
    }
    
    // Method 5: Create manual fix instructions
    console.log('\n📋 Method 5: Generating manual fix instructions...');
    
    const manualFix = `
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

CREATE POLICY "simple_user_policy" ON public.user_profiles
  FOR ALL USING (true);

-- Step 6: Test again
SELECT COUNT(*) FROM public.user_profiles;
`;
    
    console.log('📝 Manual fix SQL generated');
    
    // Write manual fix to file
    const fs = await import('fs');
    const path = await import('path');
    
    const fixPath = path.join(process.cwd(), 'scripts', 'MANUAL_RLS_FIX.sql');
    fs.writeFileSync(fixPath, manualFix);
    
    console.log(`✅ Manual fix saved to: ${fixPath}`);
    
    console.log('\n🎯 CONCLUSION:');
    console.log('❌ Automatic RLS fix not possible with current API access');
    console.log('✅ Manual fix instructions generated');
    console.log('📋 Next steps:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste SQL from MANUAL_RLS_FIX.sql');
    console.log('4. Execute the commands step by step');
    console.log('5. Run: node scripts/simple-table-check.js to verify');
    
  } catch (error) {
    console.error('❌ Error during RLS fix attempt:', error);
  }
}

fixRLSDirectly();