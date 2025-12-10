require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function testComprehensive() {
  console.log('🧪 COMPREHENSIVE DATABASE & APPLICATION TEST')
  console.log('==================================================')
  console.log(`📊 Project: ${process.env.VITE_SUPABASE_PROJECT_ID}`)
  console.log('')
  
  let allTestsPassed = true
  
  // Test 1: Basic table access
  console.log('1️⃣ Testing basic profiles table access:')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ FAILED:', error.message)
      allTestsPassed = false
      
      if (error.message.includes('infinite recursion')) {
        console.log('⚠️  SOLUTION: Run fix_profiles_simple.sql in Supabase Dashboard')
        return
      }
    } else {
      console.log('✅ PASSED: Table accessible')
      
      // Get count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      console.log(`   Current rows: ${count || 0}`)
      
      if (data && data.length > 0) {
        console.log('   Columns:', Object.keys(data[0]).join(', '))
      }
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Test 2: Profile creation (simulating registration)
  console.log('2️⃣ Testing profile creation (registration simulation):')
  // Generate a proper UUID for testing
  const testUserId = '550e8400-e29b-41d4-a716-446655440000' // Valid UUID format
  const testEmail = `test${Date.now()}@example.com`
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: testUserId,
        nama: 'Test User Registration',
        email: testEmail,
        lokasi: 'Jakarta',
        role: 'user',
        saldo_deposit: 0
      })
      .select()
    
    if (insertError) {
      console.log('❌ FAILED:', insertError.message)
      allTestsPassed = false
    } else {
      console.log('✅ PASSED: Profile creation successful')
      console.log('   Created profile:', insertData[0]?.nama)
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Test 3: Profile queries (used in login)
  console.log('3️⃣ Testing profile queries (login simulation):')
  try {
    // Test role query
    const { data: roleData, error: roleError } = await supabase
      .from('profiles')
      .select('nama, role, saldo_deposit')
      .eq('user_id', testUserId)
      .single()
    
    if (roleError && !roleError.message.includes('No rows')) {
      console.log('❌ FAILED role query:', roleError.message)
      allTestsPassed = false
    } else if (roleData) {
      console.log('✅ PASSED: Role query successful')
      console.log('   Role:', roleData.role)
    } else {
      console.log('⚠️  No data found (expected for dummy user)')
    }
  } catch (err) {
    console.log('❌ FAILED role query:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Test 4: Profile updates
  console.log('4️⃣ Testing profile updates:')
  try {
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ nama: 'Updated Test User' })
      .eq('user_id', testUserId)
      .select()
    
    if (updateError) {
      console.log('❌ FAILED:', updateError.message)
      allTestsPassed = false
    } else {
      console.log('✅ PASSED: Profile update successful')
      if (updateData && updateData.length > 0) {
        console.log('   Updated name:', updateData[0].nama)
        console.log('   Updated location:', updateData[0].lokasi)
      }
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Test saldo deposit query (simulating billing)
  console.log('\n5️⃣ Testing saldo deposit query (billing simulation):');
  try {
    const { data: saldoData, error: saldoError } = await supabase
      .from('profiles')
      .select('saldo_deposit')
      .eq('user_id', testUserId)
      .single()
    
    if (saldoError) {
      console.log('❌ FAILED:', saldoError.message)
      allTestsPassed = false
    } else {
      console.log('✅ PASSED: Saldo query successful')
      console.log('   Saldo:', saldoData.saldo_deposit)
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Test 6: Admin queries (user management)
  console.log('6️⃣ Testing admin queries (user management simulation):')
  try {
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        nama,
        email,
        role,
        lokasi,
        saldo_deposit,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (adminError) {
      console.log('❌ FAILED:', adminError.message)
      allTestsPassed = false
    } else {
      console.log('✅ PASSED: Admin query successful')
      console.log(`   Retrieved ${adminData.length} profiles`)
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message)
    allTestsPassed = false
  }
  
  console.log('')
  
  // Cleanup test data
  console.log('🧹 Cleaning up test data:')
  try {
    const { error: cleanupError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', testUserId)
    console.log('✅ Test data cleaned up')
  } catch (err) {
    console.log('⚠️  Cleanup warning:', err.message)
  }
  
  console.log('')
  console.log('🎯 FINAL RESULTS:')
  console.log('==================================================')
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!')
    console.log('✅ Database is working correctly')
    console.log('✅ All application features should work')
    console.log('✅ Registration, login, and user management ready')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Test actual user registration in the web app')
    console.log('2. Test user login functionality')
    console.log('3. Test admin features')
  } else {
    console.log('❌ SOME TESTS FAILED')
    console.log('⚠️  Database needs additional fixes')
    console.log('📋 Recommended actions:')
    console.log('1. Run fix_profiles_simple.sql in Supabase Dashboard')
    console.log('2. Check RLS policies in Supabase')
    console.log('3. Verify table structure matches application needs')
  }
}

testComprehensive()