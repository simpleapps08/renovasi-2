const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmin1User() {
  console.log('🔍 Memeriksa user admin1@servisoo.com...');
  console.log('📧 Email: admin1@servisoo.com\n');

  try {
    // 1. Cek di auth.users
    console.log('📋 Step 1: Mencari user di auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error mengakses auth.users:', authError.message);
      console.log('💡 Ini normal jika menggunakan anon key, bukan service role key\n');
    } else {
      const admin1AuthUser = authUsers.users.find(user => user.email === 'admin1@servisoo.com');
      if (admin1AuthUser) {
        console.log('✅ User ditemukan di auth.users:');
        console.log(`   - ID: ${admin1AuthUser.id}`);
        console.log(`   - Email: ${admin1AuthUser.email}`);
        console.log(`   - Created: ${admin1AuthUser.created_at}`);
        console.log(`   - Confirmed: ${admin1AuthUser.email_confirmed_at ? 'Yes' : 'No'}\n`);
      } else {
        console.log('❌ User TIDAK ditemukan di auth.users\n');
      }
    }

    // 2. Cek di user_profiles dengan email
    console.log('📋 Step 2: Mencari profile berdasarkan email...');
    const { data: profileByEmail, error: profileEmailError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'admin1@servisoo.com');

    if (profileEmailError) {
      console.error('❌ Error mencari profile by email:', profileEmailError.message);
    } else if (profileByEmail && profileByEmail.length > 0) {
      console.log('✅ Profile ditemukan berdasarkan email:');
      profileByEmail.forEach((profile, index) => {
        console.log(`   Profile ${index + 1}:`);
        console.log(`   - ID: ${profile.id}`);
        console.log(`   - User ID: ${profile.user_id || 'NULL'}`);
        console.log(`   - Full Name: ${profile.full_name || 'NULL'}`);
        console.log(`   - Role: ${profile.role || 'NULL'}`);
        console.log(`   - Role ID: ${profile.role_id || 'NULL'}`);
        console.log(`   - Email: ${profile.email || 'NULL'}`);
      });
    } else {
      console.log('❌ Profile TIDAK ditemukan berdasarkan email');
    }
    console.log('');

    // 3. Cek semua profiles dengan role admin
    console.log('📋 Step 3: Mencari semua profiles dengan role admin...');
    const { data: adminProfiles, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin');

    if (adminError) {
      console.error('❌ Error mencari admin profiles:', adminError.message);
    } else if (adminProfiles && adminProfiles.length > 0) {
      console.log(`✅ Ditemukan ${adminProfiles.length} profile(s) dengan role admin:`);
      adminProfiles.forEach((profile, index) => {
        console.log(`   Admin ${index + 1}:`);
        console.log(`   - ID: ${profile.id}`);
        console.log(`   - User ID: ${profile.user_id || 'NULL'}`);
        console.log(`   - Full Name: ${profile.full_name || 'NULL'}`);
        console.log(`   - Email: ${profile.email || 'NULL'}`);
        console.log(`   - Role ID: ${profile.role_id || 'NULL'}`);
      });
    } else {
      console.log('❌ Tidak ada profile dengan role admin');
    }
    console.log('');

    // 4. Cek user_roles table
    console.log('📋 Step 4: Memeriksa tabel user_roles...');
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .order('role_level', { ascending: true });

    if (rolesError) {
      console.error('❌ Error mengakses user_roles:', rolesError.message);
    } else if (userRoles && userRoles.length > 0) {
      console.log('✅ Roles yang tersedia:');
      userRoles.forEach(role => {
        console.log(`   - ${role.role_name} (Level: ${role.role_level}, ID: ${role.id})`);
      });
    } else {
      console.log('❌ Tabel user_roles kosong');
    }
    console.log('');

    // 5. Diagnosis dan rekomendasi
    console.log('🔍 DIAGNOSIS:');
    
    if (!profileByEmail || profileByEmail.length === 0) {
      console.log('❌ MASALAH: User admin1@servisoo.com tidak ada di user_profiles');
      console.log('💡 SOLUSI: Buat user admin1@servisoo.com terlebih dahulu');
      console.log('   1. Buat auth user di Supabase Auth');
      console.log('   2. Buat profile di user_profiles dengan role admin');
    } else {
      const admin1Profile = profileByEmail[0];
      if (admin1Profile.role !== 'admin') {
        console.log(`❌ MASALAH: User admin1@servisoo.com memiliki role '${admin1Profile.role}', bukan 'admin'`);
        console.log('💡 SOLUSI: Update role menjadi admin');
      } else {
        console.log('✅ User admin1@servisoo.com sudah memiliki role admin');
        console.log('🔍 Kemungkinan masalah lain:');
        console.log('   1. Password salah');
        console.log('   2. Email belum dikonfirmasi');
        console.log('   3. RLS policy memblokir akses');
        console.log('   4. Masalah dengan foreign key constraint');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdmin1User();