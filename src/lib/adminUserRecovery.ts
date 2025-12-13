/**
 * Admin User Recovery Helper
 * Functions for super admin to generate and manage password reset links for users
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Generate recovery link for a user (Admin function)
 * @param userEmail User email to generate recovery link for
 * @param redirectUrl Where to redirect after password reset
 * @returns Recovery link and expiry info
 */
export const generateAdminRecoveryLink = async (
  userEmail: string,
  redirectUrl: string
) => {
  try {
    console.log('🔐 Admin generating recovery link for:', userEmail)

    // Check if SERVICE_ROLE_KEY available
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ SERVICE_ROLE_KEY not available, using standard method')
      return generateRecoveryLinkStandard(userEmail, redirectUrl)
    }

    // Create admin client
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

    // Generate recovery link using admin API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: userEmail,
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('❌ Admin API error:', error)
      return {
        error: {
          message: `Failed to generate recovery link: ${error.message}`,
        },
      }
    }

    console.log('✅ Recovery link generated successfully')
    return {
      data: {
        ...data,
        generatedAt: new Date().toISOString(),
        expiresIn: '1 hour',
      },
      error: null,
    }
  } catch (err) {
    console.error('❌ Error generating recovery link:', err)
    return {
      error: {
        message: 'Failed to generate recovery link. Please try again.',
      },
    }
  }
}

/**
 * Generate recovery link using standard method (if no SERVICE_ROLE_KEY)
 */
export const generateRecoveryLinkStandard = async (
  userEmail: string,
  redirectUrl: string
) => {
  try {
    console.log('📧 Generating recovery link (standard method) for:', userEmail)

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Send recovery email - this also generates the link
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      userEmail,
      { redirectTo: redirectUrl }
    )

    if (error) {
      console.error('❌ Error:', error)
      return { error }
    }

    console.log('✅ Recovery email sent (standard method)')
    return {
      data: {
        user: { email: userEmail },
        generatedAt: new Date().toISOString(),
        expiresIn: '1 hour (via email)',
      },
      error: null,
    }
  } catch (err) {
    console.error('❌ Error:', err)
    return {
      error: {
        message: 'Failed to generate recovery link.',
      },
    }
  }
}

/**
 * Send recovery email to user (admin initiated)
 * @param userEmail User email
 * @param userName User name (for personalization)
 * @param redirectUrl Reset password form URL
 * @returns Success/error result
 */
export const sendAdminInitiatedResetEmail = async (
  userEmail: string,
  userName: string,
  redirectUrl: string
) => {
  try {
    console.log('📧 Admin sending recovery email to:', userEmail)

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Send recovery email
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      userEmail,
      { redirectTo: redirectUrl }
    )

    if (error) {
      console.error('❌ Email send error:', error)
      return {
        error: {
          message: `Failed to send reset email: ${error.message}`,
        },
      }
    }

    console.log('✅ Reset email sent to:', userEmail)
    
    // Log this action (optional - for audit trail)
    await logPasswordResetRequest(userEmail, 'admin_initiated')

    return {
      data: {
        email: userEmail,
        name: userName,
        sentAt: new Date().toISOString(),
        message: 'Reset password email sent successfully',
      },
      error: null,
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return {
      error: {
        message: 'Failed to send reset email.',
      },
    }
  }
}

/**
 * Get all users (for admin to select from)
 * Requires SERVICE_ROLE_KEY
 */
export const getAllUsers = async () => {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ SERVICE_ROLE_KEY required for getAllUsers')
      return {
        error: {
          message: 'Admin credentials not available',
        },
      }
    }

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

    // Get all users from auth.users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('❌ Error fetching users:', error)
      return { error }
    }

    // Enhance with profile data
    const usersWithProfiles = await Promise.all(
      data.users.map(async (user) => {
        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, phone, address, role')
            .eq('user_id', user.id)
            .single()

          return {
            id: user.id,
            email: user.email,
            name: profile?.full_name || 'N/A',
            phone: profile?.phone || 'N/A',
            address: profile?.address || 'N/A',
            role: profile?.role || 'user',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          }
        } catch (err) {
          return {
            id: user.id,
            email: user.email,
            name: 'N/A',
            role: 'user',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          }
        }
      })
    )

    return {
      data: usersWithProfiles,
      error: null,
    }
  } catch (err) {
    console.error('❌ Error:', err)
    return {
      error: {
        message: 'Failed to fetch users.',
      },
    }
  }
}

/**
 * Get single user details
 */
export const getUserDetails = async (userId: string) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching profile:', error)
      return { error }
    }

    return {
      data: profile,
      error: null,
    }
  } catch (err) {
    console.error('❌ Error:', err)
    return {
      error: {
        message: 'Failed to fetch user details.',
      },
    }
  }
}

/**
 * Log password reset request (for audit trail)
 */
const logPasswordResetRequest = async (
  userEmail: string,
  initiatedBy: 'user' | 'admin_initiated'
) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Insert into audit log (if you have this table)
    await supabase
      .from('password_reset_logs')
      .insert({
        user_email: userEmail,
        initiated_by: initiatedBy,
        timestamp: new Date().toISOString(),
      })
      .catch(() => {
        // Table might not exist, that's ok
        console.log('💾 Audit log not available, skipping')
      })
  } catch (err) {
    console.warn('⚠️ Could not log reset request:', err)
  }
}

/**
 * Copy link to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    console.log('📋 Copied to clipboard')
    return true
  } catch (err) {
    console.error('❌ Failed to copy:', err)
    return false
  }
}

export default {
  generateAdminRecoveryLink,
  generateRecoveryLinkStandard,
  sendAdminInitiatedResetEmail,
  getAllUsers,
  getUserDetails,
  copyToClipboard,
}
