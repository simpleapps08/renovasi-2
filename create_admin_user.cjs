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
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...');
    
    // Ganti dengan email admin yang diinginkan
    const adminEmail = 'admin@servisoo.com';
    const adminName = 'Admin Servisoo';
    
    console.log(`📧 Setting up admin profile for: ${adminEmail}`);
    
    // Cek apakah user sudah ada di auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('⚠️  Cannot access auth.users (need service role key), trying direct profile creation...');
    }
    
    let userId = null;
    if (authUsers) {
      const existingUser = authUsers.users.find(user => user.email === adminEmail);
      if (existingUser) {
        userId = existingUser.id;
        console.log(`✅ Found existing user: ${userId}`);
      }
    }
    
    if (!userId) {
      console.log('⚠️  User not found in auth.users. You need to:');
      console.log('1. Sign up with email:', adminEmail);
      console.log('2. Then run this script again');
      console.log('\nOr manually insert/update the profile with a known user_id');
      
      // Try to get any existing user ID for demo
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .limit(1);
        
      if (profiles && profiles.length > 0) {
        userId = profiles[0].user_id;
        console.log(`\n🔄 Using existing user_id for demo: ${userId}`);
      } else {
        console.log('\n❌ No existing users found. Please sign up first.');
        return;
      }
    }
    
    // Insert atau update profile admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        nama: adminName,
        email: adminEmail,
        role: 'admin',
        saldo_deposit: 0
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError.message);
      throw profileError;
    }
    
    console.log('✅ Admin profile created/updated successfully!');
    console.log('Profile data:', profile);
    
    // Verifikasi admin role
    const { data: adminCheck, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');
      
    if (checkError) {
      console.error('❌ Error checking admin users:', checkError.message);
    } else {
      console.log(`\n👥 Total admin users: ${adminCheck.length}`);
      adminCheck.forEach(admin => {
        console.log(`- ${admin.nama || admin.email} (${admin.user_id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();