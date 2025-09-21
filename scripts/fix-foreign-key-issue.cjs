require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeForeignKeyIssue() {
  try {
    console.log('🔍 Menganalisis masalah foreign key constraint...');
    
    // Check current user_profiles structure
    console.log('\n📋 Step 1: Checking user_profiles structure...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('⚠️ Error accessing user_profiles:', profileError.message);
    } else {
      console.log('✅ user_profiles accessible, current records:', profiles?.length || 0);
    }
    
    console.log('\n🔍 DIAGNOSIS:');
    console.log('=====================================');
    console.log('❌ ERROR: Foreign key constraint "user_profiles_id_fkey" violation');
    console.log('📝 CAUSE: Tabel user_profiles memiliki constraint yang mengharuskan');
    console.log('   ID harus ada di auth.users terlebih dahulu');
    console.log('\n💡 SOLUSI:');
    console.log('=====================================');
    
    console.log('\n🎯 OPSI 1: Buat Auth User Dulu (RECOMMENDED)');
    console.log('1. Buka Supabase Dashboard → Authentication → Users');
    console.log('2. Klik "Add user"');
    console.log('3. Email: admin@servisoo.com');
    console.log('4. Password: 09081982');
    console.log('5. Confirm email: ✅ Yes');
    console.log('6. Catat User ID yang di-generate');
    console.log('7. Gunakan User ID tersebut untuk INSERT ke user_profiles');
    
    console.log('\n🎯 OPSI 2: Hapus Constraint Sementara (ADVANCED)');
    console.log('⚠️ Hanya jika Anda yakin dengan struktur database');
    console.log('\n```sql');
    console.log('-- Hapus constraint sementara');
    console.log('ALTER TABLE public.user_profiles');
    console.log('DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;');
    console.log('');
    console.log('-- Insert admin profile');
    console.log('INSERT INTO public.user_profiles (');
    console.log('    id,');
    console.log('    full_name,');
    console.log('    role_id,');
    console.log('    created_at,');
    console.log('    updated_at');
    console.log(') VALUES (');
    console.log('    \'d535ec7f-c84d-4cd7-a864-19d40bc7f316\',');
    console.log('    \'System Administrator\',');
    console.log('    \'3bc6d526-0060-4179-b9bd-1ba33c506bc2\',');
    console.log('    NOW(),');
    console.log('    NOW()');
    console.log(');');
    console.log('');
    console.log('-- Tambahkan kembali constraint (opsional)');
    console.log('-- ALTER TABLE public.user_profiles');
    console.log('-- ADD CONSTRAINT user_profiles_id_fkey');
    console.log('-- FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;');
    console.log('```');
    
    console.log('\n🎯 OPSI 3: Gunakan UUID yang Sudah Ada');
    console.log('Jika ada auth user yang sudah ada, gunakan ID-nya:');
    console.log('\n```sql');
    console.log('-- Cek auth users yang ada');
    console.log('SELECT id, email, created_at FROM auth.users;');
    console.log('');
    console.log('-- Gunakan ID yang sudah ada untuk insert');
    console.log('-- Ganti UUID_YANG_ADA dengan ID dari query di atas');
    console.log('INSERT INTO public.user_profiles (');
    console.log('    id,');
    console.log('    full_name,');
    console.log('    role_id,');
    console.log('    created_at,');
    console.log('    updated_at');
    console.log(') VALUES (');
    console.log('    \'UUID_YANG_ADA\',');
    console.log('    \'System Administrator\',');
    console.log('    \'3bc6d526-0060-4179-b9bd-1ba33c506bc2\',');
    console.log('    NOW(),');
    console.log('    NOW()');
    console.log(');');
    console.log('```');
    
    console.log('\n📋 REKOMENDASI:');
    console.log('=====================================');
    console.log('✅ Gunakan OPSI 1 untuk setup yang aman dan proper');
    console.log('✅ Setelah auth user dibuat, gunakan ID-nya untuk user_profiles');
    console.log('✅ Test login setelah kedua record dibuat');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Jalankan analisis
analyzeForeignKeyIssue();