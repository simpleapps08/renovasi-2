import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleTableCheck() {
  console.log('🔍 Simple table structure check...');
  console.log(`📊 Project ID: ${supabaseUrl.split('//')[1].split('.')[0]}`);
  console.log('');

  try {
    // 1. Check user_roles first (simpler table)
    console.log('1️⃣ Checking user_roles table...');
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(5);

    if (rolesError) {
      console.log('❌ Error accessing user_roles:', rolesError.message);
      console.log('   Code:', rolesError.code);
    } else {
      console.log('✅ user_roles table accessible');
      console.log(`📊 Found ${rolesData.length} roles:`);
      if (rolesData.length > 0) {
        console.log('📋 Columns in user_roles:', Object.keys(rolesData[0]));
        rolesData.forEach(role => {
          console.log(`   - ID: ${role.id}, Name: ${role.role_name || 'N/A'}`);
        });
      }
    }

    // 2. Try to access user_profiles with minimal query
    console.log('\n2️⃣ Checking user_profiles table (minimal query)...');
    
    // First, try to get count
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error getting user_profiles count:', countError.message);
      console.log('   Code:', countError.code);
      
      if (countError.message.includes('infinite recursion')) {
        console.log('\n🚨 PROBLEM: Infinite recursion in RLS policy!');
        console.log('   This means RLS policies are incorrectly configured.');
        console.log('   Need to fix RLS policies in Supabase Dashboard.');
      }
    } else {
      console.log(`✅ user_profiles count: ${count}`);
    }

    // 3. Test simple insert to see column structure error
    console.log('\n3️⃣ Testing insert to understand column structure...');
    
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        full_name: 'Test User'
      })
      .select();

    if (insertError) {
      console.log('⚠️  Insert error (this helps us understand structure):');
      console.log('   Error:', insertError.message);
      console.log('   Code:', insertError.code);
      
      if (insertError.message.includes('user_id')) {
        console.log('\n🚨 CONFIRMED: Table still has user_id column issue!');
      } else if (insertError.message.includes('infinite recursion')) {
        console.log('\n🚨 CONFIRMED: RLS policy has infinite recursion!');
      } else if (insertError.message.includes('row-level security')) {
        console.log('\n✅ GOOD: Normal RLS error, structure seems OK');
      } else {
        console.log('\n❓ Different error type');
      }
    } else {
      console.log('✅ Insert successful (unexpected):', insertData);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 DIAGNOSIS SUMMARY:');
  console.log('1. If user_roles fails: Table structure issue');
  console.log('2. If user_profiles has "infinite recursion": RLS policy issue');
  console.log('3. If insert mentions "user_id": Column structure issue');
  console.log('4. Manual fix needed in Supabase Dashboard SQL Editor');
  console.log('='.repeat(60));
}

simpleTableCheck();