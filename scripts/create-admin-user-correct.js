import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('🚀 Creating Admin User Process...');
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Step 1: Check if user_roles table exists and has admin role
    console.log('1️⃣ Checking user_roles table...');
    
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('id, role_name, role_level')
      .eq('role_name', 'admin');

    if (rolesError) {
      console.error('❌ Error accessing user_roles:', rolesError.message);
      console.log('');
      console.log('💡 Pastikan tabel user_roles sudah dibuat dengan menjalankan:');
      console.log('   - SQL dari SUPABASE_SETUP_INSTRUCTIONS.md');
      return;
    }

    if (!roles || roles.length === 0) {
      console.error('❌ Admin role not found in user_roles table');
      console.log('');
      console.log('💡 Jalankan SQL berikut untuk membuat role admin:');
      console.log('=' .repeat(60));
      console.log(`INSERT INTO public.user_roles (role_name, role_level, permissions, description)
VALUES ('admin', 2, '{"users": "manage", "content": "manage", "settings": "manage"}', 'Administrator with full access');`);
      console.log('=' .repeat(60));
      return;
    }

    const adminRole = roles[0];
    console.log(`✅ Admin role found: ${adminRole.role_name} (level ${adminRole.role_level})`);
    console.log('');

    // Step 2: Check if admin user already exists in user_profiles
    console.log('2️⃣ Checking existing admin user...');
    
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('role_id', adminRole.id);

    if (profilesError) {
      console.error('❌ Error checking user_profiles:', profilesError.message);
      return;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('✅ Admin user already exists:');
      existingProfiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}`);
        console.log(`   - Name: ${profile.full_name}`);
      });
      console.log('');
      console.log('💡 Untuk melihat email admin, cek di Supabase Dashboard → Authentication → Users');
      return;
    }

    console.log('📭 No admin user found in user_profiles');
    console.log('');

    // Step 3: Provide instructions for manual creation
    console.log('3️⃣ INSTRUKSI MEMBUAT ADMIN USER:');
    console.log('=' .repeat(60));
    console.log('');
    console.log('🔐 LANGKAH 1: Buat Auth User (Manual di Supabase Dashboard)');
    console.log('   1. Buka Supabase Dashboard → Authentication → Users');
    console.log('   2. Klik "Add User"');
    console.log('   3. Masukkan:');
    console.log('      - Email: admin@servisoo');
    console.log('      - Password: (buat password yang kuat)');
    console.log('      - Auto Confirm User: ✅ (centang)');
    console.log('   4. Klik "Create User"');
    console.log('   5. CATAT USER ID yang muncul (format UUID)');
    console.log('');
    console.log('👤 LANGKAH 2: Buat Profile (Jalankan SQL di SQL Editor)');
    console.log('   Ganti USER_ID_FROM_STEP_1 dengan ID user yang baru dibuat:');
    console.log('');
    console.log('   SQL:');
    console.log('   ----');
    console.log(`   INSERT INTO public.user_profiles (`);
    console.log(`       id,`);
    console.log(`       full_name,`);
    console.log(`       role_id`);
    console.log(`   ) VALUES (`);
    console.log(`       'USER_ID_FROM_STEP_1',  -- Ganti dengan ID dari step 1`);
    console.log(`       'System Administrator',`);
    console.log(`       '${adminRole.id}'`);
    console.log(`   );`);
    console.log('   ----');
    console.log('');
    console.log('✅ LANGKAH 3: Verifikasi');
    console.log('   Jalankan script ini lagi untuk memverifikasi admin user sudah dibuat.');
    console.log('');
    console.log('=' .repeat(60));
    console.log('');
    console.log('❓ MENGAPA TIDAK OTOMATIS?');
    console.log('   - Supabase Auth API memerlukan Service Role Key untuk membuat user');
    console.log('   - Service Role Key sangat sensitif dan tidak boleh di-commit ke Git');
    console.log('   - Cara manual lebih aman untuk setup awal');
    console.log('');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('create-admin-user-correct.js')) {
  createAdminUser();
}

export { createAdminUser };