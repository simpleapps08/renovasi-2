import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
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

async function runSingleMigration(migrationFile) {
  try {
    console.log(`🚀 Running migration: ${migrationFile}`);
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Read migration file
    const migrationPath = join(process.cwd(), 'migrations', migrationFile);
    let migrationSQL;
    
    try {
      migrationSQL = readFileSync(migrationPath, 'utf8');
    } catch (err) {
      console.error(`❌ Could not read migration file: ${migrationFile}`);
      console.error(`   Path: ${migrationPath}`);
      console.error(`   Error: ${err.message}`);
      return;
    }

    console.log(`📄 Migration file loaded: ${migrationFile}`);
    console.log(`📏 SQL length: ${migrationSQL.length} characters`);
    console.log('');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'COMMIT');

    console.log(`🔧 Found ${statements.length} SQL statements to execute`);
    console.log('');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim().length === 0) continue;
      
      console.log(`📝 Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
          
          // Try alternative method for DDL statements
          if (statement.toUpperCase().includes('ALTER TABLE') || 
              statement.toUpperCase().includes('CREATE') ||
              statement.toUpperCase().includes('DROP')) {
            console.log('   🔄 Trying direct query...');
            
            try {
              const { error: directError } = await supabase
                .from('_temp_migration')
                .select('*')
                .limit(0);
                
              // This will fail, but we can try to execute the DDL via RPC
              console.log('   ⚠️  DDL statements require Service Role Key or manual execution');
            } catch (directErr) {
              console.log('   ⚠️  DDL statements require Service Role Key or manual execution');
            }
          }
        } else {
          console.log('   ✅ Success');
          if (data) {
            console.log(`   📊 Result: ${JSON.stringify(data).substring(0, 200)}`);
          }
        }
      } catch (err) {
        console.log(`   ❌ Unexpected error: ${err.message}`);
      }
      
      console.log('');
    }

    console.log('🎉 Migration execution completed!');
    console.log('');
    console.log('💡 If you see errors above, you may need to:');
    console.log('   1. Run the SQL manually in Supabase Dashboard → SQL Editor');
    console.log('   2. Use Service Role Key instead of Publishable Key');
    console.log('   3. Check if the migration has already been applied');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please specify migration file name');
  console.error('Usage: node scripts/run-single-migration.js <migration-file.sql>');
  console.error('');
  console.error('Available migrations:');
  console.error('  - 20250121000001_create_user_roles.sql');
  console.error('  - 20250121000002_modify_user_profiles.sql');
  console.error('  - 20250121000003_create_admin_user.sql');
  process.exit(1);
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('run-single-migration.js')) {
  runSingleMigration(migrationFile);
}

export { runSingleMigration };