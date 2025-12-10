# Panduan Memperbaiki Error Google OAuth "NOT_FOUND"

## Masalah
Error `04: NOT_FOUND` saat login dengan Google OAuth menunjukkan konfigurasi yang tidak lengkap di Supabase atau Google Cloud Console.

## Langkah-langkah Perbaikan

### 1. Konfigurasi di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda atau buat project baru
3. Aktifkan **Google+ API** dan **Google Identity API**:
   - Pergi ke "APIs & Services" > "Library"
   - Cari dan aktifkan "Google+ API"
   - Cari dan aktifkan "Google Identity API"

4. Buat OAuth 2.0 Client ID:
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "OAuth client ID"
   - Pilih "Web application"
   - Tambahkan Authorized redirect URIs:
     ```
     https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback
     http://localhost:8080/auth/callback
     ```

### 2. Konfigurasi di Supabase Dashboard

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project: `tkqvozgorpapofejphyn`
3. Pergi ke "Authentication" > "Providers"
4. Aktifkan Google provider:
   - Toggle "Enable sign in with Google"
   - Masukkan **Client ID** dari Google Cloud Console
   - Masukkan **Client Secret** dari Google Cloud Console
   - Pastikan "Redirect URL" adalah:
     ```
     https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback
     ```

### 3. Update Kode Aplikasi

Pastikan kode Google OAuth menggunakan scope yang benar:

```javascript
const handleGoogleAuth = async () => {
  setIsGoogleLoading(true)
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth Error:', error)
      toast({
        title: "Login Google Gagal",
        description: error.message,
        variant: "destructive",
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    toast({
      title: "Login Google Gagal",
      description: "Terjadi kesalahan saat login dengan Google",
      variant: "destructive",
    })
  } finally {
    setIsGoogleLoading(false)
  }
}
```

### 4. Verifikasi Environment Variables

Pastikan file `.env` memiliki konfigurasi yang benar:

```env
VITE_SUPABASE_PROJECT_ID="tkqvozgorpapofejphyn"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8"
VITE_SUPABASE_URL="https://tkqvozgorpapofejphyn.supabase.co"
```

### 5. Testing

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Test Google OAuth di:
   - `http://localhost:8080/auth`
   - Pastikan tidak ada error di browser console
   - Periksa Network tab untuk melihat request/response

### 6. Troubleshooting Tambahan

**Jika masih error:**

1. **Periksa Domain Verification:**
   - Di Google Cloud Console, pastikan domain sudah diverifikasi
   - Tambahkan `localhost` dan domain production ke authorized domains

2. **Periksa Supabase Logs:**
   - Buka Supabase Dashboard > Logs
   - Lihat error logs saat mencoba login Google

3. **Clear Browser Cache:**
   - Hapus cookies dan cache browser
   - Coba di incognito/private mode

4. **Periksa RLS Policies:**
   - Pastikan Row Level Security policies mengizinkan insert ke table `profiles`

### 7. Kode Lengkap untuk Auth.tsx

Update fungsi `handleGoogleAuth` dengan error handling yang lebih baik:

```javascript
const handleGoogleAuth = async () => {
  setIsGoogleLoading(true)
  
  try {
    // Log untuk debugging
    console.log('Starting Google OAuth...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Supabase OAuth Error:', {
        message: error.message,
        status: error.status,
        details: error
      })
      
      toast({
        title: "Login Google Gagal",
        description: `Error: ${error.message}`,
        variant: "destructive",
      })
    } else {
      console.log('OAuth initiated successfully:', data)
    }
  } catch (error) {
    console.error('Unexpected OAuth error:', error)
    toast({
      title: "Login Google Gagal",
      description: "Terjadi kesalahan saat login dengan Google. Silakan coba lagi.",
      variant: "destructive",
    })
  } finally {
    setIsGoogleLoading(false)
  }
}
```

## Checklist Verifikasi

- [ ] Google+ API dan Google Identity API sudah diaktifkan
- [ ] OAuth Client ID sudah dibuat dengan redirect URI yang benar
- [ ] Google provider sudah diaktifkan di Supabase Dashboard
- [ ] Client ID dan Secret sudah dimasukkan di Supabase
- [ ] Redirect URL di Supabase sudah benar
- [ ] Environment variables sudah benar
- [ ] Kode menggunakan scope yang tepat
- [ ] Browser cache sudah dibersihkan
- [ ] Testing di incognito mode berhasil

## Kontak Support

Jika masalah masih berlanjut, hubungi:
- Supabase Support: https://supabase.com/support
- Google Cloud Support: https://cloud.google.com/support