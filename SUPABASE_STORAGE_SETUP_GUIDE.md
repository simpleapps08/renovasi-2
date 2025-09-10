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
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy untuk read public
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'room-enhancer-images');

-- Policy untuk upload authenticated
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'room-enhancer-images');

-- Policy untuk delete authenticated
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'room-enhancer-images');
```

## ✅ Verifikasi Setup

1. **Cek di Dashboard**
   - Bucket `room-enhancer-images` muncul di Storage
   - Status: Public ✅

2. **Test Upload**
   - Buka Room Enhancer
   - Coba upload gambar
   - Tidak ada error "Bucket not found"

## 🚨 Troubleshooting

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