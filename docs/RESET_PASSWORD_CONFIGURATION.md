# Reset Password Configuration Guide

## Overview
Reset password links are now configured to expire after **1 hour (3600 seconds)** instead of immediately. This allows users sufficient time to reset their password via the email link.

## How It Works

### 1. Reset Password Flow
1. User clicks "Lupa Password" on login page
2. System sends recovery email using `sendPasswordResetEmailStandard()`
3. Email contains reset link with recovery token
4. Link is valid for **1 hour** after generation
5. User clicks link and is redirected to `/reset-password` page
6. System verifies token validity
7. If valid, user can set new password
8. After password update, user must login again with new password

### 2. Configuration Details

**Token Expiry: 1 Hour (3600 seconds)**
- Set in Supabase project settings
- Reset password links sent via email are valid for exactly 1 hour
- After 1 hour, the recovery link becomes invalid
- User must request a new reset password email

**Email Configuration:**
- SMTP configured through Supabase
- Recovery emails sent automatically
- Includes recovery link with secure token
- Link format: `https://yourdomain.com/reset-password#access_token=...&type=recovery`

### 3. File Locations

**Key Files:**
- `src/lib/resetPasswordHelper.ts` - Helper functions for password reset
- `src/pages/Auth.tsx` - Main login page with forgot password
- `src/pages/AdminLogin.tsx` - Admin login page with forgot password
- `src/pages/ResetPassword.tsx` - Reset password form page
- `.env` - Supabase credentials (VITE_SUPABASE_SERVICE_ROLE_KEY required)

### 4. Helper Functions

#### `sendPasswordResetEmailStandard(email, redirectTo)`
Sends password reset email using standard Supabase method.
- Returns success or error
- Expiry time controlled by Supabase project settings (1 hour)
- Better error handling and user feedback

#### `verifyResetToken()`
Verifies if recovery token in URL is still valid.
- Checks for active session
- Parses URL hash for recovery token
- Returns boolean validity status

### 5. Supabase Project Settings

**To verify/modify reset password expiry time in Supabase Dashboard:**

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project (tkqvozgorpapofejphyn)
3. Go to **Authentication** → **Policies**
4. Look for "Email Templates" or "Password Reset"
5. Default expiry is 24 hours, can be customized
6. For 1 hour: Set to 3600 seconds in Email Settings

**Credentials Required:**
```env
VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. User Experience

**Happy Path:**
1. User receives email with reset link
2. Clicks link (valid for 1 hour)
3. Redirected to reset password page
4. System verifies token
5. User enters new password
6. Password updated successfully
7. User logged out and redirected to login
8. User logs in with new password

**Error Cases:**
1. **Link Expired** - Link clicked after 1 hour
   - Message: "Link reset password tidak valid atau sudah kadaluarsa"
   - Solution: Request new reset password email

2. **Invalid Token** - Link tampered with or invalid
   - Message: "Link reset password tidak valid atau sudah kadaluarsa"
   - Solution: Request new reset password email

3. **Network Error** - Connection issue during reset
   - Message: "Terjadi kesalahan. Silakan coba lagi."
   - Solution: Retry or request new reset password email

### 7. Testing

**Test Reset Password Flow:**

```bash
# 1. Start dev server
npm run dev

# 2. Go to login page
# http://localhost:8081

# 3. Click "Lupa Password"
# Enter test email

# 4. Check email (look in Supabase console logs if using test account)

# 5. Click recovery link in email

# 6. Verify link is valid (within 1 hour)

# 7. Enter new password and confirm

# 8. Login with new password
```

### 8. Troubleshooting

**Problem:** "Link reset password langsung expired"
**Solution:** 
- Verify Supabase project settings (expiry should be 3600 seconds = 1 hour)
- Check that SERVICE_ROLE_KEY is correct in .env
- Ensure email token includes proper recovery claim
- Check server logs for token generation issues

**Problem:** "Email tidak diterima"
**Solution:**
- Verify SMTP configuration in Supabase dashboard
- Check spam/junk email folders
- Ensure email address exists in database
- Check Supabase project email logs

**Problem:** "Token verification fails on reset page"
**Solution:**
- Clear browser cache and try again
- Check that URL hash is preserved (don't modify link)
- Verify Supabase session management in AuthContext
- Check browser console for error details

### 9. Security Best Practices

1. **Token Expiry** - 1 hour is reasonable balance between security and UX
2. **One-Time Use** - Token becomes invalid after password update
3. **HTTPS Only** - Links should only work over HTTPS
4. **Email Verification** - Ensure legitimate user owns email
5. **Rate Limiting** - Consider limiting reset requests per email/IP

### 10. Future Improvements

Potential enhancements:
- [ ] Send confirmation email after password change
- [ ] Add option to invalidate all active sessions on password change
- [ ] Implement custom email templates with branding
- [ ] Add SMS as backup recovery method
- [ ] Implement password reset confirmation (2FA)
- [ ] Add reset password attempt logging
