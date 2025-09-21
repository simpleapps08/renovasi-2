require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Gunakan service role key untuk operasi admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Perlu service role key

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env');
  console.log('\n📝 Untuk membuat auth user, Anda perlu:');
  console.log('1. Dapatkan Service Role Key dari Supabase Dashboard → Settings → API');
  console.log('2. Tambahkan ke .env: SUPABASE_SERVICE_ROLE_KEY=your_service_key');
  console.log('3. Atau buat user manual di Supabase Dashboard → Authentication → Users');
  console.log('\n🔧 Manual Steps di Supabase Dashboard:');
  console.log('1. Buka Authentication → Users');
  console.log('2. Klik "Add user"');
  console.log('3. Email: admin@servisoo.com');
  console.log('4. Password: 09081982');
  console.log('5. User ID: d535ec7f-c84d-4cd7-a864-19d40bc7f316 (opsional, biarkan auto-generate)');
  console.log('6. Confirm email: Yes');
  console.log('7. Klik "Create user"');
  console.log('\n⚠️ Pastikan User ID di auth.users sama dengan ID di user_profiles!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAuthUser() {
  try {
    console.log('🚀 Membuat auth user untuk admin@servisoo.com...');
    
    // Step 1: Check if auth user already exists
    console.log('\n📋 Step 1: Checking existing auth user...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }
    
    const existingUser = existingUsers.users.find(user => user.email === 'admin@servisoo.com');
    
    if (existingUser) {
      console.log('💡 Auth user sudah ada:');
      console.log(`   🆔 ID: ${existingUser.id}`);
      console.log(`   📧 Email: ${existingUser.email}`);
      console.log(`   ✅ Confirmed: ${existingUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   📅 Created: ${existingUser.created_at}`);
      
      // Update user ID in user_profiles if different
      console.log('\n📋 Checking user_profiles sync...');
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', existingUser.id);
      
      if (profileError) {
        console.log('⚠️ Error checking profile:', profileError.message);
      } else if (profiles && profiles.length > 0) {
        console.log('✅ User profile sudah tersinkronisasi');
      } else {
        console.log('⚠️ User profile belum tersinkronisasi');
        console.log('\n📝 Update user_profiles dengan ID yang benar:');
        console.log('```sql');
        console.log('UPDATE public.user_profiles');
        console.log(`SET id = '${existingUser.id}'`);
        console.log('WHERE role_id = (SELECT id FROM user_roles WHERE role_name = \'admin\');');
        console.log('```');
      }
      
      return;
    }
    
    // Step 2: Create new auth user
    console.log('\n📋 Step 2: Membuat auth user baru...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@servisoo.com',
      password: '09081982',
      email_confirm: true,
      user_metadata: {
        full_name: 'System Administrator',
        role: 'admin'
      }
    });
    
    if (createError) {
      console.error('❌ Error membuat auth user:', createError.message);
      return;
    }
    
    console.log('✅ Auth user berhasil dibuat:');
    console.log(`   🆔 ID: ${newUser.user.id}`);
    console.log(`   📧 Email: ${newUser.user.email}`);
    
    // Step 3: Update user_profiles dengan ID yang benar
    console.log('\n📋 Step 3: Sinkronisasi dengan user_profiles...');
    console.log('\n📝 Jalankan SQL berikut untuk sinkronisasi:');
    console.log('```sql');
    console.log('UPDATE public.user_profiles');
    console.log(`SET id = '${newUser.user.id}'`);
    console.log('WHERE role_id = (SELECT id FROM user_roles WHERE role_name = \'admin\');');
    console.log('```');
    
    console.log('\n🎉 Selesai! Admin user siap digunakan.');
    console.log('\n📋 Langkah selanjutnya:');
    console.log('1. Jalankan SQL sinkronisasi di atas');
    console.log('2. Test login dengan admin@servisoo.com / 09081982');
    console.log('3. Verifikasi role admin di aplikasi');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Jalankan fungsi
createAuthUser();