const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables manually
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
    return envVars;
  } catch (error) {
    console.error('❌ Could not read .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkProfilesTable() {
  console.log('🔍 Checking profiles table...');
  console.log('🔗 Connected to:', env.VITE_SUPABASE_URL);

  try {
    // Check profiles table structure
    console.log('\n📋 Getting all profiles data...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    console.log(`✅ Found ${profiles.length} profiles`);
    if (profiles.length > 0) {
      console.log('\nFirst profile structure:', profiles[0]);
      console.log('\nColumns:', Object.keys(profiles[0]));
      
      // Look for admin users
      const adminUsers = profiles.filter(p => p.email === 'admin@servisoo.com');
      console.log(`\n🔍 Found ${adminUsers.length} admin@servisoo.com users:`);
      adminUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Name: ${user.nama || user.full_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Location: ${user.lokasi || user.city}`);
        console.log(`   Saldo: Rp ${user.saldo_deposit || 0}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
      });
      
      // Look for the specific user ID
      const specificUser = profiles.find(p => p.id === 'd1191453-8f1f-4e5a-b1ef-b4a571d0bb4e');
      console.log('\n🎯 Specific user (d1191453-8f1f-4e5a-b1ef-b4a571d0bb4e):');
      if (specificUser) {
        console.log('   Found:', specificUser);
      } else {
        console.log('   Not found in profiles table');
      }
      
      // Show all users with their roles
      console.log('\n📊 All users by role:');
      const roleGroups = {};
      profiles.forEach(user => {
        const role = user.role || 'no_role';
        if (!roleGroups[role]) roleGroups[role] = [];
        roleGroups[role].push(user);
      });
      
      Object.entries(roleGroups).forEach(([role, users]) => {
        console.log(`\n${role}: ${users.length} users`);
        users.forEach(user => {
          console.log(`  - ${user.nama || user.full_name || 'No name'} (${user.email || 'No email'}) - ID: ${user.id}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProfilesTable();