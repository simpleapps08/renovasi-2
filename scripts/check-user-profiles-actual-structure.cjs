const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfilesStructure() {
  console.log('🔍 Memeriksa struktur tabel user_profiles...');

  try {
    // 1. Ambil semua data dari user_profiles untuk melihat struktur
    console.log('📋 Step 1: Mengambil sample data dari user_profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('❌ Error mengakses user_profiles:', profilesError.message);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log(`✅ Ditemukan ${profiles.length} profile(s). Struktur kolom:`);
      const firstProfile = profiles[0];
      const columns = Object.keys(firstProfile);
      console.log('📋 Kolom yang tersedia:');
      columns.forEach(col => {
        console.log(`   - ${col}: ${typeof firstProfile[col]} (${firstProfile[col]})`);
      });
      console.log('');

      console.log('📋 Sample data:');
      profiles.forEach((profile, index) => {
        console.log(`   Profile ${index + 1}:`);
        Object.keys(profile).forEach(key => {
          console.log(`     ${key}: ${profile[key]}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ Tabel user_profiles kosong');
    }

    // 2. Cek apakah ada profile dengan role_id yang sesuai dengan admin
    console.log('📋 Step 2: Mencari profiles dengan role_id admin...');
    const adminRoleId = '3bc6d526-0060-4179-b9bd-1ba33c506bc2'; // ID admin dari hasil sebelumnya
    
    const { data: adminProfiles, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role_id', adminRoleId);

    if (adminError) {
      console.error('❌ Error mencari admin profiles:', adminError.message);
    } else if (adminProfiles && adminProfiles.length > 0) {
      console.log(`✅ Ditemukan ${adminProfiles.length} profile(s) dengan role_id admin:`);
      adminProfiles.forEach((profile, index) => {
        console.log(`   Admin ${index + 1}:`);
        Object.keys(profile).forEach(key => {
          console.log(`     ${key}: ${profile[key]}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ Tidak ada profile dengan role_id admin');
    }

    // 3. Cek apakah ada profile dengan full_name yang mengandung 'admin'
    console.log('📋 Step 3: Mencari profiles dengan nama mengandung "admin"...');
    const { data: nameAdminProfiles, error: nameError } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('full_name', '%admin%');

    if (nameError) {
      console.error('❌ Error mencari profiles by name:', nameError.message);
    } else if (nameAdminProfiles && nameAdminProfiles.length > 0) {
      console.log(`✅ Ditemukan ${nameAdminProfiles.length} profile(s) dengan nama mengandung "admin":`);
      nameAdminProfiles.forEach((profile, index) => {
        console.log(`   Profile ${index + 1}:`);
        Object.keys(profile).forEach(key => {
          console.log(`     ${key}: ${profile[key]}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ Tidak ada profile dengan nama mengandung "admin"');
    }

    // 4. Diagnosis
    console.log('🔍 DIAGNOSIS:');
    console.log('✅ Tabel user_profiles menggunakan struktur:');
    if (profiles && profiles.length > 0) {
      const columns = Object.keys(profiles[0]);
      if (columns.includes('role_id')) {
        console.log('   - role_id (bukan role) untuk referensi ke user_roles');
      }
      if (columns.includes('user_id')) {
        console.log('   - user_id untuk referensi ke auth.users');
      }
      if (!columns.includes('email')) {
        console.log('   - TIDAK ada kolom email (email ada di auth.users)');
      }
      if (columns.includes('full_name')) {
        console.log('   - full_name untuk nama lengkap user');
      }
    }

    console.log('');
    console.log('💡 SOLUSI untuk membuat admin1@servisoo.com:');
    console.log('   1. Buat auth user dengan email admin1@servisoo.com di Supabase Auth');
    console.log('   2. Dapatkan user_id dari auth user yang baru dibuat');
    console.log('   3. Insert ke user_profiles dengan:');
    console.log('      - user_id: [ID dari auth user]');
    console.log('      - role_id: 3bc6d526-0060-4179-b9bd-1ba33c506bc2 (admin)');
    console.log('      - full_name: "Admin User" atau nama yang diinginkan');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUserProfilesStructure();