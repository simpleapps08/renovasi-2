/**
 * Admin Password Reset API
 * Server-side endpoint for admin-initiated password reset
 * Accessed at /api/admin/reset-password
 */

import type { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

interface ResetPasswordRequest {
  email: string
  userName?: string
  redirectTo?: string
}

interface ApiResponse {
  success?: boolean
  message: string
  email?: string
  code?: string
}

/**
 * Handle POST requests for password reset
 */
export default async function handler(
  req: IncomingMessage & { body?: ResetPasswordRequest },
  res: ServerResponse<IncomingMessage> & { json?: Function }
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    if (res.json) {
      res.json({ message: 'Method not allowed' })
    } else {
      res.end(JSON.stringify({ message: 'Method not allowed' }))
    }
    res.statusCode = 405
    return
  }

  try {
    const { email, userName, redirectTo } = req.body || {}

    // Validate email
    if (!email || !email.includes('@')) {
      res.statusCode = 400
      if (res.json) {
        res.json({
          message: 'Invalid email address',
          code: 'INVALID_EMAIL',
        } as ApiResponse)
      } else {
        res.end(JSON.stringify({
          message: 'Invalid email address',
          code: 'INVALID_EMAIL',
        }))
      }
      return
    }

    // Get user by email using admin API
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) {
      console.error('Error listing users:', getUserError)
      res.statusCode = 500
      if (res.json) {
        res.json({
          message: 'Failed to retrieve user information',
          code: 'USER_LOOKUP_ERROR',
        } as ApiResponse)
      } else {
        res.end(JSON.stringify({
          message: 'Failed to retrieve user information',
          code: 'USER_LOOKUP_ERROR',
        }))
      }
      return
    }

    // Find user by email
    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      console.error('User not found:', email)
      res.statusCode = 404
      if (res.json) {
        res.json({
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        } as ApiResponse)
      } else {
        res.end(JSON.stringify({
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        }))
      }
      return
    }

    // Send password reset email using admin API
    const { error: resetError } = await supabase.auth.admin.resetPasswordForEmail(
      email,
      {
        redirectTo: redirectTo || `${process.env.VITE_SUPABASE_URL}/auth/reset-password`,
      }
    )

    if (resetError) {
      console.error('Error sending reset email:', resetError)
      res.statusCode = 400
      if (res.json) {
        res.json({
          message: 'Failed to send reset email: ' + resetError.message,
          code: 'SEND_EMAIL_ERROR',
        } as ApiResponse)
      } else {
        res.end(JSON.stringify({
          message: 'Failed to send reset email: ' + resetError.message,
          code: 'SEND_EMAIL_ERROR',
        }))
      }
      return
    }

    // Success
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    if (res.json) {
      res.json({
        success: true,
        message: `Password reset email sent to ${email}`,
        email,
      } as ApiResponse)
    } else {
      res.end(JSON.stringify({
        success: true,
        message: `Password reset email sent to ${email}`,
        email,
      }))
    }
  } catch (error) {
    console.error('Password reset API error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    if (res.json) {
      res.json({
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      } as ApiResponse)
    } else {
      res.end(JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      }))
    }
  }
}
