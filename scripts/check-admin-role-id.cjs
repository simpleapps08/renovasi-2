const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminRoleId() {
  console.log('🔍 Finding Admin Role ID...');
  console.log('=' .repeat(50));
  
  try {
    // Get all roles to find admin role
    console.log('\n1. Checking all available roles...');
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .order('role_level', { ascending: false });
    
    if (roleError) {
      console.error('❌ Error querying user_roles:', roleError.message);
      return;
    }
    
    if (roles && roles.length > 0) {
      console.log('✅ Available roles:');
      let adminRoleId = null;
      
      roles.forEach(role => {
        const roleName = role.role_name || 'Unknown';
        const roleLevel = role.role_level || 0;
        const isActive = role.is_active ? '✅' : '❌';
        
        console.log(`   ${isActive} ID: ${role.id}`);
        console.log(`      Name: ${roleName}`);
        console.log(`      Level: ${roleLevel}`);
        console.log(`      Description: ${role.description || 'No description'}`);
        console.log('');
        
        // Look for admin role
        if (roleName.toLowerCase().includes('admin') || roleLevel >= 90) {
          adminRoleId = role.id;
          console.log(`   🎯 ADMIN ROLE FOUND: ${role.id}`);
        }
      });
      
      if (adminRoleId) {
        console.log(`\n✅ Admin Role ID: ${adminRoleId}`);
      } else {
        console.log('\n⚠️  No admin role found. You may need to create one.');
        console.log('\n📝 SQL to create admin role:');
        console.log(`INSERT INTO user_roles (role_name, role_level, description, is_active)`);
        console.log(`VALUES ('admin', 100, 'Administrator with full access', true);`);
      }
      
    } else {
      console.log('⚠️  No roles found in user_roles table');
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📋 ADMIN USER CREATION GUIDE:');
    console.log('\n🔐 Step 1: Create Auth User');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Click "Add user"');
    console.log('3. Email: admin1@servisoo.com');
    console.log('4. Password: [create a strong password]');
    console.log('5. Click "Create user"');
    console.log('6. Copy the User ID from the created user');
    
    console.log('\n👤 Step 2: Create User Profile');
    console.log('1. Go to Supabase Dashboard > Table Editor > user_profiles');
    console.log('2. Click "Insert" > "Insert row"');
    console.log('3. Fill in:');
    console.log('   - id: [paste the User ID from Step 1]');
    console.log('   - full_name: "Administrator"');
    if (roles && roles.length > 0) {
      const adminRole = roles.find(r => r.role_name && r.role_name.toLowerCase().includes('admin'));
      if (adminRole) {
        console.log(`   - role_id: ${adminRole.id}`);
      } else {
        console.log(`   - role_id: [use the highest level role ID, or create admin role first]`);
      }
    }
    console.log('4. Click "Save"');
    
    console.log('\n🧪 Step 3: Test Login');
    console.log('1. Go to: http://localhost:8080/admin/login');
    console.log('2. Enter admin1@servisoo.com and password');
    console.log('3. Should redirect to /admin dashboard');
    
    console.log('\n🔧 Troubleshooting:');
    console.log('- If login fails: Check user_profiles has correct role_id');
    console.log('- If access denied: Verify role_name is "admin" in user_roles');
    console.log('- If redirect fails: Check browser console for errors');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkAdminRoleId();