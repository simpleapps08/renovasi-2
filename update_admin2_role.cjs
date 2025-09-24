require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL atau Key tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdmin2Role() {
  try {
    console.log('🔍 Mencari user admin2@servisoo.com...');
    
    // Cari user berdasarkan email
    const { data: users, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin2@servisoo.com');
    
    if (searchError) {
      console.error('❌ Error mencari user:', searchError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ User admin2@servisoo.com tidak ditemukan');
      return;
    }
    
    const user = users[0];
    console.log('✅ User ditemukan:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nama: ${user.nama}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role saat ini: ${user.role}`);
    
    // Update role menjadi admin_store
    console.log('\n🔄 Mengubah role menjadi admin_store...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin_store' })
      .eq('email', 'admin2@servisoo.com')
      .select();
    
    if (updateError) {
      console.error('❌ Error mengupdate role:', updateError.message);
      return;
    }
    
    console.log('✅ Role berhasil diupdate!');
    console.log('   Role baru:', updateData[0].role);
    
    // Verifikasi perubahan
    console.log('\n🔍 Verifikasi perubahan...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin2@servisoo.com');
    
    if (verifyError) {
      console.error('❌ Error verifikasi:', verifyError.message);
      return;
    }
    
    console.log('✅ Verifikasi berhasil:');
    console.log(`   Email: ${verifyData[0].email}`);
    console.log(`   Nama: ${verifyData[0].nama}`);
    console.log(`   Role: ${verifyData[0].role}`);
    
    // Tampilkan statistik role
    console.log('\n📊 Statistik role saat ini:');
    const { data: roleStats, error: statsError } = await supabase
      .from('profiles')
      .select('role');
    
    if (!statsError && roleStats) {
      const roleCounts = roleStats.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`   ${role}: ${count} user(s)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAdmin2Role();