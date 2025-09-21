import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfilesStructure() {
  try {
    console.log('🔍 Checking user_profiles table structure...');
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Try to get table structure by querying with limit 0
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing user_profiles:', error.message);
      
      // Check if table exists at all
      if (error.message.includes('does not exist')) {
        console.log('');
        console.log('💡 Tabel user_profiles tidak ada. SQL untuk membuat tabel:');
        console.log('=' .repeat(60));
        console.log(`CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
        console.log('=' .repeat(60));
      }
      return;
    }

    console.log('✅ Tabel user_profiles dapat diakses');
    console.log(`📊 Total records: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('');
      console.log('📋 Struktur kolom yang tersedia:');
      const sampleRecord = data[0];
      const columns = Object.keys(sampleRecord);
      
      columns.forEach(column => {
        const value = sampleRecord[column];
        const type = typeof value;
        console.log(`   - ${column}: ${type} ${value !== null ? `(contoh: ${value})` : '(null)'}`);
      });
      
      console.log('');
      console.log('📄 Sample record:');
      console.log(JSON.stringify(sampleRecord, null, 2));
    } else {
      console.log('');
      console.log('📭 Tabel kosong, tidak bisa menentukan struktur dari data.');
      console.log('💡 Coba query untuk melihat definisi tabel...');
      
      // Try to insert a test record to see what columns are expected
      const testRecord = {
        id: crypto.randomUUID(),
        full_name: 'Test User',
        avatar_url: null
      };
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert(testRecord)
        .select();
        
      if (insertError) {
        console.log('⚠️  Test insert error:', insertError.message);
        
        if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
          console.log('');
          console.log('💡 Kolom yang diperlukan mungkin tidak ada. Kemungkinan struktur tabel:');
          console.log('   - id (UUID, Primary Key)');
          console.log('   - full_name (TEXT)');
          console.log('   - avatar_url (TEXT)');
          console.log('   - role_id (UUID, Foreign Key ke user_roles)');
          console.log('   - created_at (TIMESTAMP)');
          console.log('   - updated_at (TIMESTAMP)');
          console.log('');
          console.log('❌ Kolom "email" TIDAK ADA di tabel user_profiles!');
          console.log('💡 Email biasanya disimpan di tabel auth.users, bukan user_profiles.');
        }
      } else {
        console.log('✅ Test insert berhasil, menghapus test record...');
        await supabase
          .from('user_profiles')
          .delete()
          .eq('id', testRecord.id);
      }
    }
    
    // Check auth.users structure (if accessible)
    console.log('');
    console.log('🔍 Mencoba mengecek struktur auth.users...');
    
    try {
      // This will likely fail due to RLS, but let's try
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authData?.user) {
        console.log('✅ Auth user structure:');
        console.log('   - id:', authData.user.id);
        console.log('   - email:', authData.user.email);
        console.log('   - created_at:', authData.user.created_at);
        console.log('');
        console.log('💡 Email tersimpan di auth.users, bukan user_profiles!');
      } else {
        console.log('⚠️  Tidak bisa mengakses auth.users (tidak ada user yang login)');
      }
    } catch (authCheckError) {
      console.log('⚠️  Error checking auth.users:', authCheckError.message);
    }
    
    console.log('');
    console.log('📋 KESIMPULAN:');
    console.log('=' .repeat(50));
    console.log('❌ Kolom "email" TIDAK ADA di tabel user_profiles');
    console.log('✅ Email disimpan di tabel auth.users (sistem autentikasi Supabase)');
    console.log('💡 Untuk membuat admin user, gunakan auth.users.id sebagai referensi');
    console.log('');
    console.log('🔧 SQL yang benar untuk membuat admin user:');
    console.log('=' .repeat(60));
    console.log(`-- Pertama, buat user di auth melalui Supabase Dashboard atau Auth API
-- Kemudian, tambahkan profile dengan role admin:
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id
) 
SELECT 
    'USER_ID_FROM_AUTH_USERS',  -- Ganti dengan ID user dari auth.users
    'System Administrator',
    ur.id
FROM public.user_roles ur 
WHERE ur.role_name = 'admin';`);
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('check-user-profiles-structure.js')) {
  checkUserProfilesStructure();
}

export { checkUserProfilesStructure };