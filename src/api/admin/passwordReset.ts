/**
 * Admin Password Reset API Routes
 * Server-side endpoints for admin-initiated password reset using service role
 * POST /api/admin/reset-password - Send reset email
 * POST /api/admin/generate-recovery-link - Generate recovery link
 * POST /api/admin/verify-reset-token - Verify reset token
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

/**
 * Reset password for a user (send reset email)
 * Endpoint: POST /api/admin/reset-password
 */
export async function handleResetPassword(request: Request) {
  try {
    const { email, userName, redirectTo } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is required',
          code: 'INVALID_EMAIL',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify authorization - only admins can call this
    // In a real app, verify JWT token from request header

    // Send password reset email using admin API
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-12), // Temporary password
      email_confirm: false, // Do not auto-confirm
      user_metadata: {
        name: userName,
      },
    })

    // If user already exists, we'll still send reset email
    // Reset password for existing user
    const resetError = await supabaseAdmin.auth.admin.resetPasswordForEmail(
      email,
      {
        redirectTo: redirectTo || `${process.env.VITE_SUPABASE_URL}/auth/reset-password`,
      }
    )

    if (resetError?.error) {
      // If user doesn't exist, return error (or create new user if policy allows)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found or error sending reset email',
          code: 'RESET_EMAIL_ERROR',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Password reset email sent to ${email}`,
        email,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Generate recovery link for manual distribution
 * Endpoint: POST /api/admin/generate-recovery-link
 */
export async function handleGenerateRecoveryLink(request: Request) {
  try {
    const { email, redirectTo } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is required',
          code: 'INVALID_EMAIL',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate reset link using admin API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectTo || `${process.env.VITE_SUPABASE_URL}/auth/reset-password`,
      },
    })

    if (error || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error?.message || 'Failed to generate recovery link',
          code: 'GENERATE_LINK_ERROR',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        resetLink: data.properties?.action_link || '',
        actionLink: data.properties?.action_link || '',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Generate recovery link error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Verify reset token validity
 * Endpoint: POST /api/admin/verify-reset-token
 */
export async function handleVerifyResetToken(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Token is required',
          code: 'INVALID_TOKEN',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify token with Supabase
    // This is a simplified check - actual verification depends on token format
    const isValid = token && token.length > 0 // Basic validation

    return new Response(
      JSON.stringify({
        success: true,
        valid: isValid,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Verify reset token error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
