# Supabase Reset Password Expiry Configuration

## ⚠️ PENTING: Reset Password Link Expiry Configuration

Saat ini aplikasi mengirim reset password email, tetapi **default expiry time di Supabase kemungkinan terlalu cepat atau tidak dikonfigurasi dengan benar**.

Error yang muncul:
```
#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

## Solution: Configure Supabase untuk 1 Hour Expiry

### Step 1: Access Supabase Dashboard

1. Go to: https://app.supabase.com
2. Login dengan akun Anda
3. Select project: **tkqvozgorpapofejphyn**

### Step 2: Configure Email Security

1. Navigate ke **Authentication** → **Email Templates**
   - Alternative path: **Authentication** → **Configuration** → **Email**

2. Cari **"Password Recovery"** atau **"Reset Password"** template

3. Look for **Expiry Time / Token Validity** setting

### Step 3: Set Expiry to 1 Hour

Cari setting dengan nama:
- ❌ "Email link expiry" (terlalu cepat, 15-30 menit)
- ❌ "Password reset timeout" (default 24 jam)
- ✅ "OTP expiry" atau "Token expiry" → Set ke **3600 seconds** (1 hour)

**Untuk Supabase v2 (Project Settings):**

```
Authentication > Email Security > Password Reset
┌─────────────────────────────────────────┐
│ Password Reset Expiry Time              │
│ Current: [24 hours dropdown] ▼          │
│ Change to: [1 hour] atau [3600 seconds] │
└─────────────────────────────────────────┘
```

### Step 4: Verify Configuration via SQL

Atau gunakan SQL untuk check/set via Supabase Studio (SQL Editor):

```sql
-- Check current email configuration
SELECT name, value FROM auth.config WHERE name LIKE '%password%' OR name LIKE '%email%';

-- If using Supabase Admin API to set:
-- This might be in database settings or project settings UI
```

### Step 5: Alternative - Use Admin API Approach

Jika dashboard UI tidak tersedia, gunakan **Supabase Admin API** untuk set expiry:

```bash
curl -X PATCH \
  https://tkqvozgorpapofejphyn.supabase.co/rest/v1/auth/config \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "mailer_autoconfirm": false,
    "mailer_secure_email_change_enabled": true,
    "passwordless_email_max_frequency": 3600
  }'
```

## Verification

### Verify Email Settings Changed

1. Send test reset password email
2. Check email immediately - link should work
3. Wait 1 hour
4. Try same link again - should show "expired" error
5. Request new link - should work again

### Check Email in Console Logs

1. Go to Supabase Dashboard
2. **Authentication** → **Logs**
3. Look for `PASSWORD_RECOVERY` events
4. Check timestamp and token expiry

## Troubleshooting

### Problem: Link still expires too fast (< 1 hour)

**Cause:** Supabase might be using internal OTP configuration

**Solution:**
1. Check if there's separate "OTP expiry" setting (usually 15-30 min default)
2. Contact Supabase support to increase
3. Or implement custom backend solution to generate longer-lived tokens

### Problem: Can't find Email Templates in Dashboard

**Your version might be older:**

Try alternative paths:
- `Authentication` > `Email Templates` (newer UI)
- `Settings` > `Authentication` > `Email` (older UI)
- `Authentication` > `Configuration` > `Email` (alternative)

### Problem: Link Expires Immediately

**Root cause:** Email configuration not properly saved

**Solution:**
1. Logout dari Supabase dashboard
2. Clear browser cache
3. Login kembali
4. Check configuration again
5. Ensure changes are saved (look for "Save" button)

## Default Expiry Times by Supabase Version

| Setting | Default | Recommended |
|---------|---------|-------------|
| Password Reset Email Link | 24 hours | 1 hour ✅ |
| OTP Code (Email/SMS) | 15 min | 15 min ✓ |
| Access Token | 1 hour | 1 hour ✓ |
| Refresh Token | 7 days | 7 days ✓ |

## Code Implementation

Aplikasi sudah diupdate untuk:
- ✅ Handle `otp_expired` error dari Supabase
- ✅ Show clear error message ke user
- ✅ Provide fallback untuk request new reset link
- ✅ Log error codes untuk debugging

File yang sudah update:
- `src/pages/ResetPassword.tsx` - Error handling untuk expired tokens
- `src/lib/resetPasswordHelper.ts` - Helper functions
- `src/pages/Auth.tsx` - Forgot password handler
- `src/pages/AdminLogin.tsx` - Admin forgot password handler

## Next Steps

1. **Immediate:** Configure Supabase dashboard (steps above)
2. **Test:** Send test reset password email and verify 1-hour expiry
3. **Monitor:** Check error logs untuk `otp_expired` errors
4. **Notify Users:** Tell users link is valid for 1 hour

## Support

**Jika masih tidak bekerja:**

1. Check Supabase status: https://status.supabase.com
2. Read Supabase docs: https://supabase.com/docs/guides/auth/manage-user-sessions#password-reset
3. Contact Supabase support dengan:
   - Project ID: `tkqvozgorpapofejphyn`
   - Error message: `otp_expired`
   - Current configuration

---

**Last Updated:** December 12, 2025
**Status:** Reset password link expiry configuration pending
