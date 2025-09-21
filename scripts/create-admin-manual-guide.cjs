const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminManualGuide() {
  console.log('🔍 Panduan Membuat Admin User Manual...');
  console.log('');

  const adminEmail = 'admin1@servisoo.com';
  const adminPassword = 'Admin123!@#';
  const adminRoleId = '3bc6d526-0060-4179-b9bd-1ba33c506bc2';

  try {
    console.log('📋 Step 1: Memeriksa struktur tabel yang diperlukan...');
    
    // Cek user_roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', adminRoleId);

    if (rolesError) {
      console.log('❌ Error mengakses user_roles:', rolesError.message);
    } else if (roles && roles.length > 0) {
      console.log('✅ Role admin ditemukan:', roles[0]);
    } else {
      console.log('❌ Role admin tidak ditemukan dengan ID:', adminRoleId);
    }

    // Cek struktur user_profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Error mengakses user_profiles:', profilesError.message);
    } else {
      console.log('✅ Tabel user_profiles dapat diakses');
    }

    console.log('');
    console.log('🚨 MASALAH UTAMA:');
    console.log('1. Tidak ada Service Role Key untuk bypass RLS');
    console.log('2. RLS policy mencegah insert langsung ke user_profiles');
    console.log('3. AuthContext menggunakan struktur kolom yang tidak sesuai dengan tabel');
    console.log('');

    console.log('💡 SOLUSI MANUAL:');
    console.log('');
    console.log('=== LANGKAH 1: Buat User di Supabase Dashboard ===');
    console.log('1. Buka Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Pilih project: tkqvozgorpapofejphyn');
    console.log('3. Ke menu "Authentication" > "Users"');
    console.log('4. Klik "Add user"');
    console.log('5. Isi:');
    console.log('   - Email:', adminEmail);
    console.log('   - Password:', adminPassword);
    console.log('   - Auto Confirm User: YES');
    console.log('6. Klik "Create user"');
    console.log('7. Catat User ID yang dihasilkan');
    console.log('');

    console.log('=== LANGKAH 2: Insert ke user_profiles ===');
    console.log('1. Ke menu "Table Editor" > "user_profiles"');
    console.log('2. Klik "Insert" > "Insert row"');
    console.log('3. Isi:');
    console.log('   - id: [User ID dari langkah 1]');
    console.log('   - full_name: Administrator');
    console.log('   - role_id:', adminRoleId);
    console.log('   - created_at: now()');
    console.log('   - updated_at: now()');
    console.log('4. Klik "Save"');
    console.log('');

    console.log('=== LANGKAH 3: Verifikasi ===');
    console.log('1. Coba login di: https://www.servisoo.com/admin/login');
    console.log('2. Gunakan:');
    console.log('   - Email:', adminEmail);
    console.log('   - Password:', adminPassword);
    console.log('');

    console.log('=== MASALAH POTENSIAL ===');
    console.log('1. AuthContext menggunakan kolom yang tidak ada:');
    console.log('   - user_id (seharusnya id)');
    console.log('   - nama (seharusnya full_name)');
    console.log('   - lokasi (mungkin tidak ada)');
    console.log('');
    console.log('2. Perlu update AuthContext.tsx untuk menyesuaikan struktur tabel');
    console.log('');

    console.log('=== SQL ALTERNATIF (jika ada akses SQL Editor) ===');
    console.log('-- 1. Buat user di auth (perlu service role)');
    console.log(`-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)`);
    console.log(`-- VALUES (gen_random_uuid(), '${adminEmail}', crypt('${adminPassword}', gen_salt('bf')), now(), now(), now());`);
    console.log('');
    console.log('-- 2. Insert ke user_profiles');
    console.log(`INSERT INTO user_profiles (id, full_name, role_id, created_at, updated_at)`);
    console.log(`SELECT id, 'Administrator', '${adminRoleId}', now(), now()`);
    console.log(`FROM auth.users WHERE email = '${adminEmail}';`);
    console.log('');

    console.log('🔧 PERBAIKAN KODE YANG DIPERLUKAN:');
    console.log('File: src/contexts/AuthContext.tsx');
    console.log('Masalah: Interface Profile tidak sesuai dengan struktur tabel');
    console.log('Solusi: Update interface dan query untuk menggunakan:');
    console.log('- id instead of user_id');
    console.log('- full_name instead of nama');
    console.log('- Hapus lokasi jika tidak ada di tabel');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminManualGuide();