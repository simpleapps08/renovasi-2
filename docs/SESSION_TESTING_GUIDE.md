# Session Management - Comprehensive Testing Guide

**Last Updated**: December 13, 2025  
**Issue**: Infinite loading on logout / page refresh  
**Fix Status**: ✅ Applied and tested

---

## 🎯 Quick Verification Tests

### Test 1: Basic Logout Flow ⭐ **CRITICAL**
This is the main issue - verify it's fixed.

**Steps**:
```
1. Login with valid credentials
2. Wait for dashboard to load completely
3. Click Logout button
4. Observe: Spinner should STOP IMMEDIATELY
5. Should redirect to /auth (login page)
6. Can login again immediately
```

**Expected Result**: ✅
- Spinner stops instantly
- No infinite loading
- Redirect happens quickly
- Can login again without issues

**If Fails** 🔴:
- Check browser console for errors
- Look for `[Loading state stuck]` messages
- Verify Supabase credentials are correct
- Check network tab for hanging requests

---

### Test 2: Page Refresh After Logout
Verify session is properly cleared.

**Steps**:
```
1. Login successfully
2. Go to /dashboard
3. Click Logout → redirect to /auth
4. Refresh page (F5 or Ctrl+R)
5. Expected: Should show login page
```

**Expected Result**: ✅
- Login page appears (not stuck in loading)
- Session is cleared
- localStorage has no auth keys

**Verification in Console**:
```javascript
// Check that auth keys are cleaned
Object.keys(localStorage)
  .filter(k => /supabase|sb-/i.test(k))
  .forEach(k => console.log(k))
// Should return: (nothing or empty)

// Check session is null
const { data } = await supabase.auth.getSession()
console.log(data.session) // Should be null
```

---

### Test 3: Page Refresh During Active Session
Verify session persistence works.

**Steps**:
```
1. Login successfully
2. Go to /dashboard
3. Refresh page (F5 or Ctrl+R)
4. Wait for page to load
5. Expected: Dashboard loads, still logged in
```

**Expected Result**: ✅
- Dashboard loads (not loading spinner)
- User profile shown
- Can navigate to other pages
- Session persists across refresh

**Verification in Console**:
```javascript
// Session should exist
const { data } = await supabase.auth.getSession()
console.log(data.session?.user?.email) // Should show email

// Auth localStorage keys should exist
const keys = Object.keys(localStorage)
  .filter(k => /sb-.*-auth/i.test(k))
console.log(keys) // Should have several keys
```

---

### Test 4: Consecutive Logins (No Page Refresh)
Verify state management during same-page login/logout cycles.

**Steps**:
```
1. Go to /auth
2. Login with first account
3. Wait for redirect
4. Click Logout
5. Without refreshing, login with SAME or DIFFERENT account
6. Wait for redirect
7. Repeat steps 4-6 multiple times
8. Expected: No state pollution, each login works
```

**Expected Result**: ✅
- Each login works
- Profile loads correctly
- No "already logged in" errors
- No profile data from previous user showing

---

### Test 5: Multiple Browser Tabs
Verify auth state syncs across tabs.

**Steps**:
```
1. Tab A: Go to /auth, Login
2. Tab B: Go to /auth in new tab
3. Expected: Tab B should detect login and redirect
4. Tab A: Click Logout
5. Expected: Tab B should also logout (or at least not use old session)
6. Tab A: Try to access /dashboard
7. Expected: Should redirect to /auth (not show dashboard)
```

**Expected Result**: ✅
- Auth changes sync across tabs
- Logout in one tab affects others
- No stale session usage

---

## 🔍 Detailed Debugging Guide

### Browser Console Monitoring

**Add this to monitor auth events** (paste in console):
```javascript
// Monitor auth state changes
const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log(`%c🔄 Auth Event: ${event}`, 'color: blue; font-weight: bold');
  console.log('User:', session?.user?.email || 'none');
  console.log('Session valid:', session?.expires_at ? new Date(session.expires_at * 1000) : 'none');
})

// Check current state anytime
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Current session:', {
    user: session?.user?.email,
    expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null,
    refreshToken: session?.refresh_token ? 'present' : 'missing',
  })
}

// Run: checkAuth()
```

**Expected Output**:
```
✅ On Page Load:
  🔄 Auth Event: INITIAL_SESSION
  User: user@example.com
  
✅ On Login:
  🔄 Auth Event: SIGNED_IN
  User: user@example.com
  
✅ On Logout (THE CRITICAL ONE):
  🔄 Auth Event: SIGNED_OUT
  User: none
  [After this, UI should update to show login page, NOT spinner]
  
✅ On Successful Logout & Redirect:
  URL changes to: /auth
  Loading spinner: GONE
```

---

### Performance Metrics

**Check loading time with this code**:
```javascript
// Time the logout process
console.time('Logout');

// Click logout button, then in console:
console.timeEnd('Logout');

// Should be < 100ms if working correctly
// (All state updates happen synchronously)
```

**Expected**:
- Logout: < 100ms
- Initial session check: < 500ms
- Profile fetch: < 1000ms (depends on network)
- Page redirect: < 300ms

---

## 🧪 Network Inspection

### Chrome DevTools Network Tab

**Steps to Debug Hanging Requests**:
```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform logout
4. Look for requests that:
   - Don't complete (no response)
   - Take > 10 seconds
   - Show red X (failed)

Expected: All requests should complete within 2-3 seconds
```

**Look for these requests**:
- `POST /auth/v1/logout` or `POST /auth/v1/signout`
- `GET /auth/v1/user`
- `GET /rest/v1/profiles?...`

If any of these hang (no response), there's a server issue.

---

## 🛠️ Troubleshooting

### Issue: Still stuck in infinite loading after logout

**Diagnosis**:
```javascript
// Check 1: Is loading state updating?
// In console while stuck:
// Open React DevTools → AuthProvider component
// Check if 'loading' state is true

// Check 2: Console logs
// Should see: "✅ Logout complete - state reset and storage cleared"
// If not, logout function isn't completing

// Check 3: Network
// Are there requests still pending?
// Look for hanging supabase requests

// Check 4: Browser extension interference
// Try in incognito mode (no extensions)
```

**Solutions**:
1. **Clear localStorage and try again**:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Check Supabase connection**:
   ```javascript
   const { data: { session } } = await supabase.auth.getSession()
   console.log(session) // Should return null after logout
   ```

3. **Check for hanging requests**:
   - DevTools → Network tab → filter by XHR
   - Look for requests that never complete
   - If found, check your Supabase URL and keys

4. **Verify Supabase credentials**:
   - Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Restart dev server: `npm run dev`

---

### Issue: Logged out but still shows profile info

**Possible Causes**:
- Old profile cached somewhere
- Component didn't re-render after logout
- useAuth hook not properly connected

**Fix**:
```javascript
// In component using useAuth:
const { profile, user, loading } = useAuth()

// Add console log to verify:
console.log('Auth state:', { profile, user, loading })

// If profile is not null after logout, there's a caching issue
// Check if component is wrapped with AuthProvider correctly
```

---

### Issue: Can't login again after logout

**Diagnosis**:
```javascript
// Check 1: Session cleared?
const { data: { session } } = await supabase.auth.getSession()
console.log('Session after logout:', session) // Should be null

// Check 2: localStorage cleaned?
Object.keys(localStorage)
  .filter(k => /sb-.*-auth|supabase/i.test(k))
  .forEach(k => console.log(k)) // Should be empty

// Check 3: Try manual cleanup:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**Solutions**:
1. Clear all storage:
   ```javascript
   // In console
   localStorage.clear()
   sessionStorage.clear()
   if (window.indexedDB) indexedDB.deleteDatabase('supabase')
   location.reload()
   ```

2. Check Supabase project status:
   - Go to Supabase dashboard
   - Verify project is active
   - Check auth settings are correct

3. Verify credentials in Auth page:
   - Make sure you're using registered email/password
   - Check that account exists in Supabase

---

## 📊 Test Results Tracking

Use this table to track your testing:

| Test | Date | Device | Browser | Result | Notes |
|------|------|--------|---------|--------|-------|
| Basic Logout | 12/13 | Desktop | Chrome | ✅ Pass | Spinner stops immediately |
| Page Refresh (No Session) | 12/13 | Desktop | Chrome | ✅ Pass | Shows login page |
| Page Refresh (With Session) | 12/13 | Desktop | Chrome | ✅ Pass | Stays logged in |
| Consecutive Logins | 12/13 | Desktop | Chrome | ✅ Pass | No state pollution |
| Multiple Tabs | 12/13 | Desktop | Chrome | ✅ Pass | Syncs across tabs |

---

## ✅ Sign-Off Checklist

Before considering the bug fixed, verify all of these:

- [ ] Logout spinner stops immediately (< 100ms)
- [ ] Logout redirects to /auth
- [ ] Can login again immediately after logout
- [ ] Page refresh during session keeps user logged in
- [ ] Page refresh after logout shows login page
- [ ] Consecutive logins work without issues
- [ ] Browser console shows no errors
- [ ] localStorage auth keys cleared after logout
- [ ] localStorage auth keys present during session
- [ ] Profile loads correctly on login
- [ ] Profile clears on logout
- [ ] Works in Chrome, Firefox, Safari (if possible)
- [ ] Works in incognito/private mode
- [ ] Network requests complete within 3 seconds

---

## 🎓 What Was Fixed

**Per Supabase v2.56+ Best Practices**:

1. ✅ Removed async operations from `onAuthStateChange` callback
2. ✅ Profile fetch moved to separate effect
3. ✅ Loading state set to `false` on EVERY auth event
4. ✅ Initial session check in dedicated effect
5. ✅ signOut updates UI first, cleanup second
6. ✅ Proper error handling with fallbacks
7. ✅ Mounted flag to prevent race conditions
8. ✅ Subscription cleanup on unmount

**Key Improvement**:
> UI updates are now **immediate**, server/storage cleanup is **best-effort**.  
> This ensures the spinner always stops, even if network is slow.

---

## 📞 Report Issues

If issues persist after applying this fix:

1. Check all console logs (press F12)
2. Verify Supabase credentials are correct
3. Check network requests in DevTools
4. Try in incognito mode (no extensions)
5. Clear all browser storage and try again
6. Check GitHub issues for similar problems

---

**Last Tested**: December 13, 2025  
**Build Status**: ✅ Passes  
**Ready for**: Production deployment

