# Debug Google OAuth 404 Error - Langkah Sistematis

## Error yang Terjadi
```
404: NOT_FOUND 
Code: NOT_FOUND 
ID: sin1::c7hjg-1758356854143-62e91cea8dc6
```

## Langkah Debug Sistematis

### 1. Buka Browser Developer Tools
1. Buka http://localhost:8080/auth
2. Tekan F12 untuk membuka Developer Tools
3. Pergi ke tab **Console**
4. Pergi ke tab **Network**

### 2. Test Google OAuth
1. Klik tombol "Masuk dengan Google" atau "Daftar dengan Google"
2. Perhatikan di Console tab:
   - Apakah ada log "Starting Google OAuth..."?
   - Apakah ada error message?
   - Screenshot error jika ada

3. Perhatikan di Network tab:
   - Cari request ke `/auth/v1/authorize`
   - Lihat status code (404, 500, dll)
   - Lihat response body
   - Screenshot network request

### 3. Periksa Konfigurasi Supabase

**Buka Supabase Dashboard:**
1. Login ke https://supabase.com/dashboard
2. Pilih project: `tkqvozgorpapofejphyn`
3. Pergi ke **Authentication** > **Providers**
4. Pastikan Google provider:
   - ✅ **Enabled** (toggle hijau)
   - ✅ **Client ID** terisi
   - ✅ **Client Secret** terisi
   - ✅ **Redirect URL** = `https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback`

### 4. Periksa Google Cloud Console

**Buka Google Cloud Console:**
1. Login ke https://console.cloud.google.com/
2. Pilih project yang sesuai
3. Pergi ke **APIs & Services** > **Credentials**
4. Cari OAuth 2.0 Client ID
5. Pastikan **Authorized redirect URIs** berisi:
   ```
   https://tkqvozgorpapofejphyn.supabase.co/auth/v1/callback
   ```

### 5. Test dengan cURL (Optional)

Test endpoint Supabase secara langsung:
```bash
curl -X GET "https://tkqvozgorpapofejphyn.supabase.co/auth/v1/authorize?provider=google" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8"
```

### 6. Kemungkinan Penyebab Error 404

1. **Google Provider Tidak Aktif**
   - Provider belum diaktifkan di Supabase Dashboard
   - Client ID/Secret belum diset

2. **Redirect URI Salah**
   - URI di Google Cloud Console tidak match dengan Supabase
   - Typo dalam URL

3. **API Tidak Aktif**
   - Google+ API belum diaktifkan
   - Google Identity API belum diaktifkan

4. **Project ID Salah**
   - Menggunakan project Google Cloud yang salah
   - Client ID dari project yang berbeda

### 7. Solusi Berdasarkan Temuan

**Jika Console menunjukkan error:**
- Copy exact error message
- Periksa network request yang gagal

**Jika Supabase provider tidak aktif:**
- Aktifkan Google provider
- Masukkan credentials yang benar

**Jika Google Cloud tidak dikonfigurasi:**
- Buat OAuth 2.0 Client ID baru
- Tambahkan redirect URI yang benar

### 8. Verifikasi Final

Setelah perbaikan:
1. Clear browser cache
2. Test di incognito mode
3. Test dengan akun Google yang berbeda
4. Periksa Supabase logs di Dashboard > Logs

### 9. Informasi yang Dibutuhkan untuk Debug

Jika masih error, kumpulkan:
- Screenshot browser console
- Screenshot network tab
- Screenshot Supabase provider settings
- Screenshot Google Cloud OAuth settings
- Exact error message dari browser

---

**Next Steps:** Ikuti langkah 1-2 terlebih dahulu dan laporkan hasil yang ditemukan.