-- Script untuk memperbaiki struktur database Supabase
-- Menangani inkonsistensi antara tabel 'profiles' dan 'user_profiles'

BEGIN;

-- 1. Cek apakah tabel profiles sudah ada, jika ya drop dulu untuk recreate
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Rename tabel user_profiles menjadi profiles (jika user_profiles ada)
ALTER TABLE IF EXISTS user_profiles RENAME TO profiles;

-- 3. Jika user_profiles tidak ada, buat tabel profiles baru
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  lokasi VARCHAR(255), -- Alias untuk city/address
  province VARCHAR(100),
  postal_code VARCHAR(10),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  occupation VARCHAR(200),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  saldo_deposit DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Tambahkan kolom yang mungkin hilang (jika tabel sudah ada sebelumnya)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nama VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lokasi VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS saldo_deposit DECIMAL(15,2) DEFAULT 0;

-- 5. Update constraint untuk role jika perlu
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'super_admin'));

-- 6. Create index untuk performa
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 7. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies jika ada
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 9. Create RLS policies yang benar
-- Policy untuk user melihat profile sendiri
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy untuk user insert profile sendiri
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy untuk user update profile sendiri
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy untuk admin melihat semua profile
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Policy untuk admin update semua profile
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- 10. Create atau update function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Create trigger untuk auto-update timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 12. Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- 13. Sync email dari auth.users ke profiles.email
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Update email di profiles ketika email di auth.users berubah
  UPDATE profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Create trigger untuk sync email
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
CREATE TRIGGER sync_user_email_trigger
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- 15. Update existing profiles dengan email dari auth.users
UPDATE profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE profiles.user_id = auth_users.id
AND (profiles.email IS NULL OR profiles.email = '');

-- 16. Verifikasi struktur tabel
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_name = 'profiles'
ORDER BY 
  ordinal_position;

-- 17. Tampilkan policies yang aktif
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM 
  pg_policies 
WHERE 
  tablename = 'profiles';

COMMIT;