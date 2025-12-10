const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function analyzeDuplicates() {
  console.log('🔍 Analyzing duplicate users and incomplete data...');
  console.log('🔗 Connected to:', process.env.VITE_SUPABASE_URL);

  try {
    // Get all users with their profiles and roles
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        user_id,
        full_name,
        email,
        phone,
        location,
        saldo_deposit,
        created_at,
        updated_at,
        user_roles!inner(
          role_name,
          role_level
        )
      `);

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    console.log(`\n📊 Total users found: ${users.length}`);

    // Group users by email to find duplicates
    const emailGroups = {};
    const incompleteUsers = [];
    const usersWithoutEmail = [];

    users.forEach(user => {
      // Check for incomplete data
      if (!user.email || !user.full_name) {
        if (!user.email) {
          usersWithoutEmail.push(user);
        } else {
          incompleteUsers.push(user);
        }
      }

      // Group by email for duplicate detection
      if (user.email) {
        if (!emailGroups[user.email]) {
          emailGroups[user.email] = [];
        }
        emailGroups[user.email].push(user);
      }
    });

    // Find duplicates
    const duplicates = Object.entries(emailGroups).filter(([email, users]) => users.length > 1);

    console.log('\n🔍 DUPLICATE ANALYSIS:');
    if (duplicates.length > 0) {
      duplicates.forEach(([email, duplicateUsers]) => {
        console.log(`\n📧 Email: ${email} (${duplicateUsers.length} duplicates)`);
        duplicateUsers.forEach((user, index) => {
          console.log(`   ${index + 1}. ID: ${user.id}`);
          console.log(`      User ID: ${user.user_id}`);
          console.log(`      Name: ${user.full_name || 'Not set'}`);
          console.log(`      Role: ${user.user_roles.role_name}`);
          console.log(`      Phone: ${user.phone || 'Not set'}`);
          console.log(`      Location: ${user.location || 'Not set'}`);
          console.log(`      Saldo: Rp ${user.saldo_deposit || 0}`);
          console.log(`      Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
          console.log(`      Updated: ${new Date(user.updated_at).toLocaleString('id-ID')}`);
        });
      });
    } else {
      console.log('✅ No email duplicates found');
    }

    console.log('\n🔍 USERS WITHOUT EMAIL:');
    if (usersWithoutEmail.length > 0) {
      usersWithoutEmail.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Name: ${user.full_name || 'Not set'}`);
        console.log(`   Role: ${user.user_roles.role_name}`);
        console.log(`   Phone: ${user.phone || 'Not set'}`);
        console.log(`   Location: ${user.location || 'Not set'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString('id-ID')}`);
      });
    } else {
      console.log('✅ All users have email addresses');
    }

    console.log('\n🔍 INCOMPLETE DATA USERS:');
    if (incompleteUsers.length > 0) {
      incompleteUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Name: ${user.full_name || 'MISSING'}`);
        console.log(`   Email: ${user.email || 'MISSING'}`);
        console.log(`   Role: ${user.user_roles.role_name}`);
        console.log(`   Issues: ${!user.full_name ? 'Missing name ' : ''}${!user.email ? 'Missing email' : ''}`);
      });
    } else {
      console.log('✅ All users have complete basic data');
    }

    // Special check for the specific user ID mentioned
    const specificUser = users.find(u => u.id === 'd1191453-8f1f-4e5a-b1ef-b4a571d0bb4e');
    console.log('\n🎯 SPECIFIC USER CHECK (d1191453-8f1f-4e5a-b1ef-b4a571d0bb4e):');
    if (specificUser) {
      console.log(`   Name: ${specificUser.full_name}`);
      console.log(`   Email: ${specificUser.email || 'NOT SET - NEEDS ajuz.priyono@gmail.com'}`);
      console.log(`   Role: ${specificUser.user_roles.role_name}`);
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeDuplicates();