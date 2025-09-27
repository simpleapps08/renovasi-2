-- Fix User Registration: Auto-create Profile Trigger
-- Script untuk memperbaiki registrasi user dengan membuat trigger otomatis
-- Jalankan di Supabase Dashboard > SQL Editor

BEGIN;

-- 1. Pastikan tabel profiles ada dan memiliki struktur yang benar
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
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin', 'admin_store', 'store_owner')),
  saldo_deposit DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Pastikan RLS aktif
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies dan buat ulang
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 4. Buat RLS policies yang benar
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- 5. Buat function untuk auto-create profile setelah user registrasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile baru untuk user yang baru registrasi
  INSERT INTO public.profiles (
    user_id,
    nama,
    email,
    lokasi,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'lokasi', 'Indonesia'),
    'user',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Drop trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 7. Buat trigger baru untuk auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Grant permissions yang diperlukan
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 9. Buat function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Buat trigger untuk auto-update timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. Sync email dari auth.users ke profiles.email
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

-- 12. Buat trigger untuk sync email
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
CREATE TRIGGER sync_user_email_trigger
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- 13. Update existing profiles dengan email dari auth.users (jika ada)
UPDATE profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE profiles.user_id = auth_users.id
AND (profiles.email IS NULL OR profiles.email = '');

-- 14. Verifikasi struktur dan trigger
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

-- 15. Tampilkan trigger yang aktif
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM 
  information_schema.triggers 
WHERE 
  event_object_table IN ('users', 'profiles')
  AND trigger_schema = 'public'
ORDER BY 
  event_object_table, trigger_name;

COMMIT;

-- Pesan sukses
SELECT 'User registration fix applied successfully! New users will automatically get profiles created.' as status;