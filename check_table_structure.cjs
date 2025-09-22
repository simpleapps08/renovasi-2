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

async function checkTableStructure() {
  console.log('🔍 Checking table structure...');
  console.log('🔗 Connected to:', env.VITE_SUPABASE_URL);

  try {
    // Check user_profiles table structure
    console.log('\n📋 Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error fetching user_profiles:', profilesError);
    } else {
      console.log('✅ user_profiles columns:', Object.keys(profiles[0] || {}));
      if (profiles[0]) {
        console.log('Sample data:', profiles[0]);
      }
    }

    // Check user_roles table structure
    console.log('\n📋 Checking user_roles table...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);

    if (rolesError) {
      console.error('❌ Error fetching user_roles:', rolesError);
    } else {
      console.log('✅ user_roles columns:', Object.keys(roles[0] || {}));
      if (roles[0]) {
        console.log('Sample data:', roles[0]);
      }
    }

    // Check auth.users (if accessible)
    console.log('\n📋 Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Cannot access auth.users directly:', authError.message);
    } else {
      console.log('✅ Current auth user structure:', authUsers.user ? Object.keys(authUsers.user) : 'No user');
    }

    // Try to get all users from user_profiles to see actual structure
    console.log('\n📋 Getting all user_profiles data...');
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('*');

    if (allError) {
      console.error('❌ Error fetching all profiles:', allError);
    } else {
      console.log(`✅ Found ${allProfiles.length} user profiles`);
      if (allProfiles.length > 0) {
        console.log('First profile structure:', allProfiles[0]);
        
        // Look for users with specific characteristics
        const adminUsers = allProfiles.filter(p => 
          (p.full_name && p.full_name.toLowerCase().includes('admin')) ||
          (p.email && p.email.includes('admin@servisoo.com'))
        );
        
        console.log(`\n🔍 Found ${adminUsers.length} potential admin users:`);
        adminUsers.forEach((user, index) => {
          console.log(`${index + 1}.`, user);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTableStructure();