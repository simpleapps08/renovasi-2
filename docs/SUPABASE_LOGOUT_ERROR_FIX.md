# Supabase Logout Error Fix Guide

## Problem
Error yang muncul saat logout:
```
net::ERR_ABORTED https://tkqvozgorpapofejphyn.supabase.co/auth/v1/logout?scope=global
```

## Root Cause Analysis
Error `net::ERR_ABORTED` pada endpoint logout Supabase dapat disebabkan oleh:
1. **Network connectivity issues** - Koneksi internet tidak stabil
2. **CORS configuration** - Konfigurasi CORS di Supabase tidak tepat
3. **Supabase project settings** - Pengaturan project yang salah
4. **Browser cache/cookies** - Cache browser yang corrupt
5. **Supabase service outage** - Gangguan layanan Supabase

## Solutions

### 1. Check Network Connectivity
```bash
# Test koneksi ke Supabase
ping tkqvozgorpapofejphyn.supabase.co

# Test endpoint langsung
curl -I https://tkqvozgorpapofejphyn.supabase.co/auth/v1/logout
```

### 2. Update Supabase Auth Configuration

#### A. Login ke Supabase Dashboard
1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project `tkqvozgorpapofejphyn`
3. Navigasi ke **Authentication** > **Settings**

#### B. Update CORS Settings
Di bagian **CORS Settings**, pastikan domain berikut ditambahkan:
```
http://localhost:8080
http://localhost:3000
http://localhost:5173
http://127.0.0.1:8080
```

#### C. Update Site URL
```
Site URL: http://localhost:8080
```

#### D. Update Redirect URLs
```
http://localhost:8080/**
http://localhost:8080/dashboard
http://localhost:8080/auth/confirm
```

### 3. Browser Troubleshooting

#### A. Clear Browser Cache
1. Buka Developer Tools (F12)
2. Klik kanan pada refresh button
3. Pilih "Empty Cache and Hard Reload"

#### B. Clear Supabase Storage
```javascript
// Jalankan di browser console
localStorage.removeItem('supabase.auth.token')
sessionStorage.clear()
location.reload()
```

### 4. Code-Level Fixes

#### A. Update Logout Implementation
Edit file `src/contexts/AuthContext.tsx`:

```typescript
const signOut = async () => {
  try {
    // Clear local storage first
    localStorage.removeItem('supabase.auth.token')
    sessionStorage.clear()
    
    // Then attempt Supabase logout
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Use local scope instead of global
    })
    
    if (error) {
      console.warn('Supabase logout error:', error)
      // Continue with local cleanup even if remote logout fails
    }
    
    // Always clear local state
    setUser(null)
    setSession(null)
    setProfile(null)
    
    // Redirect to home
    window.location.href = '/'
  } catch (error) {
    console.error('Logout error:', error)
    // Force local cleanup and redirect
    setUser(null)
    setSession(null)
    setProfile(null)
    window.location.href = '/'
  }
}
```

#### B. Add Retry Logic
```typescript
const signOutWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setSession(null)
        setProfile(null)
        return
      }
    } catch (error) {
      console.warn(`Logout attempt ${i + 1} failed:`, error)
      if (i === retries - 1) {
        // Force local logout on final failure
        localStorage.clear()
        sessionStorage.clear()
        setUser(null)
        setSession(null)
        setProfile(null)
        window.location.href = '/'
      }
    }
  }
}
```

### 5. Alternative Logout Method

Jika masalah persisten, gunakan local logout:

```typescript
const forceLocalLogout = () => {
  // Clear all auth data
  localStorage.removeItem('supabase.auth.token')
  sessionStorage.clear()
  
  // Clear React state
  setUser(null)
  setSession(null)
  setProfile(null)
  
  // Redirect
  window.location.href = '/'
}
```

## Testing Steps

1. **Test Network Connection**
   ```bash
   curl -v https://tkqvozgorpapofejphyn.supabase.co/auth/v1/logout
   ```

2. **Test in Incognito Mode**
   - Buka aplikasi di incognito/private browsing
   - Login dan coba logout

3. **Test Different Browsers**
   - Chrome
   - Firefox
   - Edge

4. **Check Browser Console**
   - Buka Developer Tools
   - Monitor Network tab saat logout
   - Check untuk error CORS atau network

## Prevention

1. **Regular Health Checks**
   ```javascript
   // Add to app startup
   const checkSupabaseHealth = async () => {
     try {
       const response = await fetch('https://tkqvozgorpapofejphyn.supabase.co/rest/v1/')
       console.log('Supabase health:', response.status)
     } catch (error) {
       console.error('Supabase connectivity issue:', error)
     }
   }
   ```

2. **Graceful Error Handling**
   - Always provide fallback logout
   - Clear local storage on any auth error
   - Show user-friendly error messages

## Next Steps

1. Implement the improved logout function
2. Test in different browsers and network conditions
3. Monitor Supabase dashboard for any service issues
4. Consider implementing offline-first logout strategy

## Support

Jika masalah masih berlanjut:
1. Check [Supabase Status Page](https://status.supabase.com/)
2. Review [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
3. Contact Supabase support dengan project ID: `tkqvozgorpapofejphyn`