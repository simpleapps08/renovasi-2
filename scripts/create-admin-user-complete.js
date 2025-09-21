import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 Membuat user admin dengan Supabase API...');
  console.log('📧 Email: admin@servisoo.com');
  console.log('🔑 Password: 09081982');
  
  try {
    // Step 1: Get admin role ID
    console.log('\n📋 Step 1: Mencari role admin...');
    const { data: adminRole, error: roleError } = await supabase
      .from('user_roles')
      .select('id, role_name, role_level')
      .eq('role_name', 'admin')
      .single();
    
    if (roleError || !adminRole) {
      console.error('❌ Admin role tidak ditemukan:', roleError?.message);
      return;
    }
    
    console.log('✅ Admin role ditemukan:', adminRole);
    
    // Step 2: Create user in auth.users using Admin API
    console.log('\n📋 Step 2: Membuat user di auth.users...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@servisoo.com',
      password: '09081982',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'System Administrator',
        role: 'admin'
      }
    });
    
    if (authError) {
      console.error('❌ Error membuat auth user:', authError.message);
      
      // If user already exists, try to get existing user
      if (authError.message.includes('already registered')) {
        console.log('💡 User sudah ada, mencoba mendapatkan user existing...');
        
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error('❌ Error mendapatkan user list:', listError.message);
          return;
        }
        
        const existingUser = existingUsers.users.find(u => u.email === 'admin@servisoo.com');
        if (existingUser) {
          console.log('✅ User existing ditemukan:', existingUser.id);
          
          // Update password for existing user
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: '09081982' }
          );
          
          if (updateError) {
            console.error('❌ Error update password:', updateError.message);
          } else {
            console.log('✅ Password berhasil diupdate');
          }
          
          // Use existing user for profile creation
          await createUserProfile(existingUser.id, adminRole.id);
          return;
        }
      }
      return;
    }
    
    console.log('✅ Auth user berhasil dibuat:', authUser.user.id);
    
    // Step 3: Create user profile
    await createUserProfile(authUser.user.id, adminRole.id);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function createUserProfile(userId, adminRoleId) {
  console.log('\n📋 Step 3: Membuat user profile...');
  
  // Check if profile already exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (existingProfile) {
    console.log('💡 Profile sudah ada, mengupdate role...');
    
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role_id: adminRoleId,
        full_name: 'System Administrator',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('❌ Error update profile:', updateError.message);
    } else {
      console.log('✅ Profile berhasil diupdate dengan role admin');
    }
  } else {
    // Create new profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: 'admin@servisoo.com',
        full_name: 'System Administrator',
        role_id: adminRoleId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('❌ Error membuat profile:', profileError.message);
    } else {
      console.log('✅ User profile berhasil dibuat dengan role admin');
    }
  }
  
  // Step 4: Verify admin user creation
  await verifyAdminUser();
}

async function verifyAdminUser() {
  console.log('\n📋 Step 4: Verifikasi user admin...');
  
  const { data: adminUsers, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
      email,
      full_name,
      created_at,
      user_roles (
        role_name,
        role_level,
        permissions
      )
    `)
    .eq('user_roles.role_name', 'admin');
  
  if (error) {
    console.error('❌ Error verifikasi:', error.message);
    return;
  }
  
  if (adminUsers && adminUsers.length > 0) {
    console.log('\n🎉 SUCCESS! User admin berhasil dibuat:');
    adminUsers.forEach(user => {
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.full_name}`);
      console.log(`   🎭 Role: ${user.user_roles?.role_name} (Level ${user.user_roles?.role_level})`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Created: ${user.created_at}`);
    });
    
    console.log('\n💡 Login credentials:');
    console.log('   📧 Email: admin@servisoo.com');
    console.log('   🔑 Password: 09081982');
    
  } else {
    console.log('❌ Tidak ada user admin yang ditemukan setelah pembuatan');
  }
}

// Run the script
createAdminUser().catch(console.error);