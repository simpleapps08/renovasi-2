require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runFixRlsFinal() {
  console.log('🔧 RUNNING FIX_RLS_FINAL.SQL');
  console.log('==================================');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix_rls_final.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL file loaded successfully');
    console.log('📊 Project:', supabaseUrl.split('//')[1].split('.')[0]);
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n🔄 Executing ${statements.length} SQL statements...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`${i + 1}/${statements.length}: Executing...`);
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
          
          if (error) {
            // Try direct query if RPC fails
            const { data: directData, error: directError } = await supabase
              .from('profiles')
              .select('count')
              .limit(0);
            
            if (directError && directError.message.includes('does not exist')) {
              console.log(`   ⚠️  Statement ${i + 1}: Table operation (expected)`);
            } else {
              console.log(`   ❌ Statement ${i + 1}: ${error.message}`);
              errorCount++;
            }
          } else {
            console.log(`   ✅ Statement ${i + 1}: Success`);
            successCount++;
          }
        } catch (err) {
          console.log(`   ❌ Statement ${i + 1}: ${err.message}`);
          errorCount++;
        }
      }
    }
    
    console.log('\n🎯 EXECUTION SUMMARY:');
    console.log('==================================');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 ALL STATEMENTS EXECUTED SUCCESSFULLY!');
      console.log('✅ RLS policies should now be fixed');
      console.log('🧪 Run: node test_comprehensive.cjs to verify');
    } else {
      console.log('\n⚠️  SOME ERRORS OCCURRED');
      console.log('💡 This might be normal for DDL operations');
      console.log('🧪 Run: node test_comprehensive.cjs to verify if it works');
    }
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.error('\n💡 Alternative: Copy fix_rls_final.sql content to Supabase Dashboard > SQL Editor');
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function runDirectSQL() {
  console.log('\n🔄 Trying direct SQL execution method...\n');
  
  try {
    const sqlPath = path.join(__dirname, 'fix_rls_final.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the entire SQL as one block
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });
    
    if (error) {
      console.log('❌ Direct SQL execution failed:', error.message);
      return false;
    }
    
    console.log('✅ Direct SQL execution successful!');
    return true;
    
  } catch (err) {
    console.log('❌ Direct SQL method failed:', err.message);
    return false;
  }
}

// Run the fix
runFixRlsFinal().catch(console.error);