// Check existing database structure
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

async function checkExistingDatabase() {
  try {
    console.log('🔍 Checking existing database structure...')
    console.log(`📊 Project: ${supabaseUrl.split('//')[1].split('.')[0]}`)
    
    // Check what tables exist by trying to query them
    const tablesToCheck = [
      'profiles',
      'user_profiles', 
      'users',
      'products',
      'deposits',
      'chat_logs'
    ]
    
    console.log('\n📋 Checking existing tables:')
    console.log('='.repeat(50))
    
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
    
    // Try to get auth user info
    console.log('\n🔐 Checking auth status:')
    console.log('='.repeat(50))
    
    const { data: session } = await supabase.auth.getSession()
    if (session.session) {
      console.log(`✅ Authenticated as: ${session.session.user.email}`)
    } else {
      console.log('❌ Not authenticated (this is normal for checking structure)')
    }
    
    // Check if we can access auth.users (usually requires service role)
    try {
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .limit(1)
      
      if (authError) {
        console.log('❌ auth.users: Cannot access (need service role key)')
      } else {
        console.log(`✅ auth.users: accessible (${authUsers?.length || 0} users found)`)
      }
    } catch (err) {
      console.log('❌ auth.users: Cannot access (need service role key)')
    }
    
    console.log('\n📊 SUMMARY:')
    console.log('='.repeat(50))
    console.log('• If no tables exist: Database needs to be set up from scratch')
    console.log('• If some tables exist: Partial setup, need to add missing tables')
    console.log('• If profiles exists: Check structure compatibility')
    console.log('• If user_profiles exists: May need to rename to profiles')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkExistingDatabase()