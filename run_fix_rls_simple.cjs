require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSimpleRLSFix() {
  console.log('🔧 RUNNING RLS FIX - SIMPLE METHOD');
  console.log('=====================================');
  console.log('📊 Project:', supabaseUrl.split('//')[1].split('.')[0]);
  
  try {
    console.log('\n🧪 Step 1: Testing current table access...');
    
    // Test current access
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Current table access failed:', testError.message);
      console.log('🔧 This confirms we need to fix RLS policies');
    } else {
      console.log('✅ Table accessible, checking policies...');
    }
    
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('=====================================');
    console.log('⚠️  Due to RLS security restrictions, you need to run the SQL manually:');
    console.log('');
    console.log('1️⃣ Open Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2️⃣ Go to your project: ' + supabaseUrl.split('//')[1].split('.')[0]);
    console.log('3️⃣ Navigate to: SQL Editor');
    console.log('4️⃣ Copy and paste the content of fix_rls_final.sql');
    console.log('5️⃣ Click "Run" to execute');
    console.log('');
    console.log('📄 SQL File Location: fix_rls_final.sql');
    console.log('');
    
    // Show the SQL content for easy copying
    const sqlPath = path.join(__dirname, 'fix_rls_final.sql');
    if (fs.existsSync(sqlPath)) {
      console.log('📋 SQL CONTENT TO COPY:');
      console.log('=====================================');
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      console.log(sqlContent);
      console.log('=====================================');
    }
    
    console.log('\n🧪 After running the SQL, test with:');
    console.log('   node test_comprehensive.cjs');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runSimpleRLSFix().catch(console.error);