import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminProfile() {
  console.log('🚀 Membuat admin profile di user_profiles...');
  console.log('📧 Email: admin@servisoo.com');
  
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
    
    // Step 2: Generate UUID for admin user
    const adminUserId = crypto.randomUUID();
    console.log('\n📋 Step 2: Generated admin user ID:', adminUserId);
    
    // Step 3: Check if any admin profile already exists
    console.log('\n📋 Step 3: Checking existing admin profiles...');
    const { data: existingProfiles, error: checkError } = await supabase
      .from('user_profiles')
      .select('*, user_roles!inner(role_name)')
      .eq('user_roles.role_name', 'admin');
    
    if (checkError) {
      console.log('⚠️ Error checking existing profiles:', checkError.message);
    }
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log('💡 Admin profile sudah ada:');
      existingProfiles.forEach(profile => {
        console.log(`   🆔 ID: ${profile.id}`);
        console.log(`   👤 Name: ${profile.full_name}`);
        console.log(`   🎭 Role: ${profile.user_roles.role_name}`);
      });
      console.log('\n✅ Menggunakan admin profile yang sudah ada');
    } else {
      // Step 4: Create new admin profile using SQL
      console.log('\n📋 Step 4: Membuat admin profile baru...');
      console.log('⚠️ Karena RLS policy, kita perlu menggunakan SQL manual');
      
      console.log('\n📝 Jalankan SQL berikut di Supabase Dashboard → SQL Editor:');
      console.log('\n```sql');
      console.log('-- Buat admin profile');
      console.log('INSERT INTO public.user_profiles (');
      console.log('    id,');
      console.log('    full_name,');
      console.log('    role_id,');
      console.log('    created_at,');
      console.log('    updated_at');
      console.log(') VALUES (');
      console.log(`    '${adminUserId}',`);
      console.log(`    'System Administrator',`);
      console.log(`    '${adminRole.id}',`);
      console.log('    NOW(),');
      console.log('    NOW()');
      console.log(');');
      console.log('```');
      
      console.log('\n💡 Setelah menjalankan SQL, jalankan script ini lagi untuk verifikasi.');
      return;
    }
    
    // Step 5: Verify admin profile creation
    await verifyAdminProfile();
    
    // Step 6: Show manual auth user creation instructions
    showAuthUserInstructions(adminUserId);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function verifyAdminProfile() {
  console.log('\n📋 Step 5: Verifikasi admin profile...');
  
  const { data: adminUsers, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
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
    console.log('\n🎉 SUCCESS! Admin profile berhasil dibuat:');
    adminUsers.forEach(user => {
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.full_name}`);
      console.log(`   🎭 Role: ${user.user_roles?.role_name} (Level ${user.user_roles?.role_level})`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Created: ${user.created_at}`);
    });
  } else {
    console.log('❌ Tidak ada admin profile yang ditemukan');
  }
}

function showAuthUserInstructions(userId) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 LANGKAH MANUAL: Buat Auth User di Supabase Dashboard');
  console.log('='.repeat(60));
  console.log('\n🔗 1. Buka Supabase Dashboard → Authentication → Users');
  console.log('\n➕ 2. Klik "Add User" atau "Create User"');
  console.log('\n📝 3. Isi form dengan data berikut:');
  console.log('   📧 Email: admin@servisoo.com');
  console.log('   🔑 Password: 09081982');
  console.log('   ✅ Email Confirm: true (centang)');
  console.log(`   🆔 User ID (optional): ${userId}`);
  console.log('\n💾 4. Klik "Create User"');
  console.log('\n🔄 5. Jalankan verifikasi:');
  console.log('   node scripts/check-admin-users.js');
  console.log('\n💡 6. Login ke aplikasi:');
  console.log('   📧 Email: admin@servisoo.com');
  console.log('   🔑 Password: 09081982');
  console.log('\n' + '='.repeat(60));
  console.log('✅ Profile admin sudah siap, tinggal buat auth user!');
  console.log('='.repeat(60));
}

// Run the script
createAdminProfile().catch(console.error);