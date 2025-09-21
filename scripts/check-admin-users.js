import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_PUBLISHABLE_KEY in .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUsers() {
  try {
    console.log('🔍 Menganalisis database Supabase...');
    console.log('📊 Project ID:', 'tkqvozgorpapofejphyn');
    console.log('🌐 Supabase URL:', supabaseUrl);
    console.log('');

    // Check user_profiles table structure and content
    console.log('📋 Mengecek tabel user_profiles...');
    
    const { data: allUsers, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profileError) {
      console.error('❌ Error accessing user_profiles:', profileError.message);
      console.log('💡 Kemungkinan tabel user_profiles belum ada atau tidak dapat diakses.');
      return;
    }

    console.log(`✅ Tabel user_profiles ditemukan dengan ${allUsers?.length || 0} total records`);
    
    if (allUsers && allUsers.length > 0) {
      console.log('');
      console.log('📊 Struktur data user_profiles:');
      const sampleUser = allUsers[0];
      const columns = Object.keys(sampleUser);
      console.log('   Kolom yang tersedia:', columns.join(', '));
      console.log('');
      
      console.log('👥 Semua user yang terdaftar:');
      console.log('=' .repeat(80));
      
      allUsers.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`);
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   📧 Email: ${user.email || 'N/A'}`);
        console.log(`   👨‍💼 Nama: ${user.full_name || 'Tidak ada nama'}`);
        
        // Check for different possible role fields
        if (user.role) {
          console.log(`   🎭 Role: ${user.role}`);
        }
        if (user.role_id) {
          console.log(`   🔗 Role ID: ${user.role_id}`);
        }
        if (user.user_role) {
          console.log(`   🎭 User Role: ${user.user_role}`);
        }
        
        console.log(`   📅 Dibuat: ${user.created_at ? new Date(user.created_at).toLocaleString('id-ID') : 'N/A'}`);
        console.log(`   🔄 Update: ${user.updated_at ? new Date(user.updated_at).toLocaleString('id-ID') : 'N/A'}`);
        console.log('');
      });
      
      // Look for potential admin users
      const potentialAdmins = allUsers.filter(user => 
        user.email?.includes('admin') || 
        user.role === 'admin' || 
        user.user_role === 'admin' ||
        user.full_name?.toLowerCase().includes('admin')
      );
      
      if (potentialAdmins.length > 0) {
        console.log('🔍 Potential admin users ditemukan:');
        console.log('=' .repeat(50));
        potentialAdmins.forEach((user, index) => {
          console.log(`🔑 Admin ${index + 1}: ${user.email} (${user.full_name || 'No name'})`);
        });
      } else {
        console.log('⚠️  Tidak ada user dengan indikasi admin ditemukan.');
      }
      
    } else {
      console.log('📭 Tidak ada user ditemukan di tabel user_profiles.');
    }
    
    console.log('');
    console.log('=' .repeat(80));
    console.log(`📊 Total users: ${allUsers?.length || 0}`);
    
    // Try to check user_roles table
    console.log('');
    console.log('🔍 Mencoba mengakses tabel user_roles...');
    
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.log('⚠️  Tabel user_roles tidak dapat diakses:', rolesError.message);
      console.log('💡 Kemungkinan sistem role baru belum diimplementasi di database.');
    } else {
      console.log(`✅ Tabel user_roles ditemukan dengan ${userRoles?.length || 0} roles`);
      if (userRoles && userRoles.length > 0) {
        console.log('🎭 Role yang tersedia:');
        userRoles.forEach(role => {
          console.log(`   - ${role.role_name} (Level: ${role.role_level}, ID: ${role.id})`);
        });
      }
    }
    
    // Check auth.users table (Supabase default authentication table)
    console.log('');
    console.log('🔍 Mencoba mengakses tabel auth.users...');
    
    try {
      // Use RPC to query auth.users since it's in auth schema
      const { data: authUsers, error: authError } = await supabase.rpc('get_auth_users');
      
      if (authError) {
        console.log('⚠️  Tidak dapat mengakses auth.users via RPC:', authError.message);
        console.log('💡 Mencoba query langsung ke auth schema...');
        
        // Try direct query (might not work due to RLS)
        const { data: directAuthUsers, error: directError } = await supabase
          .from('auth.users')
          .select('*');
          
        if (directError) {
          console.log('⚠️  Query langsung ke auth.users gagal:', directError.message);
          console.log('💡 Kemungkinan perlu akses admin atau RPC function.');
        } else {
          console.log(`✅ Auth users ditemukan: ${directAuthUsers?.length || 0}`);
          if (directAuthUsers && directAuthUsers.length > 0) {
            directAuthUsers.forEach((user, index) => {
              console.log(`🔐 Auth User ${index + 1}:`);
              console.log(`   📧 Email: ${user.email}`);
              console.log(`   🆔 ID: ${user.id}`);
              console.log(`   ✅ Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
              console.log('');
            });
          }
        }
      } else {
        console.log(`✅ Auth users via RPC: ${authUsers?.length || 0}`);
      }
    } catch (authQueryError) {
      console.log('⚠️  Error querying auth users:', authQueryError.message);
    }
    
    // Final summary
    console.log('');
    console.log('📋 RINGKASAN ANALISIS DATABASE:');
    console.log('=' .repeat(50));
    console.log(`📊 User Profiles: ${allUsers?.length || 0} records`);
    console.log(`🎭 User Roles: ${userRoles ? userRoles.length : 'Tidak dapat diakses'}`);
    console.log('💡 Rekomendasi: Jalankan migrasi database untuk membuat tabel dan user admin.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

function displayUsersFromProfiles(users) {
  console.log('📋 Hasil dari user_profiles (role field):');
  console.log('=' .repeat(80));
  
  if (!users || users.length === 0) {
    console.log('❌ Tidak ada user dengan role admin ditemukan di user_profiles.');
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Cek apakah ada user dengan field role = "admin"');
    console.log('   - Mungkin sistem role baru belum diimplementasi');
    return;
  }

  console.log(`✅ Ditemukan ${users.length} user dengan role admin:`);
  console.log('');

  users.forEach((user, index) => {
    console.log(`👤 User ${index + 1}:`);
    console.log(`   🆔 ID: ${user.id}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👨‍💼 Nama: ${user.full_name || 'Tidak ada nama'}`);
    console.log(`   🎭 Role: ${user.role}`);
    console.log(`   🔗 Role ID: ${user.role_id || 'N/A'}`);
    console.log(`   📅 Dibuat: ${new Date(user.created_at).toLocaleString('id-ID')}`);
    console.log(`   🔄 Update: ${new Date(user.updated_at).toLocaleString('id-ID')}`);
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log(`📊 Total admin users: ${users.length}`);
}

function displayUsersWithRole(users, roleInfo) {
  console.log('📋 Hasil dari user_profiles dengan role_id:');
  console.log('=' .repeat(80));
  
  if (!users || users.length === 0) {
    console.log(`❌ Tidak ada user dengan role_id ${roleInfo.id} (${roleInfo.role_name}) ditemukan.`);
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Pastikan ada user yang sudah di-assign role admin');
    console.log('   - Cek apakah migrasi database sudah dijalankan dengan benar');
    console.log('   - Verifikasi bahwa user_profiles.role_id mengarah ke user_roles.id');
    return;
  }

  console.log(`✅ Ditemukan ${users.length} user dengan role ${roleInfo.role_name}:`);
  console.log('');

  users.forEach((user, index) => {
    console.log(`👤 User ${index + 1}:`);
    console.log(`   🆔 ID: ${user.id}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👨‍💼 Nama: ${user.full_name || 'Tidak ada nama'}`);
    console.log(`   🎭 Role: ${roleInfo.role_name}`);
    console.log(`   📊 Level: ${roleInfo.role_level}`);
    console.log(`   📝 Deskripsi: ${roleInfo.description}`);
    console.log(`   🔗 Role ID: ${user.role_id}`);
    console.log(`   📅 Dibuat: ${new Date(user.created_at).toLocaleString('id-ID')}`);
    console.log(`   🔄 Update: ${new Date(user.updated_at).toLocaleString('id-ID')}`);
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log(`📊 Total admin users: ${users.length}`);
}

// Run the function
if (process.argv[1] && process.argv[1].endsWith('check-admin-users.js')) {
  checkAdminUsers();
}

export { checkAdminUsers };