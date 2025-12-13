/**
 * Admin Password Reset Library
 * Handles password reset operations using Supabase Admin Auth API
 * Requires service role credentials from environment
 */

import { supabase } from "@/integrations/supabase/client"

interface PasswordResetResult {
  success: boolean
  message: string
  email?: string
  resetLink?: string
}

interface PasswordResetError {
  error: true
  message: string
  code?: string
}

/**
 * Send password reset email to user using Supabase Admin API
 * This uses the client-side API which forwards to service role backend
 */
export async function sendAdminPasswordResetEmail(
  email: string,
  userName?: string
): Promise<PasswordResetResult | PasswordResetError> {
  try {
    if (!email) {
      return {
        error: true,
        message: 'Email address is required',
        code: 'INVALID_EMAIL',
      }
    }

    // Use Supabase auth API to send password reset email
    // This will trigger password reset email with reset link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return {
        error: true,
        message: error.message || 'Failed to send password reset email',
        code: 'RESET_EMAIL_ERROR',
      }
    }

    return {
      success: true,
      message: `Password reset email sent to ${email}`,
      email,
    }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'SEND_EMAIL_ERROR',
    }
  }
}

/**
 * Generate admin recovery link for manual distribution
 * Useful when email delivery cannot be used or for manual messaging
 */
export async function generateAdminRecoveryLink(
  email: string
): Promise<{ resetLink: string } | PasswordResetError> {
  try {
    if (!email) {
      return {
        error: true,
        message: 'Email address is required',
        code: 'INVALID_EMAIL',
      }
    }

    // Get the service role key from environment
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return {
        error: true,
        message: 'Service role credentials not configured',
        code: 'CONFIG_ERROR',
      }
    }

    // Call Supabase admin API to generate recovery link
    // This requires service role key - ideally done via backend
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        type: 'recovery',
        email,
        options: {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: true,
        message: data.message || 'Failed to generate recovery link',
        code: 'GENERATE_LINK_ERROR',
      }
    }

    return {
      resetLink: data.properties?.action_link || '',
    }
  } catch (error) {
    console.error('Error generating recovery link:', error)
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'GENERATE_LINK_ERROR',
    }
  }
}

/**
 * Verify password reset token
 * Checks if a reset token is still valid
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<{ valid: boolean } | PasswordResetError> {
  try {
    const response = await fetch('/api/admin/verify-reset-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: true,
        message: data.message || 'Token verification failed',
        code: data.code,
      }
    }

    return {
      valid: data.valid,
    }
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'VERIFY_TOKEN_ERROR',
    }
  }
}

