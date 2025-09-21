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

async function checkUserProfilesDetailed() {
  try {
    console.log('🔍 Checking DETAILED user_profiles table structure...');
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Try to get detailed error by attempting insert with minimal data
    console.log('1️⃣ Testing insert to understand table structure...');
    
    const testId = crypto.randomUUID();
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: testId
        })
        .select();
        
      if (error) {
        console.log('❌ Insert error reveals table structure:');
        console.log('   Error:', error.message);
        console.log('   Code:', error.code);
        console.log('   Details:', error.details);
        console.log('');
        
        // Parse error to understand required columns
        if (error.message.includes('null value in column')) {
          const match = error.message.match(/null value in column "([^"]+)"/g);
          if (match) {
            console.log('🔍 Required columns (NOT NULL):');
            match.forEach(m => {
              const col = m.match(/"([^"]+)"/)[1];
              console.log(`   - ${col}`);
            });
          }
        }
        
        if (error.details && error.details.includes('Failing row contains')) {
          console.log('');
          console.log('📋 Actual table structure from error:');
          const failingRow = error.details.match(/Failing row contains \(([^)]+)\)/);
          if (failingRow) {
            const values = failingRow[1].split(', ');
            console.log(`   Total columns: ${values.length}`);
            console.log('   Values:', values.slice(0, 10).join(', ') + (values.length > 10 ? '...' : ''));
          }
        }
      } else {
        console.log('✅ Insert successful, cleaning up...');
        await supabase.from('user_profiles').delete().eq('id', testId);
      }
    } catch (insertError) {
      console.log('❌ Insert attempt failed:', insertError.message);
    }
    
    console.log('');
    console.log('2️⃣ Trying to query existing data...');
    
    try {
      const { data, error, count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .limit(1);
        
      if (error) {
        console.log('❌ Query error:', error.message);
      } else {
        console.log(`✅ Query successful, found ${count} records`);
        if (data && data.length > 0) {
          console.log('');
          console.log('📄 Sample record structure:');
          const record = data[0];
          Object.keys(record).forEach((key, index) => {
            console.log(`   ${index + 1}. ${key}: ${typeof record[key]} ${record[key] !== null ? `(${record[key]})` : '(null)'}`);
          });
        }
      }
    } catch (queryError) {
      console.log('❌ Query attempt failed:', queryError.message);
    }
    
    console.log('');
    console.log('3️⃣ Analyzing the error from user input...');
    console.log('=' .repeat(60));
    console.log('🚨 ERROR ANALYSIS:');
    console.log('   - Column "user_id" has NOT NULL constraint');
    console.log('   - But we are trying to insert with id column, not user_id');
    console.log('   - This suggests table has BOTH id AND user_id columns');
    console.log('');
    console.log('💡 POSSIBLE CAUSES:');
    console.log('   1. Table was created with user_id column instead of id');
    console.log('   2. Table has both id and user_id columns');
    console.log('   3. Migration created wrong column structure');
    console.log('');
    console.log('🔧 RECOMMENDED FIXES:');
    console.log('   Option A: Drop and recreate table with correct structure');
    console.log('   Option B: Alter table to remove user_id constraint');
    console.log('   Option C: Use user_id instead of id in inserts');
    console.log('');
    console.log('📋 SQL to check table structure:');
    console.log('   SELECT column_name, data_type, is_nullable');
    console.log('   FROM information_schema.columns');
    console.log('   WHERE table_name = \'user_profiles\' AND table_schema = \'public\';');
    console.log('');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('check-user-profiles-detailed.js')) {
  checkUserProfilesDetailed();
}

export { checkUserProfilesDetailed };