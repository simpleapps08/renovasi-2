# Supabase Auth Configuration Fix - 404 Error Solution

## Problem
Setelah user mengklik link konfirmasi email, muncul error:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: sin1::n2pxq-1758370675345-948f2415c5ef
```

## Root Cause
Error ini terjadi karena konfigurasi Site URL dan Redirect URLs di Supabase Auth Settings tidak sesuai dengan aplikasi lokal.

## Solution

### 1. Login ke Supabase Dashboard
1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Navigasi ke **Authentication** > **Settings**

### 2. Update Site URL
Di bagian **Site URL**, pastikan URL sesuai dengan environment:

**For Local Development:**
```
http://localhost:8080
```

**For Production:**
```
https://your-domain.com
```

### 3. Update Redirect URLs
Di bagian **Redirect URLs**, tambahkan URL berikut:

**For Local Development:**
```
http://localhost:8080/auth/confirm
http://localhost:8080/dashboard
http://localhost:8080/**
```

**For Production:**
```
https://your-domain.com/auth/confirm
https://your-domain.com/dashboard
https://your-domain.com/**
```

### 4. Email Templates Configuration
Pastikan email templates menggunakan URL yang benar:

1. Navigasi ke **Authentication** > **Email Templates**
2. Pilih **Confirm signup**
3. Pastikan link confirmation menggunakan:
   ```
   {{ .ConfirmationURL }}
   ```

### 5. Verify Configuration
Setelah update konfigurasi:
1. Save semua perubahan
2. Tunggu beberapa menit untuk propagasi
3. Test ulang flow registrasi dan email confirmation

## Additional Notes

### Environment Variables
Pastikan file `.env` memiliki konfigurasi yang benar:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Local Development URLs
Untuk development lokal, pastikan menggunakan:
- Site URL: `http://localhost:8080`
- Redirect URLs: `http://localhost:8080/**`

### Production URLs
Untuk production, ganti dengan domain sebenarnya:
- Site URL: `https://your-actual-domain.com`
- Redirect URLs: `https://your-actual-domain.com/**`

## Testing
1. Restart development server jika perlu
2. Buat akun baru dengan email yang valid
3. Cek email dan klik link konfirmasi
4. Pastikan redirect ke `/auth/confirm` berhasil
5. Verify user dapat login setelah konfirmasi

## Common Issues

### Issue 1: Still getting 404
- Double check Site URL dan Redirect URLs
- Pastikan tidak ada trailing slash yang tidak perlu
- Clear browser cache

### Issue 2: Email tidak terkirim
- Periksa SMTP configuration di Supabase
- Pastikan email template aktif
- Check spam folder

### Issue 3: Infinite redirect loop
- Pastikan emailRedirectTo di code sesuai dengan Redirect URLs
- Verify route `/auth/confirm` exists dan accessible

Setelah mengikuti langkah-langkah di atas, email confirmation flow seharusnya berfungsi dengan baik.