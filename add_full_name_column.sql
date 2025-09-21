-- Tambahkan kolom full_name ke tabel user_profiles
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Buat index untuk performa pencarian
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name 
ON public.user_profiles(full_name);

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
AND column_name = 'full_name';

-- Jika hasil query di atas menampilkan baris, berarti kolom sudah berhasil ditambahkan