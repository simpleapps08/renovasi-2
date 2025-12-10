require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStoreOwnerUser() {
  try {
    console.log('🔍 Membuat user store owner di Supabase...');
    console.log('============================================================');
    
    const email = 'store@servisoo.com';
    const password = '09081982';
    const role = 'store_owner';
    
    // 1. Check if user already exists in profiles
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
      console.log('   Created:', new Date(existingProfiles[0].created_at).toLocaleDateString());
      
      // Update role if different
      if (existingProfiles[0].role !== role) {
        console.log(`\n🔄 Mengupdate role dari '${existingProfiles[0].role}' ke '${role}'...`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: role })
          .eq('id', existingProfiles[0].id);
        
        if (updateError) {
          console.error('❌ Error update role:', updateError.message);
        } else {
          console.log('✅ Role berhasil diupdate!');
        }
      } else {
        console.log('✅ User sudah memiliki role yang benar.');
      }
      return;
    }
    
    // 2. Create new profile entry (since we can't create auth user with publishable key)
    console.log('\n📝 2. MEMBUAT PROFILE BARU...');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    
    // Generate a UUID for the user (in real scenario, this would come from auth.users)
    const userId = crypto.randomUUID();
    
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        user_id: userId,
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
    
    console.log('✅ Profile berhasil dibuat!');
    console.log('   User ID:', userId);
    console.log('   Email:', email);
    console.log('   Role:', role);
    
    // 3. Display access information
    console.log('\n🔐 3. INFORMASI AKSES:');
    console.log('========================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log(`🌐 URL Admin Toko: /admin/toko`);
    
    console.log('\n⚠️  CATATAN PENTING:');
    console.log('- Profile telah dibuat di database');
    console.log('- Untuk login penuh, user perlu didaftarkan di Supabase Auth');
    console.log('- Sementara bisa menggunakan mock authentication di StoreAuth.tsx');
    console.log('- Atau login dengan admin@servisoo.com untuk akses admin toko');
    
    // 4. Check all store owners
    console.log('\n📊 4. DAFTAR SEMUA STORE OWNERS:');
    console.log('========================================');
    const { data: storeOwners, error: storeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'store_owner');
    
    if (storeError) {
      console.error('❌ Error mengambil store owners:', storeError.message);
    } else {
      console.log(`✅ Ditemukan ${storeOwners?.length || 0} store owner(s):`);
      storeOwners?.forEach((owner, index) => {
        console.log(`   ${index + 1}. ${owner.email} (ID: ${owner.id})`);
      });
    }
    
    console.log('\n============================================================');
    console.log('✅ Proses selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createStoreOwnerUser();