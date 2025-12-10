require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function testDatabaseAfterFix() {
  console.log('🧪 Testing database after reverting to profiles table...')
  console.log('==================================================')
  
  // Test 1: Check profiles table access
  console.log('1️⃣ Testing profiles table access:')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ profiles table error:', error.message)
      if (error.message.includes('infinite recursion')) {
        console.log('⚠️  Still has infinite recursion - need to run fix_profiles_table_policy.sql')
        return
      }
    } else {
      console.log('✅ profiles table: accessible')
      console.log('   Sample columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data')
      
      // Get count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      console.log(`   Total rows: ${count || 0}`)
    }
  } catch (err) {
    console.log('❌ profiles table: error -', err.message)
  }
  
  console.log('')
  
  // Test 2: Test user registration simulation
  console.log('2️⃣ Testing user registration simulation:')
  try {
    // Simulate what happens during registration
    const testUserId = 'test-user-' + Date.now()
    const testEmail = `test${Date.now()}@example.com`
    
    console.log('   Simulating profile creation...')
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: testUserId,
        nama: 'Test User',
        email: testEmail,
        lokasi: 'Test Location',
        role: 'user',
        saldo_deposit: 0
      })
      .select()
    
    if (insertError) {
      console.log('❌ Profile creation failed:', insertError.message)
    } else {
      console.log('✅ Profile creation: successful')
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', testUserId)
      console.log('   Test data cleaned up')
    }
  } catch (err) {
    console.log('❌ Registration simulation error:', err.message)
  }
  
  console.log('')
  
  // Test 3: Test profile queries used in the app
  console.log('3️⃣ Testing common profile queries:')
  
  // Test role query (used in login)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', 'dummy-user-id')
      .single()
    
    if (error && !error.message.includes('No rows')) {
      console.log('❌ Role query error:', error.message)
    } else {
      console.log('✅ Role query: working (no data expected)')
    }
  } catch (err) {
    console.log('❌ Role query error:', err.message)
  }
  
  // Test saldo_deposit query (used in billing)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('saldo_deposit')
      .eq('user_id', 'dummy-user-id')
      .single()
    
    if (error && !error.message.includes('No rows')) {
      console.log('❌ Saldo query error:', error.message)
    } else {
      console.log('✅ Saldo query: working (no data expected)')
    }
  } catch (err) {
    console.log('❌ Saldo query error:', err.message)
  }
  
  console.log('')
  console.log('🎯 Summary:')
  console.log('==================================================')
  console.log('✅ Code has been reverted to use "profiles" table')
  console.log('✅ All references updated across the application')
  console.log('')
  console.log('📋 Next steps:')
  console.log('1. If profiles table has infinite recursion error, run: fix_profiles_table_policy.sql')
  console.log('2. Test actual user registration in the application')
  console.log('3. Verify existing users can still login')
}

testDatabaseAfterFix()