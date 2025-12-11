# Auth System - Quick Reference Guide

## Common Tasks

### Logout User
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { signOut } = useAuth()
  
  const handleLogout = async () => {
    try {
      await signOut()
      // Context automatically:
      // 1. Calls supabase.auth.signOut()
      // 2. Clears all localStorage auth keys
      // 3. Clears sessionStorage
      // 4. Clears IndexedDB
      // 5. Resets React state
      navigate('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

### Check Current User
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, profile, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Welcome, {profile?.nama}</div>
}
```

### Handle Auth Errors
```typescript
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

async function handleLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      // Handle specific errors
      if (error.message.includes('timeout')) {
        toast.error('Connection timeout. Please check your network.')
      } else if (error.message.includes('Invalid')) {
        toast.error('Invalid email or password.')
      } else {
        toast.error(error.message)
      }
      return
    }
    
    // Login succeeded
    toast.success('Login successful')
  } catch (err) {
    toast.error('Unexpected error during login')
  }
}
```

### Monitor Auth State
```typescript
import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

function MyComponent() {
  useEffect(() => {
    // Subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`)
      
      if (event === 'SIGNED_IN') {
        console.log('User logged in:', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        console.log('User logged out')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      }
    })
    
    // Cleanup subscription
    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [])
}
```

---

## Configuration

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional (fallback)
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=tkqvozgorpapofejphyn
```

### Supabase Client Options
The client is configured with:
- ✅ PKCE flow (security)
- ✅ Auto token refresh (seamless experience)
- ✅ Session persistence (survives reload)
- ✅ 15s request timeout (prevents hanging)
- ✅ Safe localStorage (handles private browsing)

**No changes needed** - already optimized!

---

## Architecture

### Auth Flow Diagram
```
┌─────────────────────────────────────────────────┐
│            User Clicks "Masuk" (Login)           │
└─────────────────┬─────────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │ Auth.tsx handleLogin │
        │  1. Email/Password   │
        └─────────┬───────────┘
                  │
                  ▼
    ┌──────────────────────────────────────┐
    │ supabase.auth.signInWithPassword()   │
    │ (with 10s timeout wrapper)           │
    └──────────────┬───────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼ Success           ▼ Error/Timeout
    ┌─────────────┐      (show toast)
    │ Fetch Profile
    │ from DB     │
    └─────┬───────┘
          │
    ┌─────┴────────────────┐
    │                      │
    ▼ Success              ▼ Error
┌──────────────┐      (clear session)
│ Update Context       (try logout)
│ Redirect based on role
└──────────────┘
```

### Session Cleanup Flow
```
┌──────────────────────────┐
│   useAuth().signOut()    │
│   (from AuthContext)     │
└──────────┬───────────────┘
           │
    ┌──────┴──────────────────────┐
    │                             │
    ▼                             ▼
supabase.auth.signOut()    clearAllAuthStorage()
(invalidate on server)      (local cleanup)
    │                             │
    │              ┌──────────────┼──────────────┐
    │              │              │              │
    ▼              ▼              ▼              ▼
 (ignore      localStorage    sessionStorage  IndexedDB
  error)      clearance       clearance      clearance
              
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Reset React State    │
                    │ • user = null        │
                    │ • session = null     │
                    │ • profile = null     │
                    │ • loading = false    │
                    └──────────────────────┘
```

---

## Files Structure

```
src/
├── contexts/
│   └── AuthContext.tsx           ← Main auth state & logic
├── integrations/supabase/
│   ├── client.ts                 ← Supabase client (enhanced)
│   └── types.ts                  ← Database types
├── lib/
│   ├── supabaseClient.ts         ← Re-export client
│   └── sessionCleanup.ts         ← NEW: Cleanup utilities
├── pages/
│   ├── Auth.tsx                  ← Login/register (with timeout)
│   ├── AdminLogin.tsx            ← Admin login (uses context)
│   ├── ResetPassword.tsx         ← Password reset (uses context)
│   └── AdminToko.tsx             ← Store admin (uses context)
└── components/layout/
    ├── SuperAdminSidebar.tsx     ← Uses context logout
    ├── AdminSidebar.tsx          ← Uses context logout
    └── DashboardSidebar.tsx      ← Uses context logout
```

---

## Troubleshooting

### "User stuck in loading state after logout"
**Diagnosis:**
1. Open console - check for errors
2. Check Network tab - is any request pending?
3. Open Application > Local Storage - check for `sb-*` keys

**Solution:**
```javascript
// In browser console
const { sessionCleanup } = await import('./lib/sessionCleanup.js')
sessionCleanup.clearAllAuthStorage()
window.location.reload()
```

### "Login timeout still happening"
**Diagnosis:**
1. Network tab - request should show "408" status after 10s
2. Check if multiple requests are pending

**Solution:**
1. Check network throttling (DevTools > Network > Throttle)
2. Check if Supabase is down: https://status.supabase.com
3. Verify API key is correct in `.env`

### "Session persists across browser restart"
**This is intentional!** Session persistence allows:
- User stays logged in after page reload
- No need to re-enter credentials every time
- Seamless experience

To force logout on browser close, use sessionStorage instead of localStorage:
```typescript
// In supabase client config
storage: sessionStorage  // Instead of localStorage
```

### "Profile doesn't load after login"
**Diagnosis:**
```javascript
// In console after login
const session = await supabase.auth.getSession()
const profile = await supabase.from('profiles').select('*').eq('user_id', session.user.id)
console.log(profile)
```

**Common issues:**
1. User doesn't have a profile record → Create one
2. RLS policy denies access → Check policies
3. Wrong column names → Verify schema

---

## Security Notes

### Never Store Sensitive Data
❌ **DON'T:**
```typescript
localStorage.setItem('password', password)  // WRONG!
localStorage.setItem('secret_key', apiKey)  // WRONG!
```

✅ **DO:**
```typescript
// Supabase handles token storage securely
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password  // Only passed to Supabase, never stored
})
```

### PKCE Flow
- Used for OAuth and enhanced security
- Prevents token exposure in browser history
- Automatic with our client configuration ✅

### Token Refresh
- Automatic token refresh enabled ✅
- Expired tokens are refreshed before requests
- No manual refresh needed ✅

---

## Performance Tips

### 1. Cache Profile Data
```typescript
const { profile } = useAuth()
// Already cached - no need to fetch again!
```

### 2. Avoid Multiple Auth Checks
```typescript
// ❌ DON'T: Multiple calls
const s1 = await supabase.auth.getSession()
const s2 = await supabase.auth.getSession()

// ✅ DO: Use context
const { session } = useAuth()
```

### 3. Debounce Auth State Changes
```typescript
// ✅ Already done in AuthContext
// Uses mounted flag to prevent race conditions
```

---

## Testing

See [TESTING_AUTH_FIXES.md](TESTING_AUTH_FIXES.md) for complete testing guide.

Quick test:
1. Login → Check localStorage has `sb-*` keys
2. Logout → Check localStorage is empty
3. Login again → Should not hang

---

## Further Reading

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [PKCE Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce)

---

**Last Updated:** December 11, 2025  
**Version:** 2.0 (Enhanced Auth System)  
**Status:** ✅ Production Ready
