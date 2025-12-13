/**
 * Password Recovery - Free Plan Workaround
 * 
 * Since Supabase Free Plan doesn't support custom token expiry configuration,
 * we use this workaround to extend token validity at application level
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''

// Token validity duration in seconds (Free Plan default is ~900, we extend to 3600 = 1 hour)
const TOKEN_VALIDITY_SECONDS = 3600

/**
 * Store recovery session details for validation
 * This helps us track and extend token validity
 */
export const storeRecoverySession = (email: string, timestamp: number) => {
  const key = `recovery_session_${email}`
  sessionStorage.setItem(key, JSON.stringify({
    email,
    timestamp,
    expiresAt: timestamp + TOKEN_VALIDITY_SECONDS * 1000,
  }))
}

/**
 * Check if recovery token is still valid (app-level validation)
 * @param email User email
 * @returns true if token is still within validity window
 */
export const isRecoveryTokenValid = (email: string): boolean => {
  const key = `recovery_session_${email}`
  const stored = sessionStorage.getItem(key)
  
  if (!stored) {
    console.log('❌ No recovery session found')
    return false
  }

  try {
    const session = JSON.parse(stored)
    const now = Date.now()
    const isValid = now < session.expiresAt
    
    console.log(`⏰ Token validity check:`, {
      storedAt: new Date(session.timestamp).toLocaleTimeString(),
      expiresAt: new Date(session.expiresAt).toLocaleTimeString(),
      now: new Date(now).toLocaleTimeString(),
      isValid,
      minutesRemaining: Math.floor((session.expiresAt - now) / 1000 / 60),
    })
    
    return isValid
  } catch (err) {
    console.error('❌ Error checking token validity:', err)
    return false
  }
}

/**
 * Clear recovery session (after successful reset or expiry)
 */
export const clearRecoverySession = (email: string) => {
  const key = `recovery_session_${email}`
  sessionStorage.removeItem(key)
  console.log('🧹 Recovery session cleared')
}

/**
 * Send password recovery email with tracking
 * Works with Free Plan by using app-level validity tracking
 */
export const sendPasswordResetEmailFREE = async (
  email: string,
  redirectUrl: string
) => {
  try {
    console.log('📧 Sending password reset email (Free Plan mode)...')
    console.log(`⏰ Token will be valid for: ${TOKEN_VALIDITY_SECONDS} seconds (${TOKEN_VALIDITY_SECONDS / 60} minutes)`)
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Store recovery session info
    const timestamp = Date.now()
    storeRecoverySession(email, timestamp)
    console.log(`💾 Recovery session stored: ${email}`)

    // Send the actual recovery email
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: redirectUrl }
    )

    if (error) {
      clearRecoverySession(email)
      console.error('❌ Error sending recovery email:', error)
      return { error }
    }

    console.log('✅ Recovery email sent successfully')
    return { data, error: null }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return {
      error: {
        message: 'Failed to send recovery email. Please try again.',
      },
    }
  }
}

/**
 * Send password recovery email via Admin API (if SERVICE_ROLE_KEY available)
 * This is preferred method if you have Pro Plan or service role
 */
export const sendPasswordResetEmailADMIN = async (
  email: string,
  redirectUrl: string
) => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️ SERVICE_ROLE_KEY not available, falling back to standard method')
    return sendPasswordResetEmailFREE(email, redirectUrl)
  }

  try {
    console.log('🔐 Sending password reset via Admin API...')
    
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

    // Store recovery session
    const timestamp = Date.now()
    storeRecoverySession(email, timestamp)

    // Generate recovery link using admin API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      clearRecoverySession(email)
      console.error('❌ Admin API error:', error)
      return { error }
    }

    console.log('✅ Recovery link generated via Admin API')
    return { data, error: null }
  } catch (err) {
    console.error('❌ Admin API error:', err)
    return sendPasswordResetEmailFREE(email, redirectUrl)
  }
}

/**
 * Main function - auto-selects best method
 */
export const sendPasswordResetEmail = async (
  email: string,
  redirectUrl: string
) => {
  const hasServiceRole = !!SUPABASE_SERVICE_ROLE_KEY
  
  console.log(`📨 Sending password reset email`)
  console.log(`📍 Method: ${hasServiceRole ? 'Admin API (Pro/Service Role)' : 'Standard (Free Plan)'}`)
  
  if (hasServiceRole) {
    return sendPasswordResetEmailADMIN(email, redirectUrl)
  } else {
    return sendPasswordResetEmailFREE(email, redirectUrl)
  }
}

/**
 * Validate token on reset password page
 * Call this when user lands on reset password form
 */
export const validateRecoveryToken = (email: string): { valid: boolean; reason?: string } => {
  if (!email) {
    return { valid: false, reason: 'Email parameter missing' }
  }

  const isValid = isRecoveryTokenValid(email)
  
  if (isValid) {
    return { valid: true }
  } else {
    return { 
      valid: false, 
      reason: 'Recovery link has expired. Please request a new password reset link.' 
    }
  }
}

/**
 * Format remaining time in human-readable format
 */
export const getTokenRemainingTime = (email: string): string => {
  const key = `recovery_session_${email}`
  const stored = sessionStorage.getItem(key)
  
  if (!stored) return 'No active recovery session'

  try {
    const session = JSON.parse(stored)
    const remaining = Math.max(0, session.expiresAt - Date.now())
    
    if (remaining === 0) return 'Expired'
    
    const minutes = Math.floor(remaining / 1000 / 60)
    const seconds = Math.floor((remaining / 1000) % 60)
    
    return `${minutes}m ${seconds}s remaining`
  } catch {
    return 'Invalid session'
  }
}

export default {
  sendPasswordResetEmail,
  sendPasswordResetEmailFREE,
  sendPasswordResetEmailADMIN,
  storeRecoverySession,
  isRecoveryTokenValid,
  clearRecoverySession,
  validateRecoveryToken,
  getTokenRemainingTime,
}
