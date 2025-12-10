require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function checkDatabaseTables() {
  console.log('🔍 Checking database tables structure...')
  console.log('==================================================')
  console.log(`📊 Project: ${process.env.VITE_SUPABASE_PROJECT_ID}`)
  console.log('')
  
  // Check for profiles table
  console.log('1️⃣ Checking profiles table:')
  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ profiles table:', profilesError.message)
    } else {
      console.log('✅ profiles table: exists')
      if (profilesData && profilesData.length > 0) {
        console.log('   Columns:', Object.keys(profilesData[0]))
      }
      
      // Get count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      console.log(`   Rows: ${count || 0}`)
    }
  } catch (err) {
    console.log('❌ profiles table: error -', err.message)
  }
  
  console.log('')
  
  // Check for user_profiles table
  console.log('2️⃣ Checking user_profiles table:')
  try {
    const { data: userProfilesData, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (userProfilesError) {
      console.log('❌ user_profiles table:', userProfilesError.message)
    } else {
      console.log('✅ user_profiles table: exists')
      if (userProfilesData && userProfilesData.length > 0) {
        console.log('   Columns:', Object.keys(userProfilesData[0]))
      }
      
      // Get count
      const { count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
      console.log(`   Rows: ${count || 0}`)
    }
  } catch (err) {
    console.log('❌ user_profiles table: error -', err.message)
  }
  
  console.log('')
  
  // Check auth.users to see existing users
  console.log('3️⃣ Checking auth.users:')
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.log('❌ Cannot access auth.users (admin required):', error.message)
    } else {
      console.log(`✅ auth.users: ${users?.length || 0} users found`)
      if (users && users.length > 0) {
        console.log('   Sample user metadata keys:', Object.keys(users[0].user_metadata || {}))
      }
    }
  } catch (err) {
    console.log('❌ auth.users: error -', err.message)
  }
  
  console.log('')
  console.log('🎯 Recommendation:')
  console.log('==================================================')
  
  // Try to determine which table structure to use
  const profilesExists = await checkTableExists('profiles')
  const userProfilesExists = await checkTableExists('user_profiles')
  
  if (profilesExists && !userProfilesExists) {
    console.log('✅ Use PROFILES table - it exists and user_profiles does not')
    console.log('   Action: Update code to use "profiles" table')
  } else if (!profilesExists && userProfilesExists) {
    console.log('✅ Use USER_PROFILES table - it exists and profiles does not')
    console.log('   Action: Code is already updated to use "user_profiles"')
  } else if (profilesExists && userProfilesExists) {
    console.log('⚠️  Both tables exist - need to choose one and migrate data')
    console.log('   Action: Decide which table to keep and migrate data')
  } else {
    console.log('❌ Neither table exists - need to create one')
    console.log('   Action: Create user_profiles table (code is ready for this)')
  }
}

async function checkTableExists(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    return !error
  } catch {
    return false
  }
}

checkDatabaseTables()