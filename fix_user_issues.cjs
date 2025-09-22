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

async function fixUserIssues() {
  console.log('🔧 Fixing user issues...');
  console.log('🔗 Connected to:', env.VITE_SUPABASE_URL);

  try {
    // Step 1: Add email to specific user ID (ajuz)
    console.log('\n📧 Adding email to user ajuz (ID: d1191453-8f1f-4e5a-b1ef-b4a571d0bb4e)');
    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      .update({ email: 'ajuz.priyono@gmail.com' })
      .eq('id', 'd1191453-8f1f-4e5a-b1ef-b4a571d0bb4e');

    if (updateError) {
      console.error('❌ Error updating email:', updateError);
    } else {
      console.log('✅ Email updated successfully for ajuz');
    }

    // Step 2: Check duplicate admin@servisoo.com users
    console.log('\n🔍 Checking admin@servisoo.com duplicates...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@servisoo.com')
      .order('created_at', { ascending: true });

    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError);
      return;
    }

    console.log(`Found ${adminUsers.length} users with admin@servisoo.com:`);
    adminUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ID: ${user.id}`);
      console.log(`   User ID: ${user.user_id}`);
      console.log(`   Name: ${user.nama}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone: ${user.phone || 'Not set'}`);
      console.log(`   Location: ${user.lokasi || 'Not set'}`);
      console.log(`   Saldo: Rp ${user.saldo_deposit || 0}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
    });

    // Step 3: Identify which duplicate to keep (prefer admin role for admin portal)
    if (adminUsers.length > 1) {
      console.log('\n🎯 Analyzing which duplicate to keep...');
      
      // Score each user based on completeness and role preference
      const scoredUsers = adminUsers.map(user => {
        let score = 0;
        if (user.phone) score += 1;
        if (user.lokasi) score += 1;
        if (user.saldo_deposit > 0) score += 2;
        // Prefer admin role over super_admin for admin portal login
        if (user.role === 'admin') score += 5;
        if (user.role === 'super_admin') score += 3;
        
        return { ...user, score };
      });

      scoredUsers.sort((a, b) => b.score - a.score);
      
      console.log('\nScored users (higher score = better to keep):');
      scoredUsers.forEach((user, index) => {
        console.log(`${index + 1}. Score: ${user.score} - Role: ${user.role} - ID: ${user.id}`);
      });

      const userToKeep = scoredUsers[0];
      const usersToDelete = scoredUsers.slice(1);

      console.log(`\n✅ Keeping user: ${userToKeep.id} (Role: ${userToKeep.role})`);
      console.log(`❌ Will delete: ${usersToDelete.map(u => `${u.id} (${u.role})`).join(', ')}`);

      // Delete duplicate users
      for (const userToDelete of usersToDelete) {
        console.log(`\n🗑️ Deleting duplicate user: ${userToDelete.id} (${userToDelete.role})`);
        
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userToDelete.id);

        if (deleteError) {
          console.error('❌ Error deleting user:', deleteError);
        } else {
          console.log('✅ Duplicate user deleted successfully');
        }
      }
    } else {
      console.log('✅ No duplicates found for admin@servisoo.com');
    }

    // Step 4: Verify the remaining admin user
    console.log('\n🔍 Verifying remaining admin@servisoo.com user...');
    const { data: finalAdminUser, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@servisoo.com')
      .single();

    if (finalError) {
      console.error('❌ Error fetching final admin user:', finalError);
    } else {
      console.log('✅ Final admin user:');
      console.log(`   ID: ${finalAdminUser.id}`);
      console.log(`   User ID: ${finalAdminUser.user_id}`);
      console.log(`   Name: ${finalAdminUser.nama}`);
      console.log(`   Email: ${finalAdminUser.email}`);
      console.log(`   Role: ${finalAdminUser.role}`);
      console.log(`   Phone: ${finalAdminUser.phone || 'Not set'}`);
      console.log(`   Location: ${finalAdminUser.lokasi || 'Not set'}`);
    }

    // Step 5: Verify ajuz user email update
    console.log('\n🔍 Verifying ajuz user email update...');
    const { data: ajuzUser, error: ajuzError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'd1191453-8f1f-4e5a-b1ef-b4a571d0bb4e')
      .single();

    if (ajuzError) {
      console.error('❌ Error fetching ajuz user:', ajuzError);
    } else {
      console.log('✅ Ajuz user:');
      console.log(`   ID: ${ajuzUser.id}`);
      console.log(`   User ID: ${ajuzUser.user_id}`);
      console.log(`   Name: ${ajuzUser.nama}`);
      console.log(`   Email: ${ajuzUser.email}`);
      console.log(`   Role: ${ajuzUser.role}`);
    }

    console.log('\n🎉 User issues fixed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUserIssues();