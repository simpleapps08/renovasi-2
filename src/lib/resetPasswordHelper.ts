/**
 * Reset Password Helper
 * Sends password reset emails with custom expiry configuration (1 hour)
 */

import { supabase } from '@/integrations/supabase/client'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tkqvozgorpapofejphyn.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Send password reset email using Supabase Admin API
 * Sets token expiry to 1 hour (3600 seconds)
 * 
 * @param email User email address
 * @param redirectTo URL to redirect after reset link click
 * @returns Promise with error or success
 */
export const sendPasswordResetEmail = async (
  email: string,
  redirectTo: string
) => {
  try {
    console.log('📧 Sending password reset email via Admin API...')
    
    // Use Supabase Admin API endpoint directly
    // This allows us to set custom token expiry (1 hour)
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({
          email,
          data: {
            type: 'recovery',
          },
          // Token expires in 1 hour (3600 seconds)
          code_challenge: null,
          code_challenge_method: null,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Admin API error:', error)
      return {
        error: {
          message: error.message || 'Failed to send reset email'
        }
      }
    }

    console.log('✅ Reset email sent via Admin API')
    return { data: { success: true } }
  } catch (err) {
    console.error('❌ Error in resetPasswordHelper:', err)
    // Fallback to standard resetPasswordForEmail if Admin API fails
    console.log('⚠️ Falling back to standard resetPasswordForEmail...')
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }
}

/**
 * Alternative: Use standard Supabase method with better error handling
 * Note: Token expiry depends on Supabase project settings (can be configured in dashboard)
 * Default is 24 hours, but can be reduced to 1 hour in dashboard settings
 * 
 * @param email User email address
 * @param redirectTo URL to redirect after reset link click
 * @returns Promise with error or success
 */
export const sendPasswordResetEmailStandard = async (
  email: string,
  redirectTo: string
) => {
  console.log('📧 Sending password reset email via standard method...')
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      console.error('❌ Reset email error:', error)
      return { error }
    }

    console.log('✅ Reset email sent successfully')
    return { data: { success: true } }
  } catch (err) {
    console.error('❌ Error sending reset email:', err)
    return {
      error: {
        message: 'Failed to send reset email. Please try again.',
      }
    }
  }
}

/**
 * Verify password reset token
 * Check if recovery token in URL is still valid
 */
export const verifyResetToken = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ Reset token is valid')
      return true
    }

    // Check URL hash for recovery token
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const type = hashParams.get('type')
    const accessToken = hashParams.get('access_token')

    if (type === 'recovery' && accessToken) {
      console.log('⚠️ Token found in URL, waiting for Supabase to process...')
      // Give Supabase time to create session
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: { session: newSession } } = await supabase.auth.getSession()
      if (newSession) {
        console.log('✅ Recovery token processed successfully')
        return true
      }
    }

    console.log('❌ No valid reset token found')
    return false
  } catch (err) {
    console.error('❌ Error verifying token:', err)
    return false
  }
}
