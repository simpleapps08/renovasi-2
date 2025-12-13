# Reset Password Email Expiry Configuration Guide

## 📋 Overview

This guide explains how to configure Supabase to use **1-hour (3600 seconds)** token expiry for password reset emails instead of the default shorter duration.

**Current Status:**
- ✅ Frontend error handling: Implemented
- ✅ Admin API methods: Created (`extendedPasswordRecovery.ts`)
- ✅ Recovery email functions: Available in code
- 🔄 **Backend configuration: Requires Supabase Dashboard**

---

## 🎯 The Problem

Password reset email links are expiring too quickly (before 1 hour). This is because:

1. Supabase has a default token expiry time (varies by plan)
2. This needs to be configured in the Supabase Dashboard
3. Configuration requires **SERVICE_ROLE_KEY** credentials (which we have in `.env`)

---

## ✅ Solution Steps

### Option A: Dashboard Configuration (Recommended)

**Most reliable method - takes 2 minutes**

1. **Login to Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project: `tkqvozgorpapofejphyn`

2. **Navigate to Email Configuration**
   - Click: **Authentication** (left sidebar)
   - Click: **Providers** 
   - Click: **Email**

3. **Configure Password Reset Expiry**
   - Look for: **"Confirm email"** or **"Email change"** settings
   - Find: Token expiry time field (may be in seconds)
   - Set to: **3600** (1 hour)
   - Save changes

4. **Verify Configuration**
   - Email settings should show 3600 seconds
   - You may need to refresh the page

### Option B: SQL Configuration

**If you have database access**

1. Go to: **SQL Editor** in Supabase Dashboard
2. Run this query:

```sql
-- Insert or update password reset expiry configuration
INSERT INTO auth.config (name, value) 
VALUES ('password_recovery_token_expires_in', '3600')
ON CONFLICT (name) DO UPDATE SET value = '3600';

-- Verify the setting
SELECT name, value FROM auth.config 
WHERE name LIKE '%password%' OR name LIKE '%recovery%';
```

3. Expected output: `password_recovery_token_expires_in | 3600`

### Option C: API Configuration Script

**Using our Node.js script with SERVICE_ROLE_KEY**

```bash
# From project root
npm run ts-node scripts/configure-email-expiry.ts
```

This script:
- ✅ Validates Supabase credentials
- ✅ Attempts REST API configuration
- ✅ Provides verification steps
- 📝 Gives you the Supabase Dashboard link to complete setup

---

## 🔐 How It Works (Technical Details)

### Current Implementation

1. **Extended Password Recovery Library** (`src/lib/extendedPasswordRecovery.ts`)
   - `sendRecoveryEmailAdmin()`: Uses Supabase Admin API with SERVICE_ROLE_KEY
   - `sendRecoveryEmailWithLogging()`: Standard method with better logging
   - `configureEmailExpiry()`: Attempts to configure token expiry

2. **Updated Auth Page** (`src/pages/Auth.tsx`)
   - Checks if `VITE_SUPABASE_SERVICE_ROLE_KEY` is available
   - Uses Admin API if available, standard method as fallback
   - Sends recovery email with proper logging

3. **Error Handling** (`src/pages/ResetPassword.tsx`)
   - Detects `otp_expired` errors in URL hash
   - Shows "Link Tidak Valid" message with "Minta Link Reset Baru" button
   - Provides clear guidance to users

### Token Lifecycle

```
User clicks "Lupa Password"
    ↓
Email sent with token (valid for 1 hour)
    ↓
User clicks link in email within 1 hour
    ↓
Reset password form loads
    ↓
User sets new password
    ↓
Redirect to login
```

If user clicks link after 1 hour:
```
User clicks expired link
    ↓
Supabase returns otp_expired error
    ↓
Frontend detects error in URL hash
    ↓
Shows "Link Tidak Valid" page with "Minta Link Reset Baru" button
    ↓
User can request new reset email
```

---

## 🧪 Testing

### Test 1: Immediate Reset (Should Work)

1. Go to login page: http://localhost:8081/auth
2. Click "Lupa Password"
3. Enter your email
4. Click reset password link immediately
5. **Expected:** Reset password form loads successfully

### Test 2: Expired Link (Should Show Error)

