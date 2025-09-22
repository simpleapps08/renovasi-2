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

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkProfiles() {
  console.log('🔍 Checking profiles data...');
  
  try {
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }
    
    console.log(`📊 Total profiles found: ${profiles.length}`);
    
    // Group by role
    const roleGroups = {};
    profiles.forEach(profile => {
      const role = profile.role || 'no_role';
      if (!roleGroups[role]) {
        roleGroups[role] = [];
      }
      roleGroups[role].push(profile);
    });
    
    console.log('\n📋 Profiles by role:');
    Object.keys(roleGroups).forEach(role => {
      console.log(`  ${role}: ${roleGroups[role].length} users`);
      roleGroups[role].forEach(profile => {
        console.log(`    - ID: ${profile.id}`);
        console.log(`      Name: ${profile.full_name || 'No name'}`);
        console.log(`      Email: ${profile.email || 'No email'}`);
        console.log(`      Created: ${profile.created_at}`);
        console.log('');
      });
    });
    
    // Check for duplicates
    const emailMap = {};
    const duplicates = [];
    
    profiles.forEach(profile => {
      if (profile.email) {
        if (emailMap[profile.email]) {
          duplicates.push({
            email: profile.email,
            profiles: [emailMap[profile.email], profile]
          });
        } else {
          emailMap[profile.email] = profile;
        }
      }
    });
    
    if (duplicates.length > 0) {
      console.log('⚠️  Found duplicate emails:');
      duplicates.forEach(dup => {
        console.log(`  Email: ${dup.email}`);
        dup.profiles.forEach(profile => {
          console.log(`    - ID: ${profile.id}, Role: ${profile.role}`);
        });
      });
    } else {
      console.log('✅ No duplicate emails found');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkProfiles();