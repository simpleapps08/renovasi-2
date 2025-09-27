require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleInsert() {
  console.log('🧪 SIMPLE INSERT TEST');
  console.log('====================');
  console.log('📊 Project:', supabaseUrl.split('//')[1].split('.')[0]);
  
  // Test 1: Basic table access
  console.log('\n1️⃣ Testing table access...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Table access failed:', error.message);
      return;
    } else {
      console.log('✅ Table accessible');
    }
  } catch (err) {
    console.log('❌ Table access error:', err.message);
    return;
  }
  
  // Test 2: Try INSERT with different approaches
  console.log('\n2️⃣ Testing INSERT operations...');
  
  const testUserId = '550e8400-e29b-41d4-a716-446655440000';
  
  // Approach 1: Basic INSERT
  console.log('\n   Approach 1: Basic INSERT');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: testUserId,
        nama: 'Test User',
        email: 'test@example.com',
        role: 'user',
        saldo_deposit: 0
      });
    
    if (error) {
      console.log('   ❌ Basic INSERT failed:', error.message);
      console.log('   📋 Error details:', error);
    } else {
      console.log('   ✅ Basic INSERT successful');
    }
  } catch (err) {
    console.log('   ❌ Basic INSERT error:', err.message);
  }
  
  // Approach 2: INSERT with minimal data
  console.log('\n   Approach 2: Minimal INSERT');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        nama: 'Minimal User'
      });
    
    if (error) {
      console.log('   ❌ Minimal INSERT failed:', error.message);
    } else {
      console.log('   ✅ Minimal INSERT successful');
    }
  } catch (err) {
    console.log('   ❌ Minimal INSERT error:', err.message);
  }
  
  // Test 3: Check current policies
  console.log('\n3️⃣ Checking current RLS policies...');
  try {
    const { data, error } = await supabase
      .rpc('get_policies', { table_name: 'profiles' });
    
    if (error) {
      console.log('   ⚠️  Cannot check policies directly');
    } else {
      console.log('   📋 Policies found:', data);
    }
  } catch (err) {
    console.log('   ⚠️  Policy check not available');
  }
  
  // Cleanup
  console.log('\n🧹 Cleaning up test data...');
  try {
    await supabase
      .from('profiles')
      .delete()
      .in('user_id', [testUserId, '550e8400-e29b-41d4-a716-446655440001']);
    console.log('✅ Cleanup completed');
  } catch (err) {
    console.log('⚠️  Cleanup failed (expected if INSERT failed)');
  }
  
  console.log('\n🎯 DIAGNOSIS:');
  console.log('=============');
  console.log('If INSERT still fails after fix_rls_ultimate.sql:');
  console.log('1. RLS policies might still be too restrictive');
  console.log('2. Table permissions might be insufficient');
  console.log('3. Auth context might not be properly set');
  console.log('\n💡 Next step: Run fix_rls_ultimate.sql for complete reset');
}

testSimpleInsert().catch(console.error);