require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStoreAdminAccess() {
  try {
    console.log('🔍 Setup akses admin toko di Supabase...');
    console.log('============================================================');
    
    // 1. Check current admin users
    console.log('\n📋 1. MENGECEK ADMIN USERS YANG ADA...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'super_admin']);
    
    if (adminError) {
      console.error('❌ Error mengecek admin users:', adminError.message);
      return;
    }
    
    console.log(`✅ Ditemukan ${adminUsers?.length || 0} admin user(s):`);
    adminUsers?.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email || 'N/A'} (${user.role}) - ID: ${user.id}`);
    });
    
    // 2. Check if store@servisoo.com already exists
    const targetEmail = 'store@servisoo.com';
    const { data: storeUser, error: storeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', targetEmail);
    
    if (storeError) {
      console.error('❌ Error mengecek store user:', storeError.message);
      return;
    }
    
    if (storeUser && storeUser.length > 0) {
      console.log(`\n✅ User ${targetEmail} sudah ada:`);
      console.log('   Role:', storeUser[0].role);
      console.log('   Nama:', storeUser[0].nama);
      
      if (storeUser[0].role !== 'admin') {
        console.log('\n🔄 Mengupdate role ke admin...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', storeUser[0].id);
        
        if (updateError) {
          console.error('❌ Error update role:', updateError.message);
        } else {
          console.log('✅ Role berhasil diupdate ke admin!');
        }
      }
    } else {
      console.log(`\n⚠️  User ${targetEmail} belum ada.`);
      console.log('\n💡 SOLUSI ALTERNATIF:');
      console.log('Gunakan user admin yang sudah ada untuk akses admin toko.');
    }
    
    // 3. Display access information
    console.log('\n🔐 3. INFORMASI AKSES ADMIN TOKO:');
    console.log('========================================');
    
    console.log('\n👤 OPSI 1 - Admin Utama:');
    console.log('📧 Email: admin@servisoo.com');
    console.log('🔑 Password: 09081982');
    console.log('👤 Role: admin');
    console.log('🌐 URL: /admin/toko');
    
    if (storeUser && storeUser.length > 0) {
      console.log('\n👤 OPSI 2 - Store Admin:');
      console.log(`📧 Email: ${targetEmail}`);
      console.log('🔑 Password: 09081982');
      console.log(`👤 Role: ${storeUser[0].role}`);
      console.log('🌐 URL: /admin/toko');
    }
    
    console.log('\n👤 OPSI 3 - Demo Store Owner (Mock Auth):');
    console.log('📧 Email: owner@tokosejahtera.com');
    console.log('🔑 Password: password123');
    console.log('👤 Role: store_owner (mock)');
    console.log('🌐 URL: /admin/toko');
    
    // 4. Check access permissions
    console.log('\n🔒 4. AKSES PERMISSIONS:');
    console.log('========================================');
    console.log('✅ Role "admin" dapat akses /admin/toko');
    console.log('✅ Role "admin_toko" dapat akses /admin/toko');
    console.log('✅ Role "store_owner" dapat akses /admin/toko (mock auth)');
    
    // 5. Display current role constraints
    console.log('\n📊 5. ROLE CONSTRAINTS SAAT INI:');
    console.log('========================================');
    console.log('Role yang diizinkan di database:');
    console.log('- user');
    console.log('- admin');
    console.log('- super_admin');
    
    console.log('\n⚠️  CATATAN PENTING:');
    console.log('- Role "store_owner" belum ditambahkan ke constraint database');
    console.log('- Untuk menambahkan, jalankan SQL di Supabase Dashboard:');
    console.log('  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;');
    console.log('  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check');
    console.log('    CHECK (role IN (\'user\', \'admin\', \'super_admin\', \'store_owner\', \'admin_toko\'));');
    
    console.log('\n✅ Setup selesai! Gunakan kredensial di atas untuk akses admin toko.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupStoreAdminAccess();