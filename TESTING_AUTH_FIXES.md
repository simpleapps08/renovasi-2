# Quick Testing Guide - Auth System Fixes

## Prerequisites
- Dev server running: `npm run dev`
- Browser DevTools open (F12)
- Test user credentials ready

## Test Case 1: Normal Login/Logout Cycle ✅ CRITICAL

### Steps:
1. Navigate to `http://localhost:8081/auth`
2. Enter test credentials:
   - Email: `user@example.com`
   - Password: `password123`
3. Click "Masuk" button
4. Wait for redirect (should see loading spinner briefly)
5. Verify in Console tab: Look for logs:
   ```
   🔐 Attempting login for: user@example.com
   📥 signInWithPassword completed
   ✅ Login successful
   🔍 Fetching profile for user_id: [uuid]
   ✅ Profile found
   ```
6. Check Network tab: Verify `signInWithPassword` and profiles query completed
7. Once redirected, click Logout button
8. In Console: Verify:
   ```
   ✅ Supabase session cleared from localStorage
   ✅ Auth state reset: user logged out completely
   ```
9. Check Application > Local Storage: **All `supabase*` and `sb-*` keys should be gone**
10. Try to login again - **should NOT hang or show infinite loading**

**Expected Result:** ✅ Login/logout works smoothly, no hanging

---

## Test Case 2: Profile Loading ✅ CRITICAL

### Steps:
1. Clear localStorage: DevTools > Application > Local Storage > Clear All
2. Login again with same credentials
3. Monitor Network tab specifically for:
   - Request: `POST /auth/v1/token` → Status 200
   - Request: `GET /profiles?...` → Status 200
4. Check Response for profiles query:
   ```json
   [
     {
       "id": "uuid",
       "user_id": "uuid",
       "nama": "User Name",
       "role": "user",
       "lokasi": "Location",
       ...
     }
   ]
   ```
5. Verify profile data in useAuth() context:
   ```javascript
   // In browser console:
   localStorage.getItem('sb-tkqvozgorpapofejphyn-auth-token')
   // Should show valid JWT token
   ```

**Expected Result:** ✅ Profile loads within 3 seconds

---

## Test Case 3: Timeout Handling ✅ IMPORTANT

### Steps:
1. Open DevTools > Network tab
2. Set throttling to "GPRS" (very slow)
3. Attempt to login
4. **Do NOT close throttling** - let request take its time
5. After ~30 seconds, should see:
   - Loading spinner disappears
   - Toast message appears: "Koneksi timeout. Periksa jaringan Anda dan coba lagi dalam beberapa saat."
6. Remove throttling
7. Try login again normally

**Expected Result:** ✅ 30-second timeout shows error message instead of hanging forever

---

## Test Case 4: Different User Roles

### Test User 1: Regular User
- Email: `user@example.com`
- Expected redirect: `/dashboard`
- Expected profile.role: `user`

### Test User 2: Admin
- Email: `admin@example.com`
- Expected redirect: `/admin`
- Expected profile.role: `admin`

### Test User 3: Super Admin
- Email: `superadmin@example.com`
- Expected redirect: `/super-admin/dashboard`
- Expected profile.role: `super_admin`

### Test User 4: Admin Store
- Email: `adminstore@example.com`
- Expected redirect: `/admin/toko`
- Expected profile.role: `admin_store`

**Expected Result:** ✅ Correct role-based redirects

---

## Test Case 5: SessionStorage & IndexedDB Cleanup

### Steps:
1. Open DevTools > Application tab
2. Before logout:
   - Check Local Storage: See auth-related keys
   - Check Session Storage: May have temporary data
   - Check IndexedDB: May have `supabase` database
3. Logout
4. Check all three again:
   - Local Storage: **No `supabase*` or `sb-*` keys**
   - Session Storage: **Should be empty**
   - IndexedDB: **`supabase` database should be gone**

**Expected Result:** ✅ All storage cleaned completely

---

## Test Case 6: Invalid Login Attempt

### Steps:
1. Go to `/auth`
2. Enter wrong password
3. Click "Masuk"
4. Should see error toast:
   ```
   Title: "Login Gagal"
   Message: "Invalid login credentials" or similar
   ```
5. Console should show:
   ```
   📥 signInWithPassword completed, hasError: true
   ❌ Login error: [error message]
   ```

**Expected Result:** ✅ Clear error message, no infinite loading

---

## Test Case 7: Private Browsing Mode (Edge Case)

### Steps:
1. Open app in Private/Incognito window
2. Try login
3. Should work normally despite localStorage limitations
4. Check console for warnings but **not errors**

**Expected Result:** ✅ Works with warnings about localStorage

---

## Console Debugging Commands

Run these in browser console while testing:

```javascript
// Check current session
const { data } = await supabase.auth.getSession()
console.log('Current session:', data.session?.user?.email)

// Check all auth keys in localStorage
const authKeys = Object.keys(localStorage)
  .filter(k => /supabase|sb-/i.test(k))
console.log('Auth keys in storage:', authKeys)

// Monitor auth events in real-time
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`🔄 Auth event: ${event}`)
  if (session) console.log('✅ User:', session.user.email)
  else console.log('❌ No session')
})

// Check Supabase config
console.log('Supabase URL:', SUPABASE_URL)
console.log('PKCE enabled:', true)
```

---

## Common Issues & Solutions

### Issue: "Infinite loading spinner"
**Solution:**
1. Check Network tab - is request still pending?
2. If request shows 408 timeout, timeout is working ✅
3. If request hangs forever, there's a network issue
4. Try clearing localStorage and try again

### Issue: "Login works, but logout doesn't clear localStorage"
**Solution:**
1. Check browser console for errors
2. Verify `clearAllAuthStorage()` is being called
3. Try manual clear: `localStorage.clear()`
4. Check if localStorage is disabled

### Issue: "Profile fails to load"
**Solution:**
1. Check Network tab - `/profiles` request status
2. Verify user exists in database
3. Check Supabase RLS policies allow read
4. Check user_id matches between auth.users and profiles

### Issue: "Error in private browsing mode"
**Solution:**
1. Expected - localStorage limited in private mode
2. Warnings in console are OK
3. Actual functionality should work
4. App should degrade gracefully

---

## Success Criteria ✅

All tests should pass:
- [ ] Test 1: Login/logout cycle (no hanging)
- [ ] Test 2: Profile loads within 3 seconds
- [ ] Test 3: Timeout error after 10 seconds
- [ ] Test 4: Correct role-based redirects
- [ ] Test 5: Complete storage cleanup
- [ ] Test 6: Clear error messages
- [ ] Test 7: Works in private browsing

## Sign-Off

Once all tests pass, auth system is fixed and ready for deployment.

**Tested by:** [Your name]  
**Date:** [Date]  
**Build version:** [Version]  
**Status:** ✅ APPROVED / ❌ NEEDS WORK

---

For detailed information, see [AUTH_FIX_SUMMARY.md](AUTH_FIX_SUMMARY.md)
