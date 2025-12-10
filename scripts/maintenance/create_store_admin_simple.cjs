require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStoreAdmin() {
  try {
    console.log('🔍 Membuat user store admin di Supabase...');
    console.log('============================================================');
    
    const email = 'store@servisoo.com';
    const password = '09081982';
    
    // 1. Check if user already exists
    console.log('\n📋 1. MENGECEK USER YANG SUDAH ADA...');
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
    
    if (checkError) {
      console.error('❌ Error mengecek user:', checkError.message);
      return;
    }
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log(`⚠️  User dengan email ${email} sudah ada:`);
      console.log('   ID:', existingProfiles[0].id);
      console.log('   Role:', existingProfiles[0].role);
      console.log('   Nama:', existingProfiles[0].nama);
      
      // Update role to admin if not already
      if (existingProfiles[0].role !== 'admin') {
        console.log(`\n🔄 Mengupdate role dari '${existingProfiles[0].role}' ke 'admin'...`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            nama: 'Store Admin',
            email: email
          })
          .eq('id', existingProfiles[0].id);
        
        if (updateError) {
          console.error('❌ Error update role:', updateError.message);
        } else {
          console.log('✅ Role berhasil diupdate ke admin!');
        }
      } else {
        console.log('✅ User sudah memiliki role admin.');
      }
      
      console.log('\n🔐 INFORMASI LOGIN:');
      console.log('========================================');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`👤 Role: admin`);
      console.log(`🌐 URL Admin Toko: /admin/toko`);
      
      return;
    }
    
    // 2. Get existing user_id to use (from admin user)
    console.log('\n📝 2. MENGAMBIL USER_ID YANG TERSEDIA...');
    const { data: adminUser, error: adminError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1);
    
    if (adminError || !adminUser || adminUser.length === 0) {
      console.error('❌ Error: Tidak ada admin user untuk mengambil user_id pattern');
      console.log('\n💡 SOLUSI ALTERNATIF:');
      console.log('1. Login dengan admin@servisoo.com / 09081982');
      console.log('2. User tersebut sudah bisa akses /admin/toko');
      console.log('3. Atau buat user baru melalui Supabase Auth Dashboard');
      return;
    }
    
    // 3. Create new profile using existing user_id pattern
    console.log('\n📝 3. MEMBUAT PROFILE BARU...');
    const existingUserId = adminUser[0].user_id;
    
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        user_id: existingUserId, // Use existing user_id (will create duplicate but for demo)
        email: email,
        role: 'admin',
        nama: 'Store Admin',
        lokasi: 'Jakarta',
        saldo_deposit: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error membuat profile:', insertError.message);
      console.log('\n💡 SOLUSI:');
      console.log('- Gunakan admin@servisoo.com / 09081982 untuk akses admin toko');
      console.log('- User tersebut sudah memiliki akses ke /admin/toko');
      return;
    }
    
    console.log('✅ Profile berhasil dibuat!');
    console.log('   Email:', email);
    console.log('   Role: admin');
    
    console.log('\n🔐 INFORMASI LOGIN:');
    console.log('========================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: admin (dapat akses admin toko)`);
    console.log(`🌐 URL Admin Toko: /admin/toko`);
    
    console.log('\n⚠️  CATATAN:');
    console.log('- Profile telah dibuat di database');
    console.log('- Untuk login penuh, perlu registrasi di Supabase Auth');
    console.log('- Alternatif: gunakan admin@servisoo.com / 09081982');
    
    console.log('\n✅ Selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createStoreAdmin();