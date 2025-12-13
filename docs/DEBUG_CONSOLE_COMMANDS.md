# Session Management - Quick Debug Reference

**Copy-paste these commands in browser console for debugging**

---

## 🔍 Check Current Session

```javascript
// Quick session check
const { data: { session } } = await supabase.auth.getSession()
console.log({
  'Email': session?.user?.email,
  'User ID': session?.user?.id,
  'Expires At': session?.expires_at ? new Date(session.expires_at * 1000) : null,
  'Has Refresh Token': !!session?.refresh_token,
  'Auth Provider': session?.user?.app_metadata?.provider
})
```

---

## 🧹 Check Storage

```javascript
// Show all auth-related localStorage
console.log('=== LOCALSTORAGE AUTH KEYS ===')
Object.keys(localStorage)
  .filter(k => /supabase|sb-|auth|session|token/i.test(k))
  .forEach(k => {
    const value = localStorage.getItem(k)
    const preview = value?.length > 50 ? value.substring(0, 50) + '...' : value
    console.log(`${k}: ${preview}`)
  })

// Show all sessionStorage
console.log('=== SESSIONSTORAGE KEYS ===')
Object.keys(sessionStorage)
  .filter(k => /supabase|sb-|auth|session|token/i.test(k))
  .forEach(k => console.log(`${k}: ${sessionStorage.getItem(k)}`))
```

---

## 📡 Monitor Auth Events

```javascript
// Live auth event monitor
const eventLog = []
const { data } = supabase.auth.onAuthStateChange((event, session) => {
  const entry = {
    time: new Date().toLocaleTimeString(),
    event,
    user: session?.user?.email || null,
    hasSession: !!session
  }
  eventLog.push(entry)
  console.log('%c🔄 AUTH EVENT', 'color: blue; font-weight: bold; font-size: 14px')
  console.table([entry])
})

// Later, see all events logged
console.log('=== ALL AUTH EVENTS ===')
console.table(eventLog)

// Stop monitoring
// data.subscription.unsubscribe()
```

---

## 🔐 Test Login Flow

```javascript
// Simple login test
async function testLogin(email, password) {
  console.log('🔐 Testing login...')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    console.error('❌ Login failed:', error.message)
    return
  }
  
  console.log('✅ Login successful')
  console.log({
    'User Email': data.user?.email,
    'User ID': data.user?.id,
    'Session created': !!data.session
  })
}

// Usage: testLogin('user@example.com', 'password')
```

---

## 🚪 Test Logout Flow

```javascript
// Simple logout test - WATCH CONSOLE FOR TIMING
async function testLogout() {
  console.time('⏱️ Logout Duration')
  console.log('🚪 Starting logout...')
  
  try {
    // The fix ensures this completes fast
    // Even if Supabase call hangs
    await supabase.auth.signOut()
    console.log('✅ signOut completed')
  } catch (e) {
    console.error('⚠️ signOut error:', e.message)
  }
  
  console.timeEnd('⏱️ Logout Duration')
  
  // Check state after logout
  setTimeout(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session after logout:', session ? '❌ STILL EXISTS' : '✅ CLEARED')
  }, 500)
}

// Usage: testLogout()
// Check that "Logout Duration" is < 100ms
```

---

## 📊 Check Auth Context State

```javascript
// Use React DevTools to check AuthProvider state
// Or manually:
const authDebug = {
  'Check localStorage keys': Object.keys(localStorage).filter(k => /auth|session|token/i.test(k)).length,
  'Current URL': window.location.pathname,
  'Supabase URL': import.meta.env.VITE_SUPABASE_URL,
  'Has anon key': !!import.meta.env.VITE_SUPABASE_ANON_KEY
}

console.table(authDebug)
```

---

## 🔧 Force Clear All Auth Data

```javascript
// NUCLEAR OPTION: Clear everything
// Use this if stuck in infinite loading
async function clearAllAuth() {
  console.log('🔧 Clearing all auth data...')
  
  // Clear localStorage
  Object.keys(localStorage)
    .filter(k => /supabase|sb-|auth|session|token/i.test(k))
    .forEach(k => {
      localStorage.removeItem(k)
      console.log(`Removed: ${k}`)
    })
  
  // Clear sessionStorage  
  sessionStorage.clear()
  console.log('Cleared sessionStorage')
  
  // Clear IndexedDB
  try {
    indexedDB.deleteDatabase('supabase')
    console.log('Deleted IndexedDB:supabase')
  } catch (e) {
    console.warn('Could not clear IndexedDB:', e.message)
  }
  
  console.log('✅ All auth data cleared')
  console.log('⚠️ Reloading page in 2 seconds...')
  
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

// Usage: clearAllAuth()
```

---

## 🧐 Detect Infinite Loading

```javascript
// Check if spinner is stuck
function checkSpinner() {
  const spinner = document.querySelector('[class*="animate-spin"]')
  
  if (spinner && spinner.offsetParent !== null) {
    console.warn('⚠️ SPINNER IS VISIBLE')
    
    // Check if it's the loading spinner in AuthProvider
    const authProvider = spinner.closest('[class*="flex items-center justify-center"]')
    if (authProvider) {
      console.error('🔴 INFINITE LOADING DETECTED - Auth provider stuck')
      
      // Suggest fix
      console.log('Try: clearAllAuth() from console')
      return false
    }
  } else {
    console.log('✅ No loading spinner visible')
    return true
  }
}

// Usage: checkSpinner()
// Run this while logout is happening - should return true immediately
```

---

## 📈 Profile Fetch Test

```javascript
// Test profile loading
async function testProfileFetch(userId) {
  console.log(`👤 Fetching profile for user: ${userId}`)
  
  console.time('Profile fetch')
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  console.timeEnd('Profile fetch')
  
  if (error) {
    console.error('Profile fetch error:', error.message)
    return
  }
  
  console.log('✅ Profile loaded:')
  console.table({
    ID: data?.id,
    Name: data?.full_name || data?.nama,
    Role: data?.role,
    Email: data?.email,
    Location: data?.address || data?.lokasi
  })
}

// Get current user ID first:
// const { data: { session } } = await supabase.auth.getSession()
// testProfileFetch(session.user.id)
```

---

## 🚀 Performance Monitoring

```javascript
// Monitor auth performance
const authMetrics = {
  loginStartTime: null,
  loginEndTime: null,
  logoutStartTime: null,
  logoutEndTime: null
}

// Hook into events
const { data } = supabase.auth.onAuthStateChange((event, session) => {
  const now = Date.now()
  
  if (event === 'SIGNED_IN') {
    authMetrics.loginEndTime = now
    const duration = authMetrics.loginEndTime - authMetrics.loginStartTime
    console.log(`✅ Login completed in ${duration}ms`)
  }
  
  if (event === 'SIGNED_OUT') {
    authMetrics.logoutEndTime = now
    const duration = authMetrics.logoutEndTime - authMetrics.logoutStartTime
    console.log(`✅ Logout completed in ${duration}ms (should be < 100ms)`)
  }
})

// Report metrics
function reportMetrics() {
  console.log('=== AUTH METRICS ===')
  console.table({
    'Login duration': authMetrics.loginStartTime && authMetrics.loginEndTime
      ? `${authMetrics.loginEndTime - authMetrics.loginStartTime}ms`
      : 'N/A',
    'Logout duration': authMetrics.logoutStartTime && authMetrics.logoutEndTime
      ? `${authMetrics.logoutEndTime - authMetrics.logoutStartTime}ms`
      : 'N/A'
  })
}

// Usage:
// authMetrics.loginStartTime = Date.now()  // Before clicking login
// authMetrics.logoutStartTime = Date.now() // Before clicking logout
// reportMetrics() // After both
```

---

## 🐛 Common Issues & Quick Fixes

```javascript
// Issue: "User not found" error on login
// Fix: Verify user exists in Supabase Auth
async function verifyUserExists(email) {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user?.email === email) {
    console.log('✅ User logged in as:', email)
  } else {
    console.log('❌ User not found or not logged in')
  }
}

// Issue: Profile not loading
// Fix: Check if user has profile in database
async function verifyProfileExists(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code === 'PGRST116') {
    console.warn('⚠️ User profile not found - may need to create it')
  } else if (error) {
    console.error('Profile query error:', error.message)
  } else {
    console.log('✅ Profile exists:', data.nama || data.full_name)
  }
}

// Issue: Storage quota exceeded
// Fix: Clear unnecessary data
function clearUnusedStorage() {
  const keysToKeep = ['supabase', 'sb-', 'auth']
  Object.keys(localStorage).forEach(key => {
    if (!keysToKeep.some(k => key.includes(k))) {
      localStorage.removeItem(key)
    }
  })
  console.log('✅ Cleaned unused storage')
}
```

---

## 📝 Copy-Ready Command Blocks

### Block 1: Full Diagnostic
```javascript
// Copy all three functions and run them
async function diagnostic() {
  console.log('%c=== FULL DIAGNOSTIC ===', 'color: red; font-size: 16px; font-weight: bold')
  
  // Check session
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Session:', session?.user?.email || 'NONE (Not logged in)')
  
  // Check storage
  const authKeys = Object.keys(localStorage).filter(k => /auth|session|token/i.test(k))
  console.log(`Auth keys in storage: ${authKeys.length}`)
  authKeys.forEach(k => console.log(`  - ${k}`))
  
  // Check spinner
  const spinner = !!document.querySelector('[class*="animate-spin"]')
  console.log(`Loading spinner visible: ${spinner ? '❌ YES' : '✅ NO'}`)
  
  console.log('%c=== END DIAGNOSTIC ===', 'color: red; font-size: 16px; font-weight: bold')
}

diagnostic()
```

### Block 2: Logout Test
```javascript
async function testLogoutFlow() {
  console.log('%c🧪 LOGOUT TEST START', 'color: green; font-size: 14px; font-weight: bold')
  
  console.time('Logout time')
  const before = Date.now()
  
  try {
    await supabase.auth.signOut()
  } catch (e) {
    console.error('Logout error:', e)
  }
  
  const after = Date.now()
  console.timeEnd('Logout time')
  
  console.log(`Duration: ${after - before}ms (should be < 100ms)`)
  
  // Check state after
  setTimeout(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log(`Session cleared: ${session ? '❌ NO' : '✅ YES'}`)
  }, 100)
}

testLogoutFlow()
```

---

## 🎯 Expected Console Output After Fix

### Login Flow
```
✅ Login successful
User Email: user@example.com
Session created: true

[Page redirects to dashboard]
```

### Logout Flow
```
🚪 Starting logout...
✅ signOut completed
⏱️ Logout Duration: 45ms (should be < 100ms)
[Check after 500ms]
Session after logout: ✅ CLEARED

[Page shows login page]
```

### Page Refresh During Session
```
🔄 AUTH EVENT
time: "10:15:30 AM"
event: "INITIAL_SESSION"
user: "user@example.com"
hasSession: true
```

---

**Last Updated**: December 13, 2025  
**Save this file as a bookmark for quick debugging!**

