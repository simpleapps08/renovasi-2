const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualTableStructure() {
  console.log('🔍 Memeriksa struktur tabel yang sebenarnya...');

  try {
    // Cek apakah tabel user_profiles ada
    console.log('📋 Step 1: Mengecek keberadaan tabel user_profiles...');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error saat mengakses user_profiles:');
      console.log('   Error:', error.message);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
      
      if (error.message.includes('does not exist')) {
        console.log('\n🚨 MASALAH: Tabel user_profiles tidak ada!');
        console.log('\n💡 SOLUSI:');
        console.log('1. Buka Supabase Dashboard');
        console.log('2. Buat tabel user_profiles dengan struktur:');
        console.log('   - id: uuid (primary key)');
        console.log('   - user_id: uuid (foreign key ke auth.users)');
        console.log('   - nama: text');
        console.log('   - lokasi: text (nullable)');
        console.log('   - role: text');
        console.log('   - saldo_deposit: numeric (default 0)');
        console.log('   - created_at: timestamp (default now())');
        console.log('   - updated_at: timestamp (default now())');
        return;
      }
    } else {
      console.log('✅ Tabel user_profiles ada');
      console.log('   Data count:', data?.length || 0);
    }

    console.log('');

    // Coba insert dengan struktur yang berbeda-beda untuk mengetahui kolom yang ada
    console.log('📋 Step 2: Testing berbagai struktur kolom...');
    
    const testStructures = [
      { name: 'Standard', data: { id: '00000000-0000-0000-0000-000000000001' } },
      { name: 'With full_name', data: { id: '00000000-0000-0000-0000-000000000002', full_name: 'Test' } },
      { name: 'With name', data: { id: '00000000-0000-0000-0000-000000000003', name: 'Test' } },
      { name: 'With role_id', data: { id: '00000000-0000-0000-0000-000000000004', role_id: '3bc6d526-0060-4179-b9bd-1ba33c506bc2' } },
      { name: 'With created_at', data: { id: '00000000-0000-0000-0000-000000000005', created_at: new Date().toISOString() } }
    ];

    for (const test of testStructures) {
      console.log(`\n   Testing ${test.name}...`);
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert(test.data)
        .select();

      if (insertError) {
        if (insertError.message.includes('Could not find')) {
          const match = insertError.message.match(/Could not find the '([^']+)' column/);
          if (match) {
            console.log(`   ❌ Kolom '${match[1]}' tidak ada`);
          } else {
            console.log(`   ❌ Error: ${insertError.message}`);
          }
        } else if (insertError.message.includes('violates row-level security')) {
          console.log(`   ⚠️  RLS policy mencegah insert (tapi struktur kolom OK)`);
        } else {
          console.log(`   ❌ Error: ${insertError.message}`);
        }
      } else {
        console.log(`   ✅ Berhasil! Data:`, insertData);
        
        // Hapus data test
        await supabase.from('user_profiles').delete().eq('id', test.data.id);
        console.log(`   🗑️  Test data dihapus`);
      }
    }

    console.log('');
    console.log('📋 Step 3: Mencoba select untuk melihat struktur yang ada...');
    
    const { data: selectData, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);

    if (selectError) {
      console.log('❌ Error saat select:', selectError.message);
    } else {
      console.log('✅ Select berhasil');
      if (selectData && selectData.length > 0) {
        console.log('   Sample data:', selectData[0]);
        console.log('   Kolom yang ada:', Object.keys(selectData[0]));
      } else {
        console.log('   Tabel kosong');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkActualTableStructure();