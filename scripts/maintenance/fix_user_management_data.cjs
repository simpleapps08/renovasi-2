const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env file manually
let envVars = {};
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      // Remove quotes from value if present
      let cleanValue = value.trim();
      if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) || 
          (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
        cleanValue = cleanValue.slice(1, -1);
      }
      envVars[key.trim()] = cleanValue;
    }
  });
} catch (error) {
  console.error('Error reading .env file:', error.message);
  process.exit(1);
}

// Debug environment variables
console.log('Environment variables loaded:');
console.log('VITE_SUPABASE_URL:', envVars.VITE_SUPABASE_URL ? 'Found' : 'Missing');
console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', envVars.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Found' : 'Missing');

if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.log('Available keys:', Object.keys(envVars));
  process.exit(1);
}

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_PUBLISHABLE_KEY
);

console.log('✅ Supabase client initialized');

async function fixUserManagementData() {
  console.log('🔧 Memperbaiki data untuk User Management...');
  
  try {
    // 1. Ambil semua data dari tabel profiles
    console.log('\n📊 Menganalisis data profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    console.log(`📋 Total profiles: ${profiles.length}`);
    
    // 2. Ambil semua auth users
    console.log('\n👥 Mengambil data auth users...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log(`👤 Total auth users: ${authData.users.length}`);
    
    // 3. Buat map dari user_id ke email
    const emailMap = new Map();
    authData.users.forEach(user => {
      emailMap.set(user.id, user.email);
    });
    
    // 4. Identifikasi duplikat berdasarkan user_id
    const userIdMap = new Map();
    const duplicates = [];
    const validProfiles = [];
    
    profiles.forEach(profile => {
      if (userIdMap.has(profile.user_id)) {
        // Ini duplikat
        const existing = userIdMap.get(profile.user_id);
        duplicates.push({
          existing: existing,
          duplicate: profile
        });
      } else {
        userIdMap.set(profile.user_id, profile);
        validProfiles.push(profile);
      }
    });
    
    console.log(`\n🔍 Ditemukan ${duplicates.length} duplikat`);
    console.log(`✅ Profile valid: ${validProfiles.length}`);
    
    // 5. Hapus duplikat (keep yang pertama/oldest)
    if (duplicates.length > 0) {
      console.log('\n🗑️ Menghapus duplikat...');
      
      for (const dup of duplicates) {
        console.log(`Menghapus duplikat: ${dup.duplicate.nama || 'No name'} (ID: ${dup.duplicate.id})`);
        
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', dup.duplicate.id);
        
        if (deleteError) {
          console.error(`❌ Error deleting duplicate ${dup.duplicate.id}:`, deleteError);
        } else {
          console.log(`✅ Duplikat dihapus: ${dup.duplicate.id}`);
        }
      }
    }
    
    // 6. Update profiles yang tidak memiliki email di nama tapi ada di auth
    console.log('\n📧 Memperbaiki data email dan nama...');
    
    for (const profile of validProfiles) {
      const email = emailMap.get(profile.user_id);
      const authUser = authData.users.find(u => u.id === profile.user_id);
      
      let needsUpdate = false;
      const updates = {};
      
      // Jika nama adalah email, tapi ada nama yang lebih baik di auth metadata
      if (profile.nama && profile.nama.includes('@') && authUser) {
        const betterName = authUser.user_metadata?.name || 
                          authUser.user_metadata?.full_name;
        
        if (betterName && betterName !== profile.nama) {
          updates.nama = betterName;
          updates.full_name = betterName;
          needsUpdate = true;
        }
      }
      
      // Pastikan ada full_name
      if (!profile.full_name && profile.nama) {
        updates.full_name = profile.nama;
        needsUpdate = true;
      }
      
      // Pastikan role tidak null
      if (!profile.role) {
        updates.role = 'user';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Updating profile: ${profile.nama} (${email})`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', profile.id);
        
        if (updateError) {
          console.error(`❌ Error updating profile ${profile.id}:`, updateError);
        } else {
          console.log(`✅ Profile updated: ${profile.id}`);
        }
      }
    }
    
    // 7. Verifikasi hasil akhir
    console.log('\n🔍 Verifikasi hasil akhir...');
    
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id, user_id, nama, full_name, role')
      .order('created_at', { ascending: false });
    
    if (finalError) {
      console.error('❌ Error in final verification:', finalError);
      return;
    }
    
    console.log(`\n📊 Hasil akhir:`);
    console.log(`Total profiles: ${finalProfiles.length}`);
    
    // Group by role
    const roleGroups = {};
    finalProfiles.forEach(profile => {
      const role = profile.role || 'no_role';
      if (!roleGroups[role]) {
        roleGroups[role] = [];
      }
      roleGroups[role].push(profile);
    });
    
    Object.keys(roleGroups).forEach(role => {
      console.log(`${role}: ${roleGroups[role].length} users`);
    });
    
    console.log('\n✅ Perbaikan data selesai!');
    console.log('\n📝 Langkah selanjutnya:');
    console.log('1. Refresh halaman Admin User Management');
    console.log('2. Periksa apakah data user sudah tampil dengan benar');
    console.log('3. Test fungsi create, edit, dan delete user');
    
  } catch (error) {
    console.error('❌ Error in fixUserManagementData:', error);
  }
}

fixUserManagementData();