1. Send password reset email
2. Wait 1 hour
3. Click the email link
4. **Expected:** "Link Tidak Valid" message appears
5. Click "Minta Link Reset Baru" to request new link

### Test 3: Already Reset Password

1. Send password reset email
2. Click link and reset password successfully
3. Try to use the same link again
4. **Expected:** "Link Tidak Valid" message (token already used)

---

## 📊 Configuration Verification

After configuring in Supabase Dashboard:

### Check via Dashboard
1. Go to **Authentication > Providers > Email**
2. Look for token expiry settings
3. Should show **3600** or **1 hour**

### Check via SQL
```sql
SELECT name, value FROM auth.config 
WHERE name LIKE '%password%' OR name LIKE '%recovery%';
```

### Check via Code
The `src/lib/extendedPasswordRecovery.ts` has logging that shows:
```
📧 Sending recovery email via Supabase Admin API...
⏱️ Token will expire in 1 hour (3600 seconds)
✅ Recovery link generated
```

---

## 🔧 Troubleshooting

### Error: "Link Tidak Valid" Too Soon

**Cause:** Supabase email expiry not configured to 1 hour

**Fix:**
1. Go to Supabase Dashboard
2. Check Authentication > Providers > Email
3. Set token expiry to 3600 seconds
4. Wait 5 minutes for changes to propagate
5. Send new test email

### Error: "SERVICE_ROLE_KEY" Missing

**Cause:** Environment variable not set

**Fix:**
1. Check `.env` file has: `VITE_SUPABASE_SERVICE_ROLE_KEY=sk_live_...`
2. If missing, get it from Supabase Dashboard:
   - Go to: Settings > API > Project API keys
   - Copy: Service role key (secret)
   - Add to `.env`

### Error: "Email not found"

**Cause:** User account doesn't exist

**Fix:**
1. Create user account first
2. Then request password reset
3. Check email for reset link

---

## 📚 Related Files

- **Frontend Logic:**
  - `src/lib/extendedPasswordRecovery.ts` - Admin API recovery methods
  - `src/pages/Auth.tsx` - Login page with forgot password
  - `src/pages/ResetPassword.tsx` - Reset password form with error handling
  - `src/lib/resetPasswordHelper.ts` - Standard helper functions

- **Scripts:**
  - `scripts/configure-email-expiry.ts` - Configuration script
  - `scripts/configure-supabase-email.ts` - Alternative configuration script

- **Documentation:**
  - `docs/RESET_PASSWORD_CONFIGURATION.md` - Full configuration guide
  - `docs/SUPABASE_RESET_PASSWORD_SETUP.md` - Supabase-specific instructions

---

## 🚀 Production Deployment

1. **Ensure .env is configured:**
   ```
   VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   VITE_SUPABASE_SERVICE_ROLE_KEY=sk_live_...
   ```

2. **Supabase Dashboard configured:**
   - Email token expiry set to 3600 seconds
   - Email provider active and tested

3. **Deploy:**
   - Push to GitHub
   - Vercel will auto-deploy
   - Test in production: https://renovasi-servisoo.vercel.app

4. **Monitor:**
   - Check browser console for configuration logs
   - Monitor for any `otp_expired` errors in production
   - User reports of expired links

---

## 💡 Advanced Configuration

### Custom Token Expiry

If you need different expiry times:

1. **For email verification:** Edit `VITE_EMAIL_VERIFICATION_EXPIRY_SECONDS`
2. **For password reset:** Configure in Supabase Dashboard (3600)
3. **For session refresh:** Configure in Authentication settings

### Environment-Specific Expiry

```typescript
// In extendedPasswordRecovery.ts
const EXPIRY_SECONDS = import.meta.env.PROD ? 3600 : 86400; // 1h prod, 24h dev
```

### Custom Recovery Email

If you need to customize the recovery email:

1. Go to Supabase Dashboard
2. Authentication > Email Templates
3. Edit the recovery email template
4. Add custom branding and instructions

---

## ✨ Summary

- ✅ **Frontend:** All code ready for 1-hour token expiry
- ✅ **Error handling:** Properly detects and displays expired tokens
- 🔄 **Configuration:** Requires Supabase Dashboard setup (1-2 minutes)
- 🚀 **Deployment:** Ready for production

**Next Step:** Configure token expiry in Supabase Dashboard (Option A above)
