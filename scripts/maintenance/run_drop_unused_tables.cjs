require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Clean environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/["']/g, '')
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY?.replace(/["']/g, '')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function dropUnusedTables() {
  console.log('🗑️  Starting cleanup of unused tables (user_profiles and user_roles)...')
  
  try {
    // 1. First, verify that profiles table exists and has data
    console.log('\n1️⃣ Verifying profiles table...')
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, role')
      .limit(5)
    
    if (profilesError) {
      console.error('❌ Error accessing profiles table:', profilesError.message)
      console.log('⚠️  Cannot proceed without confirming profiles table is working')
      return
    }
    
    console.log('✅ Profiles table is accessible')
    console.log(`📊 Sample profiles data:`, profilesData)
    
    // 2. Check if user_profiles and user_roles tables exist
    console.log('\n2️⃣ Checking if unused tables exist...')
    
    const { data: userProfilesData, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
    
    const { data: userRolesData, error: userRolesError } = await supabase
      .from('user_roles')
      .select('count', { count: 'exact', head: true })
    
    if (userProfilesError && userProfilesError.code === 'PGRST106') {
      console.log('✅ user_profiles table does not exist (already cleaned)')
    } else if (userProfilesError) {
      console.log('⚠️  user_profiles table access error:', userProfilesError.message)
    } else {
      console.log(`📊 user_profiles table exists with ${userProfilesData?.length || 0} records`)
    }
    
    if (userRolesError && userRolesError.code === 'PGRST106') {
      console.log('✅ user_roles table does not exist (already cleaned)')
    } else if (userRolesError) {
      console.log('⚠️  user_roles table access error:', userRolesError.message)
    } else {
      console.log(`📊 user_roles table exists with ${userRolesData?.length || 0} records`)
    }
    
    // 3. Read and execute the SQL script
    console.log('\n3️⃣ Reading SQL cleanup script...')
    const sqlPath = path.join(__dirname, 'drop_unused_tables.sql')
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ SQL script not found:', sqlPath)
      return
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    console.log('✅ SQL script loaded successfully')
    
    // Note: We cannot execute raw SQL through the client, so we'll provide instructions
    console.log('\n4️⃣ SQL Cleanup Instructions:')
    console.log('📋 To complete the cleanup, please:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the content from drop_unused_tables.sql')
    console.log('4. Execute the SQL script')
    console.log('')
    console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard')
    console.log('📁 SQL File: drop_unused_tables.sql')
    
    // 5. Verify current system is working
    console.log('\n5️⃣ Verifying current system functionality...')
    
    // Test auth context functionality
    const { data: testProfile, error: testError } = await supabase
      .from('profiles')
      .select('user_id, nama, role')
      .limit(1)
      .single()
    
    if (testError) {
      console.error('❌ Error testing profiles functionality:', testError.message)
    } else {
      console.log('✅ Profiles table functionality confirmed')
      console.log('📊 Test profile:', testProfile)
    }
    
    console.log('\n✅ Cleanup preparation completed!')
    console.log('🎯 Next steps:')
    console.log('   1. Execute the SQL script in Supabase Dashboard')
    console.log('   2. Verify that admin login works correctly')
    console.log('   3. Test user registration and profile creation')
    
  } catch (error) {
    console.error('❌ Error during cleanup preparation:', error.message)
  }
}

// Run the cleanup preparation
dropUnusedTables()