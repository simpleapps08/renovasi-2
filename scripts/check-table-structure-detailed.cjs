const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Checking Table Structure in Detail...');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Check user_profiles table structure
    console.log('\n1. Testing user_profiles table basic structure...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.error('❌ Error querying user_profiles:', profileError.message);
    } else {
      console.log('✅ user_profiles table accessible');
      if (profiles && profiles.length > 0) {
        console.log('   Sample columns:', Object.keys(profiles[0]));
      } else {
        console.log('   Table is empty');
      }
    }
    
    // Test 2: Check user_roles table structure
    console.log('\n2. Testing user_roles table structure...');
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(5);
    
    if (roleError) {
      console.error('❌ Error querying user_roles:', roleError.message);
    } else {
      console.log('✅ user_roles table accessible');
      if (roles && roles.length > 0) {
        console.log('   Sample columns:', Object.keys(roles[0]));
        console.log('   Available roles:');
        roles.forEach(role => {
          console.log(`     - ID: ${role.id}, Name: ${role.name}, Level: ${role.level}`);
        });
      } else {
        console.log('   Table is empty');
      }
    }
    
    // Test 3: Try different join syntaxes
    console.log('\n3. Testing different join syntaxes...');
    
    // Try syntax 1: user_roles!inner
    console.log('\n   Testing: user_roles!inner(name, level)');
    const { data: test1, error: error1 } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        user_roles!inner(name, level)
      `)
      .limit(1);
    
    if (error1) {
      console.error('   ❌ Error:', error1.message);
    } else {
      console.log('   ✅ Success with user_roles!inner');
    }
    
    // Try syntax 2: user_roles!role_id
    console.log('\n   Testing: user_roles!role_id(name, level)');
    const { data: test2, error: error2 } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        user_roles!role_id(name, level)
      `)
      .limit(1);
    
    if (error2) {
      console.error('   ❌ Error:', error2.message);
    } else {
      console.log('   ✅ Success with user_roles!role_id');
    }
    
    // Try syntax 3: user_roles(*)
    console.log('\n   Testing: user_roles(*)');
    const { data: test3, error: error3 } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        user_roles(*)
      `)
      .limit(1);
    
    if (error3) {
      console.error('   ❌ Error:', error3.message);
    } else {
      console.log('   ✅ Success with user_roles(*)');
    }
    
    // Test 4: Check foreign key relationship
    console.log('\n4. Checking foreign key relationship...');
    const { data: profilesWithRoles, error: fkError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id
      `);
    
    if (fkError) {
      console.error('❌ Error querying profiles:', fkError.message);
    } else if (profilesWithRoles && profilesWithRoles.length > 0) {
      console.log('✅ Found profiles with role_id:');
      profilesWithRoles.forEach(profile => {
        console.log(`   - ${profile.full_name || 'No name'}: role_id = ${profile.role_id}`);
      });
    } else {
      console.log('⚠️  No profiles found');
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📋 DIAGNOSIS COMPLETE');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkTableStructure();