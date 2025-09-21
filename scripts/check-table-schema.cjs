const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchema() {
  console.log('🔍 Memeriksa schema tabel user_profiles...');

  try {
    // Coba insert dummy data untuk melihat error dan mengetahui kolom yang diperlukan
    console.log('📋 Step 1: Testing insert untuk mengetahui struktur kolom...');
    
    const testData = {
      id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000000',
      full_name: 'Test User',
      role_id: '3bc6d526-0060-4179-b9bd-1ba33c506bc2',
      email: 'test@example.com',
      role: 'admin',
      nama: 'Test User',
      lokasi: 'Test Location',
      saldo_deposit: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(testData)
      .select();

    if (error) {
      console.log('❌ Insert error (ini membantu kita mengetahui struktur):');
      console.log('   Error:', error.message);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
      
      // Analisis error untuk mengetahui kolom yang valid
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        const match = error.message.match(/column "([^"]+)" of relation "user_profiles" does not exist/);
        if (match) {
          console.log(`   ❌ Kolom '${match[1]}' tidak ada di tabel user_profiles`);
        }
      }
    } else {
      console.log('✅ Insert berhasil (akan dihapus):');
      console.log('   Data:', data);
      
      // Hapus data test
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testData.id);
      console.log('   Test data dihapus');
    }

    console.log('');

    // Coba dengan struktur minimal
    console.log('📋 Step 2: Testing dengan struktur minimal...');
    const minimalData = {
      id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Test User 2',
      role_id: '3bc6d526-0060-4179-b9bd-1ba33c506bc2'
    };

    const { data: data2, error: error2 } = await supabase
      .from('user_profiles')
      .insert(minimalData)
      .select();

    if (error2) {
      console.log('❌ Insert minimal error:');
      console.log('   Error:', error2.message);
      console.log('   Details:', error2.details);
      console.log('   Hint:', error2.hint);
    } else {
      console.log('✅ Insert minimal berhasil:');
      console.log('   Data:', data2);
      
      // Hapus data test
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', minimalData.id);
      console.log('   Test data dihapus');
    }

    console.log('');

    // Coba dengan struktur AuthContext (nama, lokasi, role, saldo_deposit)
    console.log('📋 Step 3: Testing dengan struktur AuthContext...');
    const authContextData = {
      id: '00000000-0000-0000-0000-000000000002',
      user_id: '00000000-0000-0000-0000-000000000002',
      nama: 'Test User 3',
      lokasi: 'Test Location',
      role: 'admin',
      saldo_deposit: 0
    };

    const { data: data3, error: error3 } = await supabase
      .from('user_profiles')
      .insert(authContextData)
      .select();

    if (error3) {
      console.log('❌ Insert AuthContext structure error:');
      console.log('   Error:', error3.message);
      console.log('   Details:', error3.details);
      console.log('   Hint:', error3.hint);
    } else {
      console.log('✅ Insert AuthContext structure berhasil:');
      console.log('   Data:', data3);
      
      // Hapus data test
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', authContextData.id);
      console.log('   Test data dihapus');
    }

    console.log('');
    console.log('🔍 KESIMPULAN:');
    console.log('Berdasarkan test insert di atas, kita bisa mengetahui:');
    console.log('1. Kolom mana yang ada di tabel user_profiles');
    console.log('2. Kolom mana yang required vs optional');
    console.log('3. Struktur data yang benar untuk insert admin user');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableSchema();