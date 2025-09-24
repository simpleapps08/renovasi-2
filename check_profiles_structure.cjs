require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfilesStructure() {
  try {
    console.log('🔍 Mengecek struktur tabel profiles...');
    console.log('============================================================');
    
    // Try to get one record to see the structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Struktur tabel profiles:');
      console.log('Kolom yang tersedia:');
      Object.keys(data[0]).forEach((key, index) => {
        console.log(`   ${index + 1}. ${key}: ${typeof data[0][key]} (${data[0][key] || 'null'})`);
      });
    } else {
      console.log('⚠️  Tabel profiles kosong, mencoba insert test untuk melihat struktur...');
      
      // Try a minimal insert to see what columns are required
      const testId = crypto.randomUUID();
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          role: 'test'
        })
        .select();
      
      if (insertError) {
        console.log('❌ Insert error (ini normal untuk melihat struktur):');
        console.log('   ', insertError.message);
      } else {
        console.log('✅ Test insert berhasil, struktur:');
        if (insertData && insertData.length > 0) {
          Object.keys(insertData[0]).forEach((key, index) => {
            console.log(`   ${index + 1}. ${key}`);
          });
        }
        
        // Clean up test data
        await supabase.from('profiles').delete().eq('id', testId);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProfilesStructure();