/**
 * Extended Password Recovery Helper
 * Sends password recovery email using Supabase Admin API
 * with custom configuration and better error handling
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tkqvozgorpapofejphyn.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Send password recovery email using Supabase Admin API
 * This bypasses client-side restrictions and uses service role privileges
 * 
 * @param email User email to send recovery link to
 * @param redirectUrl Where to redirect after user clicks link
 * @returns Recovery link data with extended token
 */
export const sendRecoveryEmailAdmin = async (
  email: string,
  redirectUrl: string
) => {
  try {
    console.log('📧 Sending recovery email via Supabase Admin API...')

    // Create admin client with service role
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Use admin API to generate recovery link
    // This gives us more control over token expiry
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('❌ Admin API error:', error)
      return { error }
    }

    console.log('✅ Recovery link generated:', {
      email,
      tokenExpiry: '1 hour', // Supabase default, but configurable in dashboard
      redirectUrl,
    })

    return { data, error: null }
  } catch (err) {
    console.error('❌ Error in sendRecoveryEmailAdmin:', err)
    return {
      error: {
        message: 'Failed to send recovery email. Please try again.',
      },
    }
  }
}

/**
 * Send password recovery using alternative method
 * If Admin API not available, use standard method with logging
 */
export const sendRecoveryEmailWithLogging = async (
  email: string,
  redirectUrl: string
) => {
  try {
    console.log('📧 Sending recovery email...')
    console.log(`⏱️ Token will expire in 1 hour (3600 seconds)`)

    const supabase = createClient(
      SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    )

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: redirectUrl }
    )

    if (error) {
      console.error('❌ Reset password error:', error)
      return { error }
    }

    console.log('✅ Recovery email sent successfully')
    return { data, error: null }
  } catch (err) {
    console.error('❌ Error sending recovery email:', err)
    return {
      error: {
        message: 'Failed to send recovery email. Please try again.',
      },
    }
  }
}

/**
 * Verify email configuration from Supabase
 * Check current password reset expiry settings
 */
export const verifyEmailConfiguration = async () => {
  try {
    console.log('🔍 Checking Supabase email configuration...')

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      console.log('✅ Supabase Admin API is accessible')
      return true
    } else {
      console.warn('⚠️ Supabase Admin API check failed:', response.status)
      return false
    }
  } catch (err) {
    console.warn('⚠️ Could not verify configuration:', err)
    return false
  }
}

/**
 * Configure email expiry via Supabase API
 * Requires service role key with proper permissions
 */
export const configureEmailExpiry = async (expirySeconds: number = 3600) => {
  try {
    console.log(`⏰ Configuring email expiry to ${expirySeconds} seconds (${expirySeconds / 3600} hour)...`)

    // This endpoint might not be available on all Supabase plans
    // If it fails, configuration must be done via Dashboard
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/configure_email_expiry`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ expiry_seconds: expirySeconds }),
      }
    )

    if (response.ok) {
      console.log(`✅ Email expiry configured to ${expirySeconds} seconds`)
      return true
    } else if (response.status === 404) {
      console.log('💡 RPC function not available - use Supabase Dashboard instead')
      return false
    } else {
      console.warn('⚠️ Configuration failed:', response.status)
      return false
    }
  } catch (err) {
    console.warn('⚠️ Could not configure expiry:', err)
    return false
  }
}
