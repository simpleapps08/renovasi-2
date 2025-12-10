require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function checkUserProfilesStructure() {
  console.log('🔍 Checking user_profiles table structure...')
  console.log('==================================================')
  
  try {
    // Check if user_profiles table exists and get its structure
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error accessing user_profiles:', error.message)
      return
    }
    
    console.log('✅ user_profiles table exists')
    
    // Try to get column information by attempting to insert with all expected fields
    console.log('\n📋 Testing expected columns...')
    
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      nama: 'Test Name',
      email: 'test@example.com',
      lokasi: 'Test Location',
      role: 'user',
      saldo_deposit: 0
    }
    
    // This will fail but show us which columns exist
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert(testData)
    
    if (insertError) {
      console.log('📝 Insert test result:', insertError.message)
      
      // Check for specific column issues
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        const missingColumn = insertError.message.match(/column "([^"]+)" of relation/)?.[1]
        console.log(`❌ Missing column: ${missingColumn}`)
      }
    }
    
    // Check current data
    const { data: existingData, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (!selectError) {
      console.log(`\n📊 Current data: ${existingData?.length || 0} rows`)
      if (existingData && existingData.length > 0) {
        console.log('Sample row columns:', Object.keys(existingData[0]))
      }
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

checkUserProfilesStructure()