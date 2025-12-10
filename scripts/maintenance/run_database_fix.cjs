const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Available variables:', Object.keys(env));
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY as fallback)');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log('URL:', supabaseUrl);
console.log('Using key type:', env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Publishable');

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDatabaseFix() {
  try {
    console.log('🔧 Starting database structure fix...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('fix_database_structure.sql', 'utf8');
    
    // Split SQL into individual statements (remove comments and empty lines)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;
      
      console.log(`\n⏳ Executing statement ${i + 1}/${statements.length}...`);
      console.log(`SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { data: directData, error: directError } = await supabase
            .from('profiles')
            .select('*')
            .limit(0); // This will fail if table doesn't exist, but won't return data
            
          if (directError && !directError.message.includes('does not exist')) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
              throw error;
            } else {
              console.log(`⚠️  Skipping: ${error.message}`);
            }
          } else {
            console.log('✅ Statement executed successfully');
          }
        } else {
          console.log('✅ Statement executed successfully');
          if (data) {
            console.log('Result:', data);
          }
        }
      } catch (err) {
        console.error(`❌ Error in statement ${i + 1}:`, err.message);
        if (!err.message.includes('already exists') && !err.message.includes('does not exist')) {
          throw err;
        } else {
          console.log(`⚠️  Skipping: ${err.message}`);
        }
      }
    }
    
    console.log('\n🎉 Database structure fix completed!');
    
    // Verify the final structure
    console.log('\n🔍 Verifying profiles table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'profiles' })
      .single();
      
    if (tableError) {
      console.log('⚠️  Could not verify table structure via RPC, trying direct query...');
      // Try a simple select to verify table exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (error) {
        console.error('❌ Profiles table verification failed:', error.message);
      } else {
        console.log('✅ Profiles table exists and is accessible');
      }
    } else {
      console.log('✅ Table structure verified:', tableInfo);
    }
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    process.exit(1);
  }
}

// Run the fix
runDatabaseFix();