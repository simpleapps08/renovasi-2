# ⚡ NEXT STEP: Configure Supabase Email Expiry

## 📊 Status Update

✅ **Code Updated & Deployed**
- Created `extendedPasswordRecovery.ts` with Admin API methods
- Updated `Auth.tsx` to use admin recovery when SERVICE_ROLE_KEY available
- Added comprehensive email expiry configuration guide
- Committed and pushed to GitHub (commit: 544ccb7)

🔄 **NOW REQUIRED:** Configure Supabase Dashboard

---

## 🎯 What To Do Right Now

### Quick 2-Minute Setup

1. **Open Supabase Dashboard**
   - URL: https://app.supabase.com
   - Project: tkqvozgorpapofejphyn

2. **Navigate to Email Settings**
   - Click: **Authentication** (left sidebar)
   - Click: **Providers**
   - Click: **Email**

3. **Find Token Expiry Setting**
   - Look for: "Confirm email" or "Email token expiry" field
   - Current value: Probably lower than 3600
   - **Change to: 3600** (1 hour in seconds)

4. **Save Changes**
   - Click "Save" or "Update"
   - Wait for confirmation

---

## 📝 Why This Is Important

The frontend code is now **fully ready** to:
- ✅ Detect `otp_expired` errors
- ✅ Show proper error messages
- ✅ Suggest requesting new link
- ✅ Use Admin API for better token control

But it still needs **Supabase backend configuration** to:
- 🔄 Set tokens to expire after 1 hour instead of current default
- 🔄 Enable the 1-hour window for password reset

---

## 🔗 Configuration Methods

### A: Dashboard (Recommended - 2 minutes)
**Most user-friendly**
- Go to Supabase > Authentication > Providers > Email
- Change expiry to 3600
- Click Save

### B: SQL Query (If Dashboard doesn't work)
**For advanced users**
```sql
INSERT INTO auth.config (name, value) 
VALUES ('password_recovery_token_expires_in', '3600')
ON CONFLICT (name) DO UPDATE SET value = '3600';
```

### C: Run Script (Advanced)
```bash
npm run ts-node scripts/configure-email-expiry.ts
```

---

## ✅ Testing After Configuration

1. **Send test reset email:**
   - Go to http://localhost:8081/auth
   - Click "Lupa Password"
   - Enter your email

2. **Click link immediately:**
   - Should show reset password form

3. **Test again after 1+ hours:**
   - Should show "Link Tidak Valid" error

---

## 📁 Important Files

**Code:**
- `src/lib/extendedPasswordRecovery.ts` - Admin API integration
- `src/pages/Auth.tsx` - Updated forgot password handler
- `src/pages/ResetPassword.tsx` - Error detection (already working)

**Configuration:**
- `docs/EMAIL_EXPIRY_SETUP_GUIDE.md` - Full setup instructions
- `.env` - Has VITE_SUPABASE_SERVICE_ROLE_KEY (needed for Admin API)

---

## 🚀 Summary

**What's done:**
1. ✅ Code fully implemented
2. ✅ Error handling in place
3. ✅ Admin API integration ready
4. ✅ Comprehensive guide created
5. ✅ All pushed to GitHub

**What needs to happen:**
1. 🔄 Configure Supabase dashboard (2 minutes)
2. 🔄 Test reset password flow
3. 🔄 Verify 1-hour expiry works

---

## 💡 Quick Links

- **Supabase Dashboard:** https://app.supabase.com
- **Your Project:** https://app.supabase.com/project/tkqvozgorpapofejphyn
- **Email Configuration:** https://app.supabase.com/project/tkqvozgorpapofejphyn/auth/providers
- **Full Guide:** See `docs/EMAIL_EXPIRY_SETUP_GUIDE.md`

---

**Ready to configure? Start with Method A above!** ⚡
