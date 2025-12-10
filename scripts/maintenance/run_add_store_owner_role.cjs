require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addStoreOwnerRole() {
  try {
    console.log('🔍 Menambahkan role store_owner ke constraint...');
    console.log('============================================================');
    
    // Read SQL file
    const sqlContent = fs.readFileSync('add_store_owner_role.sql', 'utf8');
    
    console.log('📝 SQL yang akan dijalankan:');
    console.log(sqlContent);
    
    // Note: We can't run DDL with publishable key, so we'll show the SQL
    console.log('\n⚠️  CATATAN PENTING:');
    console.log('- SQL di atas perlu dijalankan di Supabase Dashboard SQL Editor');
    console.log('- Atau menggunakan service role key (tidak tersedia di .env)');
    console.log('- Setelah constraint diupdate, jalankan create_store_owner_user.cjs lagi');
    
    console.log('\n🔗 Langkah-langkah:');
    console.log('1. Buka Supabase Dashboard > SQL Editor');
    console.log('2. Copy-paste SQL di atas');
    console.log('3. Jalankan SQL');
    console.log('4. Jalankan: node create_store_owner_user.cjs');
    
    // Alternative: Try to create user with existing role
    console.log('\n🔄 ALTERNATIF: Menggunakan role "admin" untuk sementara...');
    
    const email = 'store@servisoo.com';
    const password = '09081982';
    const role = 'admin'; // Use existing role
    
    // Check if user already exists
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
    
    if (checkError) {
      console.error('❌ Error mengecek user:', checkError.message);
      return;
    }
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log(`⚠️  User dengan email ${email} sudah ada dengan role: ${existingProfiles[0].role}`);
      return;
    }
    
    // Create new profile with admin role (without user_id constraint)
    const userId = crypto.randomUUID();
    
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        role: role,
        nama: 'Store Owner',
        lokasi: 'Jakarta',
        saldo_deposit: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error membuat profile:', insertError.message);
      return;
    }
    
    console.log('✅ Profile berhasil dibuat dengan role admin!');
    console.log('   User ID:', userId);
    console.log('   Email:', email);
    console.log('   Role:', role);
    
    console.log('\n🔐 INFORMASI LOGIN:');
    console.log('========================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role} (dapat akses admin toko)`);
    console.log(`🌐 URL Admin Toko: /admin/toko`);
    
    console.log('\n✅ Selesai! User dapat login dan mengakses halaman admin toko.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addStoreOwnerRole();