// Test user registration after database fix
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRegistration() {
  try {
    console.log('🧪 Testing user registration after database fix...')
    console.log(`📊 Project: ${supabaseUrl.split('//')[1].split('.')[0]}`)
    
    // First, check current table structure
    console.log('\n1️⃣ Checking current table structure:')
    console.log('='.repeat(50))
    
    const tablesToCheck = ['profiles', 'user_profiles']
    
    for (const table of tablesToCheck) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: exists (${count || 0} rows)`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }
    
    // Generate test user data
    const testEmail = `test_${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const testName = 'Test User'
    const testLocation = 'Jakarta'
    
    console.log('\n2️⃣ Testing user registration:')
    console.log('='.repeat(50))
    console.log(`📧 Email: ${testEmail}`)
    console.log(`👤 Name: ${testName}`)
    console.log(`📍 Location: ${testLocation}`)
    
    // Attempt to register new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          full_name: testName,
          lokasi: testLocation
        }
      }
    })
    
    if (authError) {
      console.log('❌ Registration failed:', authError.message)
      return
    }
    
    console.log('✅ User registration successful!')
    console.log(`🆔 User ID: ${authData.user?.id}`)
    console.log(`📧 Email: ${authData.user?.email}`)
    console.log(`✉️  Email confirmed: ${authData.user?.email_confirmed_at ? 'Yes' : 'No'}`)
    
    // Wait a moment for trigger to execute
    console.log('\n⏳ Waiting for profile creation trigger...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if profile was created automatically
    console.log('\n3️⃣ Checking if profile was created:')
    console.log('='.repeat(50))
    
    // Try profiles table first
    let profileData = null
    let profileError = null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single()
      
      profileData = data
      profileError = error
      
      if (data) {
        console.log('✅ Profile found in profiles table:')
        console.log(`   - ID: ${data.id}`)
        console.log(`   - User ID: ${data.user_id}`)
        console.log(`   - Name: ${data.full_name || data.nama || 'N/A'}`)
        console.log(`   - Email: ${data.email || 'N/A'}`)
        console.log(`   - Role: ${data.role || 'N/A'}`)
        console.log(`   - Location: ${data.location || data.lokasi || 'N/A'}`)
      } else {
        console.log('❌ No profile found in profiles table:', error?.message)
      }
    } catch (err) {
      console.log('❌ Error checking profiles table:', err.message)
    }
    
    // If not found in profiles, try user_profiles
    if (!profileData) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single()
        
        if (data) {
          console.log('✅ Profile found in user_profiles table:')
          console.log(`   - ID: ${data.id}`)
          console.log(`   - User ID: ${data.user_id}`)
          console.log(`   - Name: ${data.full_name || data.nama || 'N/A'}`)
          console.log(`   - Email: ${data.email || 'N/A'}`)
          console.log(`   - Role: ${data.role || 'N/A'}`)
        } else {
          console.log('❌ No profile found in user_profiles table:', error?.message)
        }
      } catch (err) {
        console.log('❌ Error checking user_profiles table:', err.message)
      }
    }
    
    console.log('\n📊 REGISTRATION TEST SUMMARY:')
    console.log('='.repeat(50))
    
    if (authData.user && profileData) {
      console.log('🎉 SUCCESS: User registration and profile creation working!')
      console.log('✅ Auth user created')
      console.log('✅ Profile automatically created')
      console.log('✅ Database trigger functioning')
    } else if (authData.user && !profileData) {
      console.log('⚠️  PARTIAL SUCCESS: User created but profile missing')
      console.log('✅ Auth user created')
      console.log('❌ Profile NOT created automatically')
      console.log('❌ Database trigger NOT working')
    } else {
      console.log('❌ FAILED: User registration failed')
    }
    
    // Clean up test user (optional)
    console.log('\n🧹 Cleaning up test user...')
    try {
      if (profileData) {
        await supabase.from('profiles').delete().eq('user_id', authData.user.id)
        console.log('✅ Test profile deleted')
      }
    } catch (err) {
      console.log('⚠️  Could not clean up test profile:', err.message)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testRegistration()