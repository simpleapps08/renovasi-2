import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  try {
    console.log('🔍 Checking current table structures...');
    
    // Test user_profiles table
    console.log('\n📋 Testing user_profiles table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ user_profiles error:', profilesError.message);
    } else {
      console.log('✅ user_profiles accessible');
      console.log('📊 Current profiles count:', profiles?.length || 0);
      if (profiles && profiles.length > 0) {
        console.log('🔍 Sample profile structure:');
        console.log(Object.keys(profiles[0]));
      }
    }
    
    // Test user_roles table
    console.log('\n📋 Testing user_roles table:');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(5);
    
    if (rolesError) {
      console.log('❌ user_roles error:', rolesError.message);
    } else {
      console.log('✅ user_roles accessible');
      console.log('📊 Available roles:', roles?.length || 0);
      if (roles && roles.length > 0) {
        console.log('🔍 Roles structure:');
        console.log(Object.keys(roles[0]));
        console.log('📝 Available roles:');
        roles.forEach(role => {
          console.log(`  - ${role.name} (level: ${role.role_level})`);
        });
      }
    }
    
    // Test insert to identify column issues
    console.log('\n🧪 Testing insert to identify column structure...');
    
    // Try to insert with different column names to see what works
    const testInserts = [
      { id: '00000000-0000-0000-0000-000000000001', full_name: 'Test User 1' },
      { user_id: '00000000-0000-0000-0000-000000000002', full_name: 'Test User 2' }
    ];
    
    for (let i = 0; i < testInserts.length; i++) {
      const testData = testInserts[i];
      const columnType = Object.keys(testData)[0]; // 'id' or 'user_id'
      
      console.log(`\n🔬 Testing insert with '${columnType}' column:`);
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(testData)
        .select();
      
      if (error) {
        console.log(`❌ Insert with '${columnType}' failed:`, error.message);
      } else {
        console.log(`✅ Insert with '${columnType}' succeeded`);
        // Clean up test data
        await supabase
          .from('user_profiles')
          .delete()
          .eq(columnType, testData[columnType]);
      }
    }
    
    console.log('\n📋 DIAGNOSIS SUMMARY:');
    console.log('='.repeat(50));
    console.log('1. Check the error messages above to identify:');
    console.log('   - Whether user_profiles uses "id" or "user_id" column');
    console.log('   - What columns are missing');
    console.log('   - Any constraint violations');
    console.log('\n2. Based on the results, you need to manually run SQL in Supabase Dashboard:');
    console.log('   - Go to Supabase Dashboard > SQL Editor');
    console.log('   - Run the SQL commands from fix-user-profiles-structure.sql');
    console.log('   - Adjust column names based on the test results above');
    
  } catch (error) {
    console.error('❌ Error during structure check:', error);
  }
}

checkTableStructure();