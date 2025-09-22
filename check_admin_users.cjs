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

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking admin users in database...');
    console.log('🔗 Connected to:', supabaseUrl);
    console.log('');
    
    // Get all users with admin role
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: true });
      
    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError.message);
      throw adminError;
    }
    
    console.log(`👥 Found ${adminUsers.length} admin user(s):\n`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('\n💡 To create an admin user, run: node create_admin_user.cjs');
      return;
    }
    
    // Display admin users in a table format
    adminUsers.forEach((user, index) => {
      console.log(`📋 Admin User #${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   User ID: ${user.user_id}`);
      console.log(`   Name: ${user.nama || 'Not set'}`);
      console.log(`   Email: ${user.email || 'Not set'}`);
      console.log(`   Phone: ${user.phone || 'Not set'}`);
      console.log(`   Location: ${user.lokasi || user.city || 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Saldo Deposit: Rp ${user.saldo_deposit || 0}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
      console.log(`   Updated: ${new Date(user.updated_at).toLocaleString('id-ID')}`);
      console.log('');
    });
    
    // Check for super_admin users too
    const { data: superAdminUsers, error: superAdminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'super_admin')
      .order('created_at', { ascending: true });
      
    if (superAdminError) {
      console.log('⚠️  Could not check for super_admin users:', superAdminError.message);
    } else if (superAdminUsers.length > 0) {
      console.log(`🔥 Found ${superAdminUsers.length} super admin user(s):\n`);
      
      superAdminUsers.forEach((user, index) => {
        console.log(`👑 Super Admin User #${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Name: ${user.nama || 'Not set'}`);
        console.log(`   Email: ${user.email || 'Not set'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
        console.log('');
      });
    }
    
    // Get total user count for context
    const { count: totalUsers, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
      
    if (!countError) {
      console.log(`📊 Total users in database: ${totalUsers}`);
      console.log(`📊 Admin users: ${adminUsers.length}`);
      console.log(`📊 Super admin users: ${superAdminUsers?.length || 0}`);
      console.log(`📊 Regular users: ${totalUsers - adminUsers.length - (superAdminUsers?.length || 0)}`);
    }
    
    // Check role distribution
    const { data: roleStats, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .not('role', 'is', null);
      
    if (!roleError && roleStats) {
      console.log('\n📈 Role Distribution:');
      const roleCounts = roleStats.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`   ${role}: ${count} users`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to check admin users:', error.message);
    process.exit(1);
  }
}

// Run the check
checkAdminUsers();