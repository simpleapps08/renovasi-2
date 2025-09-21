# Fix Google OAuth NOT_FOUND Error

## 🚨 Masalah
Error `Code: NOT_FOUND` terjadi saat login dengan Google OAuth karena konfigurasi Google OAuth belum lengkap.

## 🔧 Penyebab
1. **Missing Google OAuth Credentials**: File `.env` tidak memiliki `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`
2. **Supabase OAuth Configuration**: Konfigurasi Google OAuth di Supabase belum diatur dengan benar
3. **Redirect URL Mismatch**: URL redirect tidak sesuai dengan yang dikonfigurasi di Google Console

## ✅ Solusi

### 1. Setup Google OAuth di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google+ API dan Google OAuth2 API
4. Buat OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:54328/auth/v1/callback` (untuk development)
     - `https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback` (untuk production)

### 2. Update Environment Variables
Update file `.env` dengan credentials yang benar:
```env
# Ganti dengan credentials asli dari Google Cloud Console
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

### 3. Konfigurasi Supabase Dashboard
1. Buka Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Masukkan Client ID dan Client Secret dari Google Cloud Console
4. Set redirect URL: `https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback`

### 4. Update Supabase Config (Opsional)
Jika menggunakan Supabase local development:
```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "http://localhost:54328/auth/v1/callback"
```

## 🧪 Testing
1. Restart development server: `npm run dev`
2. Coba login dengan Google di halaman `/auth`
3. Periksa console browser untuk error
4. Verifikasi redirect URL di Network tab

## 📝 Catatan Penting
- **Jangan commit credentials asli** ke repository
- Gunakan environment variables yang berbeda untuk development dan production
- Pastikan domain yang digunakan sudah terdaftar di Google Cloud Console
- Error NOT_FOUND biasanya terjadi karena Client ID tidak valid atau tidak ditemukan

## 🔍 Troubleshooting
- Periksa console browser untuk error detail
- Verifikasi Client ID di Google Cloud Console
- Pastikan redirect URL exact match
- Cek status Google OAuth API di Google Cloud Console

## 📋 Status
- ✅ Environment variables template ditambahkan
- ⏳ Perlu konfigurasi Google Cloud Console
- ⏳ Perlu update Supabase Dashboard
- ⏳ Perlu testing dengan credentials asli