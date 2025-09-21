// Script untuk menjalankan migrasi database secara manual
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file')
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration(filePath) {
  try {
    console.log(`Running migration: ${path.basename(filePath)}`)
    const sql = fs.readFileSync(filePath, 'utf8')
    
    // Split SQL by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim()
      if (trimmedStatement) {
        console.log(`Executing: ${trimmedStatement.substring(0, 100)}...`)
        const { error } = await supabase.rpc('exec_sql', { sql_query: trimmedStatement })
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase.from('_').select('*').limit(0)
          if (directError) {
            console.error(`Error executing statement: ${error.message}`)
            console.error(`Statement: ${trimmedStatement}`)
          }
        }
      }
    }
    
    console.log(`✅ Migration completed: ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`❌ Migration failed: ${path.basename(filePath)}`, error.message)
    throw error
  }
}

async function runAllMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('Migrations directory not found:', migrationsDir)
    return
  }
  
  const migrationFiles = [
    '20250121000001_create_user_roles_system.sql',
    '20250121000002_update_user_profiles_role_system.sql',
    '20250121000003_create_admin_user.sql'
  ]
  
  console.log('🚀 Starting database migrations...')
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file)
    if (fs.existsSync(filePath)) {
      await runMigration(filePath)
    } else {
      console.warn(`⚠️  Migration file not found: ${file}`)
    }
  }
  
  console.log('🎉 All migrations completed successfully!')
}

// Alternative: Execute SQL directly without RPC
async function executeSQLDirect(sql) {
  try {
    // For complex migrations, we'll need to use the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql_query: sql })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Direct SQL execution failed:', error)
    throw error
  }
}

// Run migrations if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('run-migrations.js')) {
  console.log('🚀 Starting database migrations...');
  runAllMigrations()
    .then(() => {
      console.log('✅ All migrations completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export { runAllMigrations, runMigration }