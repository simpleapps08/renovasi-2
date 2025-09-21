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

async function checkUserProfilesStructure() {
  console.log('🔍 Checking user_profiles table structure...');
  
  try {
    // Try to get table structure by attempting a select with *
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accessing user_profiles:', error.message);
      console.log('Code:', error.code);
    } else {
      console.log('✅ user_profiles accessible');
      console.log('📊 Sample data (if any):', data);
    }
    
    // Try different column combinations to understand structure
    console.log('\n🔍 Testing different column combinations...');
    
    const testColumns = [
      'id',
      'email', 
      'full_name',
      'role_id',
      'created_at',
      'updated_at',
      'user_id',
      'name',
      'role'
    ];
    
    for (const column of testColumns) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(column)
          .limit(1);
        
        if (!error) {
          console.log(`✅ Column '${column}' exists`);
        } else {
          console.log(`❌ Column '${column}' not found: ${error.message}`);
        }
      } catch (e) {
        console.log(`❌ Column '${column}' error: ${e.message}`);
      }
    }
    
    // Try to understand the actual structure by attempting inserts with different column sets
    console.log('\n🔍 Testing insert to understand required columns...');
    
    const testInsert1 = {
      id: crypto.randomUUID(),
      role_id: '3bc6d526-0060-4179-b9bd-1ba33c506bc2'
    };
    
    const { error: insertError1 } = await supabase
      .from('user_profiles')
      .insert(testInsert1);
    
    console.log('Insert test 1 (id + role_id):', insertError1?.message || 'Success');
    
    const testInsert2 = {
      id: crypto.randomUUID(),
      full_name: 'Test User',
      role_id: '3bc6d526-0060-4179-b9bd-1ba33c506bc2'
    };
    
    const { error: insertError2 } = await supabase
      .from('user_profiles')
      .insert(testInsert2);
    
    console.log('Insert test 2 (id + full_name + role_id):', insertError2?.message || 'Success');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the check
checkUserProfilesStructure().catch(console.error);