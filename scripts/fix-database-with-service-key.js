import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use service key for admin operations
const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixDatabaseStructure() {
  console.log('🔧 Starting database structure fix with service key...');
  
  try {
    // Step 1: Fix RLS Infinite Recursion
    console.log('\n📋 Step 1: Fixing RLS Infinite Recursion...');
    
    // Disable RLS temporarily
    console.log('⚡ Disabling RLS on user_profiles...');
    const { error: disableRlsError } = await supabase.rpc('sql', {
      query: 'ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableRlsError) {
      console.log('⚠️  Disable RLS result:', disableRlsError.message);
    } else {
      console.log('✅ RLS disabled successfully');
    }
    
    // Step 2: Fix user_roles table (update role names)
    console.log('\n📋 Step 2: Fixing user_roles table...');
    
    const roleUpdates = [
      { level: 1, name: 'user', description: 'Regular user with basic access' },
      { level: 2, name: 'editor', description: 'Editor with content management access' },
      { level: 3, name: 'manager', description: 'Manager with team management access' },
      { level: 4, name: 'admin', description: 'Administrator with full system access' },
      { level: 5, name: 'super_admin', description: 'Super administrator with complete control' }
    ];
    
    for (const role of roleUpdates) {
      console.log(`⚡ Updating role level ${role.level} to '${role.name}'...`);
      
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ 
          role_name: role.name,
          description: role.description
        })
        .eq('role_level', role.level);
      
      if (updateError) {
        console.log(`⚠️  Update role ${role.level} result:`, updateError.message);
      } else {
        console.log(`✅ Role level ${role.level} updated to '${role.name}'`);
      }
    }
    
    // Step 3: Test table access
    console.log('\n📋 Step 3: Testing table access...');
    
    // Test user_profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('⚠️  user_profiles test result:', profilesError.message);
    } else {
      console.log('✅ user_profiles table accessible');
      console.log(`📊 Current profiles count: ${profiles?.length || 0}`);
    }
    
    // Test user_roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .order('role_level');
    
    if (rolesError) {
      console.log('⚠️  user_roles test result:', rolesError.message);
    } else {
      console.log('✅ user_roles table accessible');
      console.log('📝 Updated roles:');
      roles?.forEach(role => {
        console.log(`  - ${role.role_name} (level: ${role.role_level})`);
      });
    }
    
    // Step 4: Create simple RLS policies
    console.log('\n📋 Step 4: Creating simple RLS policies...');
    
    // Enable RLS back
    console.log('⚡ Re-enabling RLS on user_profiles...');
    const { error: enableRlsError } = await supabase.rpc('sql', {
      query: 'ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;'
    });
    
    if (enableRlsError) {
      console.log('⚠️  Enable RLS result:', enableRlsError.message);
    } else {
      console.log('✅ RLS re-enabled successfully');
    }
    
    // Create simple policy for authenticated users
    console.log('⚡ Creating simple RLS policy...');
    const { error: policyError } = await supabase.rpc('sql', {
      query: `
        CREATE POLICY "Allow authenticated users" ON public.user_profiles
        FOR ALL USING (auth.uid() = id);
      `
    });
    
    if (policyError) {
      console.log('⚠️  Create policy result:', policyError.message);
    } else {
      console.log('✅ Simple RLS policy created');
    }
    
    console.log('\n🎉 Database structure fix completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node scripts/simple-table-check.js');
    console.log('2. Create admin user if tables are working');
    console.log('3. Test login functionality');
    
  } catch (error) {
    console.error('❌ Error during database fix:', error);
    process.exit(1);
  }
}

fixDatabaseStructure();