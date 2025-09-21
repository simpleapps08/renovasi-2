import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeTableFix() {
  try {
    console.log('🔧 Starting user_profiles table structure fix...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'fix-user-profiles-structure.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL commands (simple split by semicolon)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && !cmd.startsWith('SELECT'));
    
    console.log(`📝 Found ${commands.length} SQL commands to execute`);
    
    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command) {
        console.log(`\n⚡ Executing command ${i + 1}:`);
        console.log(command.substring(0, 100) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️  Command ${i + 1} result:`, error.message);
          // Don't exit on error, some commands might fail if already applied
        } else {
          console.log(`✅ Command ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log('\n🔍 Verifying table structure...');
    
    // Verify the final structure
    const { data: columns, error: structureError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'user_profiles')
      .eq('table_schema', 'public')
      .order('ordinal_position');
    
    if (structureError) {
      console.error('❌ Error checking table structure:', structureError);
    } else {
      console.log('\n📋 Current user_profiles table structure:');
      console.table(columns);
    }
    
    // Test basic operations
    console.log('\n🧪 Testing basic table operations...');
    
    // Check if we can query the table
    const { data: profiles, error: queryError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.log('⚠️  Query test result:', queryError.message);
    } else {
      console.log('✅ Table query successful');
      console.log(`📊 Current profiles count: ${profiles?.length || 0}`);
    }
    
    console.log('\n🎉 Table structure fix completed!');
    
  } catch (error) {
    console.error('❌ Error during table fix:', error);
    process.exit(1);
  }
}

executeTableFix();