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

async function checkTableStructure() {
  console.log('🔍 Checking FINAL table structure...');
  console.log(`📊 Project ID: ${supabaseUrl.split('//')[1].split('.')[0]}`);
  console.log('');

  try {
    // 1. Check user_profiles structure
    console.log('1️⃣ Checking user_profiles table structure...');
    const { data: profilesStructure, error: profilesError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            column_name, 
            data_type, 
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
            AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    if (profilesError) {
      console.log('⚠️  Cannot use exec_sql function, trying direct query...');
      
      // Try direct query to see what columns exist
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.log('❌ Error querying user_profiles:', testError.message);
      } else {
        console.log('✅ user_profiles table accessible');
        console.log('📋 Sample data structure:', testData.length > 0 ? Object.keys(testData[0]) : 'No data, but table exists');
      }
    } else {
      console.log('✅ user_profiles structure:');
      console.table(profilesStructure);
    }

    // 2. Check user_roles structure
    console.log('\n2️⃣ Checking user_roles table...');
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .order('hierarchy_level');

    if (rolesError) {
      console.log('❌ Error accessing user_roles:', rolesError.message);
    } else {
      console.log('✅ user_roles table accessible');
      console.log(`📊 Found ${rolesData.length} roles:`);
      rolesData.forEach(role => {
        console.log(`   - ${role.role_name} (level: ${role.hierarchy_level})`);
      });
    }

    // 3. Test insert with correct structure
    console.log('\n3️⃣ Testing insert with correct column names...');
    
    // Get admin role ID
    const adminRole = rolesData?.find(role => role.role_name === 'admin');
    if (!adminRole) {
      console.log('❌ Admin role not found');
      return;
    }

    // Test insert (this will likely fail due to RLS, but we can see the error)
    const testUserId = '00000000-0000-0000-0000-000000000001'; // Fake UUID for testing
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,  // Using 'id' not 'user_id'
        full_name: 'Test Admin User',
        role_id: adminRole.id
      })
      .select();

    if (insertError) {
      console.log('⚠️  Insert test error (expected due to RLS):');
      console.log('   Error:', insertError.message);
      console.log('   Code:', insertError.code);
      
      if (insertError.message.includes('user_id')) {
        console.log('\n🚨 PROBLEM: Error still mentions user_id column!');
        console.log('   This means table structure is still wrong.');
      } else if (insertError.message.includes('row-level security')) {
        console.log('\n✅ GOOD: Error is about RLS, not column structure');
        console.log('   This means table structure is correct.');
      } else {
        console.log('\n❓ UNKNOWN: Different error type');
      }
    } else {
      console.log('✅ Insert successful:', insertData);
    }

    // 4. Check auth.users structure
    console.log('\n4️⃣ Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(3);

    if (authError) {
      console.log('⚠️  Cannot access auth.users directly:', authError.message);
    } else {
      console.log('✅ auth.users accessible');
      console.log(`📊 Found ${authUsers.length} auth users`);
      authUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY:');
  console.log('1. Check table structure above');
  console.log('2. If error mentions "user_id", table structure is wrong');
  console.log('3. If error is about RLS, table structure is correct');
  console.log('4. Use Supabase Dashboard SQL Editor for manual fixes');
  console.log('='.repeat(60));
}

checkTableStructure();