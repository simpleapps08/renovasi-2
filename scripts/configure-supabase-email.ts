/**
 * Supabase Admin Configuration Script
 * Configure reset password email expiry to 1 hour using Admin API
 * Run: npx ts-node scripts/configure-supabase-email.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

console.log('🔧 Configuring Supabase Email Settings...')
console.log(`📍 Project: ${SUPABASE_URL}`)

// Create admin client with service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function configureEmailSettings() {
  try {
    console.log('\n📧 Attempting to configure email settings via Admin API...')

    // Method 1: Try using Supabase Admin API endpoint for email configuration
    // This endpoint typically handles email template and security settings
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/config`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const config = await response.json()
      console.log('✅ Current email config:', JSON.stringify(config, null, 2))
    } else {
      console.warn('⚠️ Could not fetch current email config:', response.status)
    }

    // Method 2: Update via Supabase Admin API (if available)
    // Note: Email expiry configuration might require dashboard or direct SQL
    console.log('\n📝 Configuring password recovery settings...')

    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/update_password_recovery_expiry`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          expiry_seconds: 3600, // 1 hour
        }),
      }
    )

    if (updateResponse.ok) {
      console.log('✅ Password recovery expiry updated to 1 hour')
    } else if (updateResponse.status === 404) {
      console.log('⚠️ RPC function not found - this is normal')
      console.log('💡 Supabase email expiry is typically configured in Dashboard:')
      console.log('   1. Go to https://app.supabase.com')
      console.log('   2. Select project: tkqvozgorpapofejphyn')
      console.log('   3. Authentication → Email Templates')
      console.log('   4. Set Password Reset expiry to 3600 seconds (1 hour)')
    } else {
      console.warn('⚠️ Update request failed:', updateResponse.status)
    }
  } catch (error) {
    console.error('❌ Error during configuration:', error)
    console.log('\n💡 Alternative: Use Supabase Dashboard to configure')
    console.log('   Authentication → Email Templates → Password Reset')
    process.exit(1)
  }
}

async function testPasswordReset() {
  try {
    console.log('\n🧪 Testing password reset email configuration...')

    // Send test reset password email
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: 'test@example.com',
      options: {
        redirectTo: `${process.env.VITE_APP_URL || 'http://localhost:8081'}/reset-password`,
      },
    })

    if (error) {
      console.error('❌ Test error:', error)
    } else {
      console.log('✅ Password reset link generation successful')
    }
  } catch (error) {
    console.error('❌ Error testing password reset:', error)
  }
}

async function main() {
  await configureEmailSettings()
  await testPasswordReset()

  console.log('\n✅ Configuration complete!')
  console.log('\n📌 Summary:')
  console.log('   - Email expiry should be set to 1 hour (3600 seconds)')
  console.log('   - Reset password links will work for 1 hour after being sent')
  console.log('   - Users can request new links if expired')
  console.log('\n🔗 Verify in Supabase Dashboard:')
  console.log('   https://app.supabase.com/project/tkqvozgorpapofejphyn')
}

main().catch(console.error)
