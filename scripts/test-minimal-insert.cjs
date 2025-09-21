const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMinimalInsert() {
  console.log('🔍 Testing insert dengan kolom yang pasti ada...');

  try {
    // Berdasarkan AuthContext.tsx, kolom yang digunakan adalah:
    // - id, nama, role, saldo_deposit
    // Mari coba satu per satu

    console.log('📋 Step 1: Testing hanya dengan id...');
    const testId = {
      id: '00000000-0000-0000-0000-000000000001'
    };

    let { data, error } = await supabase
      .from('user_profiles')
      .insert(testId)
      .select();

    if (error) {
      console.log('❌ Insert dengan id saja gagal:');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ Insert dengan id saja berhasil!');
      console.log('   Data:', data);
      
      // Hapus data test
      await supabase.from('user_profiles').delete().eq('id', testId.id);
      console.log('   Test data dihapus');
    }

    console.log('');

    console.log('📋 Step 2: Testing dengan id + nama...');
    const testIdNama = {
      id: '00000000-0000-0000-0000-000000000002',
      nama: 'Test User'
    };

    ({ data, error } = await supabase
      .from('user_profiles')
      .insert(testIdNama)
      .select());

    if (error) {
      console.log('❌ Insert dengan id + nama gagal:');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ Insert dengan id + nama berhasil!');
      console.log('   Data:', data);
      
      // Hapus data test
      await supabase.from('user_profiles').delete().eq('id', testIdNama.id);
      console.log('   Test data dihapus');
    }

    console.log('');

    console.log('📋 Step 3: Testing dengan id + nama + role...');
    const testIdNamaRole = {
      id: '00000000-0000-0000-0000-000000000003',
      nama: 'Test User',
      role: 'admin'
    };

    ({ data, error } = await supabase
      .from('user_profiles')
      .insert(testIdNamaRole)
      .select());

    if (error) {
      console.log('❌ Insert dengan id + nama + role gagal:');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ Insert dengan id + nama + role berhasil!');
      console.log('   Data:', data);
      
      // Hapus data test
      await supabase.from('user_profiles').delete().eq('id', testIdNamaRole.id);
      console.log('   Test data dihapus');
    }

    console.log('');

    console.log('📋 Step 4: Testing dengan semua kolom AuthContext...');
    const testFull = {
      id: '00000000-0000-0000-0000-000000000004',
      nama: 'Test User',
      role: 'admin',
      saldo_deposit: 0
    };

    ({ data, error } = await supabase
      .from('user_profiles')
      .insert(testFull)
      .select());

    if (error) {
      console.log('❌ Insert dengan semua kolom AuthContext gagal:');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ Insert dengan semua kolom AuthContext berhasil!');
      console.log('   Data:', data);
      
      // Hapus data test
      await supabase.from('user_profiles').delete().eq('id', testFull.id);
      console.log('   Test data dihapus');
    }

    console.log('');
    console.log('🔍 KESIMPULAN:');
    console.log('Dari test di atas, kita bisa mengetahui struktur tabel user_profiles yang benar.');
    console.log('Selanjutnya kita bisa membuat admin user dengan struktur yang tepat.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMinimalInsert();