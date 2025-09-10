# 🗂️ Panduan Setup Supabase Storage untuk Room Enhancer

## ❌ Masalah: "Bucket not found"

Error ini terjadi karena storage bucket `room-enhancer-images` belum dibuat di Supabase.

## 🔧 Solusi 1: Setup Manual via Dashboard

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Login ke [supabase.com](https://supabase.com)
   - Pilih project: `tkqvozgorpapofejphyn`

2. **Navigasi ke Storage**
   - Klik menu "Storage" di sidebar kiri
   - Klik tombol "Create a new bucket"

3. **Konfigurasi Bucket**
   ```
   Bucket Name: room-enhancer-images
   Public bucket: ✅ ENABLED
   File size limit: 10 MB
   Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
   ```

4. **Klik "Create bucket"**

## 🔧 Solusi 2: Setup via SQL Script

### Langkah-langkah:

1. **Buka SQL Editor**
   - Di Supabase Dashboard, klik "SQL Editor"
   - Klik "New query"

2. **Jalankan Script**
   - Copy isi file `setup_storage_bucket.sql`
   - Paste ke SQL Editor
   - Klik "Run"

## 🔧 Solusi 3: Setup RLS Policies (Jika Diperlukan)

Jika masih ada error setelah membuat bucket, jalankan SQL berikut:

```sql

## ✅ Verifikasi Setup

Setelah menjalankan script, verifikasi bahwa:

1. **Bucket tersedia**: Buka Supabase Dashboard > Storage, pastikan bucket `room-enhancer-images` terlihat
2. **Bucket bersifat Public**: Klik bucket, pastikan toggle "Public bucket" aktif
3. **RLS Policies aktif**: Di tab "Policies", pastikan 4 policy terlihat:
   - Public read access for room enhancer images
   - Public upload for room enhancer images  
   - Public delete for room enhancer images
   - Public update for room enhancer images

## 🧪 Test Upload

Untuk test apakah setup berhasil:

1. Buka aplikasi Room Enhancer
2. Upload gambar ruangan
3. Jika berhasil, gambar akan tersimpan dan bisa diproses AI
4. Periksa di Supabase Dashboard > Storage > room-enhancer-images apakah file terupload

## 🗑️ Auto-Cleanup Setup (Opsional)

Untuk mencegah storage penuh, setup auto-cleanup:

1. **Jalankan script auto-cleanup**:
   ```bash
   # Di Supabase SQL Editor
   # Jalankan file: setup_auto_cleanup.sql
   ```

2. **Fitur auto-cleanup**:
   - Gambar otomatis terhapus setelah 24 jam
   - Cleanup berjalan setiap kali ada upload baru
   - Manual cleanup tersedia via aplikasi

3. **Enable pg_cron (Opsional)**:
   - Buka Supabase Dashboard > Database > Extensions
   - Enable "pg_cron" untuk scheduled cleanup
   - Uncomment bagian cron job di `setup_auto_cleanup.sql`

## 🚨 Troubleshooting

### Error: "new row violates row-level security policy"
Jika Anda mendapat error RLS policy, jalankan script berikut untuk memperbaiki:

```sql
-- Jalankan di Supabase SQL Editor
-- Drop existing policies yang mungkin terlalu ketat
DROP POLICY IF EXISTS "Public read access for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for room enhancer images" ON storage.objects;

-- Buat policies yang mengizinkan akses publik
CREATE POLICY "Public read access for room enhancer images" ON storage.objects
FOR SELECT USING (bucket_id = 'room-enhancer-images');

CREATE POLICY "Public upload for room enhancer images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'room-enhancer-images');

CREATE POLICY "Public delete for room enhancer images" ON storage.objects
FOR DELETE USING (bucket_id = 'room-enhancer-images');

CREATE POLICY "Public update for room enhancer images" ON storage.objects
FOR UPDATE USING (bucket_id = 'room-enhancer-images');
```

### Error: "Bucket not found"
- Pastikan bucket sudah dibuat dengan nama yang benar: `room-enhancer-images`
- Periksa di Supabase Dashboard > Storage apakah bucket terlihat
- Coba refresh halaman dan cek kembali

### Error: "Insufficient permissions"
- Pastikan bucket di-set sebagai **Public**
- Cek RLS policies sudah benar

### Error: "File too large"
- Pastikan file < 10MB
- Cek file size limit di bucket settings

### Error: "Invalid file type"
- Gunakan format: JPG, JPEG, PNG, atau WebP
- Cek allowed MIME types di bucket

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Cek console browser untuk error detail
2. Pastikan koneksi internet stabil
3. Restart development server: `npm run dev`

---

**File terkait:**
- `setup_storage_bucket.sql` - Script SQL untuk setup otomatis
- `src/services/storageService.ts` - Service untuk handle storage
- `.env` - Konfigurasi Supabase credentials