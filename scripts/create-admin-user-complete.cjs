const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Menggunakan service role key untuk bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env');
  console.error('   Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_SERVICE_ROLE_KEY ada di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUserComplete() {
  console.log('🔍 Membuat admin user lengkap...');

  const adminEmail = 'admin1@servisoo.com';
  const adminPassword = 'Admin123!@#';
  const adminRoleId = '3bc6d526-0060-4179-b9bd-1ba33c506bc2'; // admin role ID

  try {
    console.log('📋 Step 1: Memeriksa apakah user sudah ada...');
    
    // Cek di auth.users
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Error saat mengecek existing users:', listError.message);
      console.log('   Kemungkinan service role key tidak valid atau tidak ada permission');
      return;
    }

    const existingUser = existingUsers.users.find(user => user.email === adminEmail);
    
    let adminUserId;
    
    if (existingUser) {
      console.log('✅ User sudah ada di auth.users');
      console.log('   User ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      console.log('   Created:', existingUser.created_at);
      adminUserId = existingUser.id;
    } else {
      console.log('📋 Step 2: Membuat user baru di auth.users...');
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true // Auto-confirm email
      });

      if (createError) {
        console.log('❌ Error saat membuat user:', createError.message);
        return;
      }

      console.log('✅ User berhasil dibuat di auth.users');
      console.log('   User ID:', newUser.user.id);
      console.log('   Email:', newUser.user.email);
      adminUserId = newUser.user.id;
    }

    console.log('');
    console.log('📋 Step 3: Memeriksa apakah profile sudah ada...');
    
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', adminUserId)
      .single();

    if (profileCheckError && !profileCheckError.message.includes('No rows')) {
      console.log('❌ Error saat mengecek profile:', profileCheckError.message);
    }

    if (existingProfile) {
      console.log('✅ Profile sudah ada');
      console.log('   Profile:', existingProfile);
      
      // Update profile jika perlu
      console.log('📋 Step 4: Memperbarui profile...');
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: 'Administrator',
          role_id: adminRoleId,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminUserId)
        .select();

      if (updateError) {
        console.log('❌ Error saat update profile:', updateError.message);
      } else {
        console.log('✅ Profile berhasil diperbarui:', updatedProfile);
      }
    } else {
      console.log('📋 Step 4: Membuat profile baru...');
      
      const profileData = {
        id: adminUserId,
        full_name: 'Administrator',
        role_id: adminRoleId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select();

      if (insertError) {
        console.log('❌ Error saat membuat profile:', insertError.message);
        console.log('   Details:', insertError.details);
        console.log('   Hint:', insertError.hint);
        
        // Coba dengan struktur minimal
        console.log('\n   Mencoba dengan struktur minimal...');
        const minimalProfile = {
          id: adminUserId,
          role_id: adminRoleId
        };

        const { data: minimalResult, error: minimalError } = await supabase
          .from('user_profiles')
          .insert(minimalProfile)
          .select();

        if (minimalError) {
          console.log('   ❌ Error dengan struktur minimal:', minimalError.message);
        } else {
          console.log('   ✅ Profile minimal berhasil dibuat:', minimalResult);
        }
      } else {
        console.log('✅ Profile berhasil dibuat:', newProfile);
      }
    }

    console.log('');
    console.log('📋 Step 5: Verifikasi final...');
    
    const { data: finalProfile, error: finalError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_roles!inner(name, level)
      `)
      .eq('id', adminUserId)
      .single();

    if (finalError) {
      console.log('❌ Error saat verifikasi:', finalError.message);
    } else {
      console.log('✅ Verifikasi berhasil!');
      console.log('   Profile:', finalProfile);
    }

    console.log('');
    console.log('🎉 SELESAI!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', adminUserId);
    console.log('');
    console.log('💡 Sekarang coba login di:');
    console.log('   https://www.servisoo.com/admin/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUserComplete();