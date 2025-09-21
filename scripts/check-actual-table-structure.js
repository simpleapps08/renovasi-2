import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualTableStructure() {
  try {
    console.log('🔍 Checking ACTUAL table structures in database...');
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Check user_profiles table by trying different column combinations
    console.log('1️⃣ Testing user_profiles table structure...');
    
    const testColumns = [
      ['id'],
      ['id', 'created_at'],
      ['id', 'updated_at'],
      ['id', 'created_at', 'updated_at'],
      ['id', 'role_id'],
      ['id', 'role_id', 'created_at'],
      ['id', 'role_id', 'created_at', 'updated_at'],
      ['*']
    ];

    let workingColumns = [];
    
    for (const columns of testColumns) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(columns.join(', '))
          .limit(1);
          
        if (!error) {
          workingColumns = columns;
          console.log(`✅ Working columns: ${columns.join(', ')}`);
          
          if (data && data.length > 0) {
            console.log('📄 Sample data:');
            console.log(JSON.stringify(data[0], null, 2));
          } else {
            console.log('📭 Table is empty');
          }
          break;
        } else {
          console.log(`❌ Failed columns: ${columns.join(', ')} - ${error.message}`);
        }
      } catch (err) {
        console.log(`❌ Error testing columns: ${columns.join(', ')} - ${err.message}`);
      }
    }
    
    if (workingColumns.length === 0) {
      console.log('❌ Could not determine user_profiles structure');
      return;
    }
    
    console.log('');
    console.log('2️⃣ Testing user_roles table structure...');
    
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .limit(5);
        
      if (rolesError) {
        console.log(`❌ user_roles error: ${rolesError.message}`);
      } else {
        console.log('✅ user_roles table accessible');
        console.log(`📊 Records found: ${rolesData?.length || 0}`);
        
        if (rolesData && rolesData.length > 0) {
          console.log('📋 Available roles:');
          rolesData.forEach(role => {
            console.log(`   - ${role.role_name} (level ${role.role_level})`);
          });
          
          console.log('');
          console.log('📄 Sample role structure:');
          console.log(JSON.stringify(rolesData[0], null, 2));
        }
      }
    } catch (err) {
      console.log(`❌ Error checking user_roles: ${err.message}`);
    }
    
    console.log('');
    console.log('3️⃣ Generating correct SQL based on actual structure...');
    console.log('=' .repeat(60));
    
    if (workingColumns.includes('*') || workingColumns.includes('role_id')) {
      console.log('✅ user_profiles has role_id column');
      console.log('');
      console.log('🔧 Correct SQL to create admin profile:');
      console.log('```sql');
      console.log('-- Step 1: Create auth user manually in Supabase Dashboard');
      console.log('-- Step 2: Run this SQL (replace USER_ID with actual auth user ID)');
      console.log('');
      console.log('INSERT INTO public.user_profiles (');
      console.log('    id,');
      if (workingColumns.includes('*') || workingColumns.includes('role_id')) {
        console.log('    role_id');
      }
      console.log(') ');
      console.log('SELECT ');
      console.log('    \'USER_ID_FROM_AUTH_USERS\',  -- Replace with actual user ID');
      if (workingColumns.includes('*') || workingColumns.includes('role_id')) {
        console.log('    ur.id');
      }
      console.log('FROM public.user_roles ur ');
      console.log('WHERE ur.role_name = \'admin\';');
      console.log('```');
    } else {
      console.log('⚠️  user_profiles does not have role_id column');
      console.log('💡 Need to run migration to add role_id column first');
    }
    
    console.log('');
    console.log('📋 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`✅ user_profiles working columns: ${workingColumns.join(', ')}`);
    console.log('💡 Use only these columns in your SQL queries');
    console.log('');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('check-actual-table-structure.js')) {
  checkActualTableStructure();
}

export { checkActualTableStructure };