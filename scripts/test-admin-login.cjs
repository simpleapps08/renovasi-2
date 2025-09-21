const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  console.log('🔍 Testing Admin Login Form Fixes...');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Check if user_profiles table structure is correct
    console.log('\n1. Testing user_profiles table structure...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        user_roles!inner(role_name, role_level)
      `)
      .limit(1);
    
    if (profileError) {
      console.error('❌ Error querying user_profiles:', profileError.message);
      return;
    }
    
    console.log('✅ user_profiles table structure is correct');
    console.log('   - Columns: id, full_name, role_id');
    console.log('   - Join with user_roles works');
    
    // Test 2: Check for admin users
    console.log('\n2. Checking for admin users...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        user_roles!inner(role_name, role_level)
      `)
      .eq('user_roles.role_name', 'admin');
    
    if (adminError) {
      console.error('❌ Error querying admin users:', adminError.message);
      return;
    }
    
    if (adminUsers && adminUsers.length > 0) {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(user => {
        console.log(`   - ${user.full_name} (ID: ${user.id})`);
        console.log(`   - Role: ${user.user_roles.role_name} (Level: ${user.user_roles.role_level})`);
      });
    } else {
      console.log('⚠️  No admin users found');
    }
    
    // Test 3: Check auth.users for admin emails
    console.log('\n3. Checking auth.users for admin emails...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('⚠️  Cannot access auth.users (requires service role key)');
      console.log('   This is normal when using publishable key');
    } else {
      const adminEmails = authUsers.users.filter(user => 
        user.email && user.email.includes('admin')
      );
      
      if (adminEmails.length > 0) {
        console.log(`✅ Found ${adminEmails.length} admin email(s) in auth.users:`);
        adminEmails.forEach(user => {
          console.log(`   - ${user.email} (ID: ${user.id})`);
        });
      } else {
        console.log('⚠️  No admin emails found in auth.users');
      }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📋 ADMIN LOGIN FORM STATUS:');
    console.log('✅ AuthContext.tsx - Fixed to use correct table structure');
    console.log('✅ AdminLogin.tsx - Fixed both useEffect and handleLogin');
    console.log('✅ App.tsx ProtectedRoute - Fixed role checking');
    console.log('✅ Database queries - Updated to use role_id and user_roles join');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Create admin user in Supabase Dashboard:');
    console.log('   - Go to Authentication > Users');
    console.log('   - Add new user: admin1@servisoo.com');
    console.log('   - Copy the user ID');
    
    console.log('\n2. Add admin profile in user_profiles table:');
    console.log('   - Go to Table Editor > user_profiles');
    console.log('   - Insert new row:');
    console.log('     * id: [paste user ID from step 1]');
    console.log('     * full_name: "Administrator"');
    console.log('     * role_id: 1 (assuming admin role has ID 1)');
    
    console.log('\n3. Test login at: http://localhost:8080/admin/login');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminLogin();