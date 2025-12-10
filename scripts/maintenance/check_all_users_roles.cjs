const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  console.log('Pastikan file .env berisi:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAllUsersAndRoles() {
  try {
    console.log('🔍 Mengecek semua user di database Supabase...');
    console.log('=' .repeat(60));

    // 1. Note: Cannot access auth.users with publishable key
    console.log('\n⚠️  1. CATATAN: Tidak bisa mengakses auth.users dengan publishable key');
    console.log('    Hanya bisa mengecek user_profiles yang tersedia.');

    // 2. Get all profiles
    console.log('\n📋 2. MENGAMBIL DATA DARI PROFILES...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profileError) {
      console.error('❌ Error mengambil user profiles:', profileError.message);
      return;
    }

    console.log(`✅ Ditemukan ${profiles?.length || 0} profile di profiles`);

    // 3. Display user profiles data
     console.log('\n📊 3. DAFTAR PROFILES DAN ROLE:');
    console.log('=' .repeat(80));
    console.log('| No | User ID                          | Role        | Email       | Created     |');
    console.log('|----|----------------------------------|-------------|-------------|-------------|');

    let userCount = 0;
    const roleStats = {};

    profiles?.forEach((profile, index) => {
      userCount++;
      
      const userId = profile.user_id || 'N/A';
      const role = profile.role || 'no_role';
      const email = profile.email || 'N/A';
      const created = profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : 'N/A';
      
      // Count roles
      roleStats[role] = (roleStats[role] || 0) + 1;
      
      console.log(`| ${String(index + 1).padEnd(2)} | ${userId.padEnd(32)} | ${role.padEnd(11)} | ${email.padEnd(11)} | ${created.padEnd(11)} |`);
    });

    // 4. Display statistics
    console.log('\n📈 4. STATISTIK ROLE:');
    console.log('=' .repeat(40));
    Object.entries(roleStats).forEach(([role, count]) => {
      console.log(`${role.padEnd(20)}: ${count} user(s)`);
    });

    // 5. Additional profile information
    console.log('\n🔍 5. INFORMASI TAMBAHAN:');
    console.log('=' .repeat(50));
    
    // Check for admin users
    const adminUsers = profiles?.filter(p => p.role === 'admin' || p.role === 'super_admin') || [];
    console.log(`👑 Admin users: ${adminUsers.length}`);
    adminUsers.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email || admin.user_id} (${admin.role})`);
    });
    
    // Check for store owners
    const storeOwners = profiles?.filter(p => p.role === 'admin_toko' || p.role === 'store_owner') || [];
    console.log(`🏪 Store owners: ${storeOwners.length}`);
    storeOwners.forEach((owner, index) => {
      console.log(`   ${index + 1}. ${owner.email || owner.user_id} (${owner.role})`);
    });

    console.log('\n' + '=' .repeat(60));
    console.log(`📊 RINGKASAN: ${userCount} total user, ${Object.keys(roleStats).length} jenis role`);
    console.log('✅ Pengecekan selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the check
checkAllUsersAndRoles();