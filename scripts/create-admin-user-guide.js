import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function createAdminUserGuide() {
  console.log('=== ADMIN USER CREATION GUIDE ===\n');
  
  try {
    // Step 1: Check if admin role exists
    console.log('Step 1: Checking admin role...');
    const { data: adminRole, error: roleError } = await supabase
      .from('user_roles')
      .select('id, role_name, role_level')
      .eq('role_level', 4)
      .single();
    
    if (roleError) {
      console.error('❌ Error checking admin role:', roleError.message);
      console.log('\n⚠️  Please run the SQL fixes from MANUAL_TABLE_FIX_GUIDE.md first!');
      return;
    }
    
    if (adminRole) {
      console.log('✅ Admin role found:', adminRole);
    } else {
      console.log('❌ Admin role not found. Please create it first.');
      return;
    }
    
    // Step 2: Check current user_profiles structure
    console.log('\nStep 2: Checking user_profiles structure...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('❌ Cannot access user_profiles:', profileError.message);
      console.log('\n⚠️  RLS infinite recursion issue still exists. Please fix it first!');
      return;
    }
    
    console.log('✅ user_profiles table is accessible');
    
    // Step 3: Provide manual instructions
    console.log('\n=== MANUAL STEPS REQUIRED ===\n');
    
    console.log('🔹 Step 3a: Create Auth User in Supabase Dashboard');
    console.log('   1. Go to Supabase Dashboard > Authentication > Users');
    console.log('   2. Click "Add User"');
    console.log('   3. Email: admin@servisoo.com');
    console.log('   4. Password: [Choose a secure password]');
    console.log('   5. Click "Create User"');
    console.log('   6. Copy the User ID from the created user\n');
    
    console.log('🔹 Step 3b: Create User Profile via SQL Editor');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Paste and run this SQL (replace USER_ID_HERE with actual ID):\n');
    
    const sqlTemplate = `-- Get admin role ID first
SELECT id, role_name FROM public.user_roles WHERE role_level = 4;

-- Insert admin profile (replace USER_ID_HERE with actual auth.users ID)
INSERT INTO public.user_profiles (id, full_name, role_id, created_at, updated_at)
VALUES (
  'USER_ID_HERE', -- Replace with actual auth.users ID
  'Admin User',
  '${adminRole.id}', -- Admin role ID
  NOW(),
  NOW()
);

-- Verify the creation
SELECT 
  up.id,
  up.full_name,
  ur.role_name,
  ur.role_level
FROM public.user_profiles up
JOIN public.user_roles ur ON up.role_id = ur.id
WHERE up.id = 'USER_ID_HERE';`;
    
    console.log(sqlTemplate);
    
    console.log('\n🔹 Step 3c: Test Admin Login');
    console.log('   1. Go to your application login page');
    console.log('   2. Login with admin@servisoo.com');
    console.log('   3. Verify admin dashboard access');
    
    console.log('\n=== VERIFICATION ===\n');
    console.log('After creating the admin user, run this script again to verify.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the guide
createAdminUserGuide();