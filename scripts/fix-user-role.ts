import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tkqvozgorpapofejphyn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3MzY5MywiZXhwIjoyMDcxNjQ5NjkzfQ.KjF1-VQ38J8mlVjwOxW8_zGXoHhGCWu8wLNhx08-EXw";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserRole() {
  console.log('🔐 Starting user role fix...');
  console.log('📧 Looking for user: ajuz.priyono@gmail.com');
  
  try {
    // 1. Find user by email using auth admin API
    console.log('\n📡 Step 1: Finding user in auth.users...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error listing users:', authError);
      return;
    }
    
    const user = users?.find(u => u.email === 'ajuz.priyono@gmail.com');
    
    if (!user) {
      console.error('❌ User not found with email ajuz.priyono@gmail.com');
      console.log('📋 Available users:');
      users?.forEach(u => console.log(`  - ${u.email} (${u.id})`));
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    
    // 2. Check current profile
    console.log('\n📡 Step 2: Checking current profile in profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
      return;
    }
    
    console.log('✅ Current profile:');
    console.log(`   Role: ${profile?.role}`);
    console.log(`   Name: ${profile?.full_name}`);
    console.log(`   Created: ${profile?.created_at}`);
    
    // 3. Update role to super_admin
    if (profile?.role !== 'super_admin') {
      console.log('\n📡 Step 3: Updating role to super_admin...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('❌ Error updating role:', updateError);
        return;
      }
      
      console.log('✅ Role updated to super_admin');
    } else {
      console.log('\n✅ User already has super_admin role!');
    }
    
    // 4. Verify update
    console.log('\n📡 Step 4: Verifying update...');
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    console.log('✅ Verification:');
    console.log(`   Current role: ${updatedProfile?.role}`);
    
    console.log('\n✨ Fix complete! User ajuz.priyono@gmail.com is now super_admin');
    console.log('📝 User should log out and log back in to see the changes');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixUserRole();
