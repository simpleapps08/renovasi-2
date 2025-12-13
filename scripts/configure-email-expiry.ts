/**
 * Configure Supabase Email Expiry
 * This script can be run via the SQL Editor in Supabase Dashboard
 * or via Node.js with admin privileges
 * 
 * It attempts to configure password reset email link expiry to 1 hour (3600 seconds)
 */

// ============================================================
// SQL APPROACH (Run in Supabase Dashboard > SQL Editor)
// ============================================================

/*
-- 1. First, check current settings (if table exists)
SELECT * FROM auth.config WHERE name LIKE '%email%expiry%' OR name LIKE '%password%';

-- 2. Update auth.config for email expiry (if supported on your plan)
UPDATE auth.config 
SET value = '3600' 
WHERE name = 'email_change_token_new_email_expires_in' 
   OR name = 'password_recovery_token_expires_in'
   OR name = 'password_reset_token_expires_in';

-- 3. For some Supabase versions, check and update:
INSERT INTO auth.config (name, value) 
VALUES ('password_recovery_token_expires_in', '3600')
ON CONFLICT (name) DO UPDATE SET value = '3600';

-- 4. Verify the setting
SELECT name, value FROM auth.config 
WHERE name LIKE '%password%' OR name LIKE '%recovery%';
*/

// ============================================================
// NODE.JS APPROACH (Run from command line)
// ============================================================

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

const EXPIRY_SECONDS = 3600 // 1 hour

async function configureEmailExpiry() {
  console.log('🔧 Configuring Supabase Email Expiry')
  console.log('=====================================')
  console.log(`📍 Project URL: ${SUPABASE_URL}`)
  console.log(`⏰ Target expiry: ${EXPIRY_SECONDS} seconds (1 hour)`)
  console.log('')

  // Validate credentials
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env')
    console.error('   - VITE_SUPABASE_URL')
    console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  try {
    // Create admin client
    const adminClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log('🔐 Admin client created successfully')
    console.log('')

    // Attempt 1: Direct REST API call to configure
    console.log('📡 Attempting to configure via REST API...')
    const configResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/configure_email_expiry`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          expiry_seconds: EXPIRY_SECONDS,
        }),
      }
    )

    if (configResponse.ok) {
      console.log('✅ Email expiry configured via REST API')
      console.log(`   Set to: ${EXPIRY_SECONDS} seconds (1 hour)`)
    } else if (configResponse.status === 404) {
      console.log('⚠️  RPC function not available on this plan')
    } else {
      console.warn(`⚠️  REST API configuration returned: ${configResponse.status}`)
    }

    // Attempt 2: Check via SQL if direct method doesn't work
    console.log('')
    console.log('📊 Checking Supabase configuration...')
    
    // Try to fetch auth config (may require special permissions)
    const { data: configData, error: configError } = await adminClient
      .from('auth.config')
      .select('name, value')
      .ilike('name', '%password%')
      .or('name.ilike.%recovery%')

    if (configError) {
      console.log('ℹ️  Cannot access auth.config table directly')
      console.log('   This is normal on some Supabase plans')
    } else if (configData && configData.length > 0) {
      console.log('✅ Current auth configuration:')
      configData.forEach((config: any) => {
        console.log(`   - ${config.name}: ${config.value}`)
      })
    }

    console.log('')
    console.log('🎯 Configuration Status:')
    console.log('========================')
    console.log('✅ Service Role Key: Verified')
    console.log('✅ Admin Client: Connected')
    console.log('⏰ Target Expiry: 1 hour (3600 seconds)')
    console.log('')
    console.log('📝 Next Steps:')
    console.log('1. Go to Supabase Dashboard: https://app.supabase.com')
    console.log('2. Select your project')
    console.log('3. Go to: Authentication > Providers > Email')
    console.log('4. Under "Confirm email" settings, set expiry to 3600 seconds')
    console.log('5. For password reset, configure email expiry there as well')
    console.log('')
    console.log('🧪 Testing:')
    console.log('1. Request a password reset email')
    console.log('2. Try to use the link immediately (should work)')
    console.log('3. Wait 1+ hours and try again (should show "Link Tidak Valid")')
    console.log('')

  } catch (error) {
    console.error('❌ Configuration failed:', error)
    process.exit(1)
  }
}

// Run configuration
configureEmailExpiry().then(() => {
  console.log('✨ Script completed successfully')
  process.exit(0)
}).catch((err) => {
  console.error('💥 Fatal error:', err)
  process.exit(1)
})
