# Instruksi Menjalankan Migration untuk User Management

## Masalah
Error: `column user_profile.fullname does not exist`

## Solusi
Kolom `full_name` belum ditambahkan ke tabel `user_profiles`. Ikuti langkah berikut:

### Opsi 1: Melalui Supabase Dashboard (DIREKOMENDASIKAN)

1. **Buka Supabase Dashboard**
   - Kunjungi: https://supabase.com/dashboard
   - Login dengan akun Anda
   - Pilih project: `tkqvozgorpapofejphyn`

2. **Masuk ke SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New Query"

3. **Jalankan Migration SQL**
   Salin dan jalankan kode berikut:

```sql
-- 1. Tambahkan kolom full_name
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- 2. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON public.user_profiles(full_name);

-- 3. Tambahkan admin policies
CREATE POLICY IF NOT EXISTS "Admin can view all user profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can update all user profiles" ON public.user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can delete all user profiles" ON public.user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can insert user profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- 4. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

4. **Klik "Run" untuk menjalankan**

5. **Verifikasi Hasil**
   - Pastikan tidak ada error
   - Kolom `full_name` harus muncul dalam hasil query verifikasi

### Opsi 2: Melalui Supabase CLI (Jika sudah setup)

```bash
# Link project (jika belum)
npx supabase link --project-ref tkqvozgorpapofejphyn

# Push migrations
npx supabase db push
```

## Setelah Migration Berhasil

1. **Refresh halaman admin user management**
2. **Test fitur CRUD:**
   - Lihat daftar user
   - Tambah user baru
   - Edit user existing
   - Hapus user
   - Export data

## Troubleshooting

### Jika masih error "full_name does not exist":
1. Pastikan migration sudah dijalankan dengan benar
2. Refresh browser (Ctrl+F5)
3. Cek di Supabase Dashboard → Table Editor → user_profiles
4. Pastikan kolom `full_name` ada dalam tabel

### Jika tidak bisa akses sebagai admin:
1. Pastikan user Anda memiliki role 'admin' di tabel user_profiles
2. Logout dan login kembali
3. Cek RLS policies sudah aktif

## Status
- ❌ **BELUM SELESAI**: Migration belum dijalankan
- ⏳ **MENUNGGU**: Jalankan migration SQL di atas
- ✅ **SELESAI**: Setelah migration berhasil dan fitur berfungsi