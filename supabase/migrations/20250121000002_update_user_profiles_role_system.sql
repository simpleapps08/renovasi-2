-- Update user_profiles table to integrate with new role system

-- First, drop the existing role constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Update role column to reference user_roles table
ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_role 
FOREIGN KEY (role) REFERENCES user_roles(role_name) ON UPDATE CASCADE;

-- Add new columns for enhanced user management
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON user_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Update existing users to have 'user' role if they don't have one
UPDATE user_profiles SET role = 'user' WHERE role IS NULL OR role = '';

-- Create enhanced RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- New RLS policies with role-based access
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      JOIN user_roles ur ON up.role = ur.role_name 
      WHERE up.user_id = auth.uid() 
      AND ur.role_level >= 60
    )
  );

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = OLD.role); -- Prevent role self-modification

CREATE POLICY "Admins can update user profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      JOIN user_roles ur ON up.role = ur.role_name 
      WHERE up.user_id = auth.uid() 
      AND ur.role_level >= 60
    )
  );

CREATE POLICY "Super admins can delete profiles" ON user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      JOIN user_roles ur ON up.role = ur.role_name 
      WHERE up.user_id = auth.uid() 
      AND ur.role_name = 'super_admin'
    )
  );

-- Create function to automatically set full_name from auth.users
CREATE OR REPLACE FUNCTION sync_user_profile_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-populate full_name from auth metadata if not provided
  IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
    SELECT COALESCE(
      raw_user_meta_data->>'full_name',
      raw_user_meta_data->>'name',
      email
    ) INTO NEW.full_name
    FROM auth.users 
    WHERE id = NEW.user_id;
  END IF;
  
  -- Set email_verified based on auth.users
  SELECT email_confirmed_at IS NOT NULL INTO NEW.email_verified
  FROM auth.users 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for auto-sync
CREATE TRIGGER sync_user_profile_data_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_profile_data();

-- Create function to update last_login
CREATE OR REPLACE FUNCTION update_user_last_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET last_login = NOW() 
  WHERE user_id = user_uuid;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_last_login(UUID) TO authenticated;

-- Create view for user management with role information
CREATE OR REPLACE VIEW user_management_view AS
SELECT 
  up.id,
  up.user_id,
  au.email,
  up.full_name,
  up.phone,
  up.role,
  ur.role_display_name,
  ur.role_level,
  up.is_active,
  up.last_login,
  up.email_verified,
  up.phone_verified,
  up.two_factor_enabled,
  up.created_at,
  up.updated_at,
  au.created_at as account_created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
JOIN user_roles ur ON up.role = ur.role_name
WHERE ur.is_active = true;

-- Grant permissions on the view
GRANT SELECT ON user_management_view TO authenticated;

-- Create RLS policy for the view
ALTER VIEW user_management_view SET (security_invoker = true);

-- Create function to safely update user role (only by admins)
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_level INTEGER;
  target_role_level INTEGER;
  current_user_role TEXT;
BEGIN
  -- Get current user's role and level
  SELECT up.role, ur.role_level INTO current_user_role, current_user_level
  FROM user_profiles up
  JOIN user_roles ur ON up.role = ur.role_name
  WHERE up.user_id = auth.uid();
  
  -- Get target role level
  SELECT role_level INTO target_role_level
  FROM user_roles
  WHERE role_name = new_role AND is_active = true;
  
  -- Check permissions
  IF current_user_level < 60 THEN
    RAISE EXCEPTION 'Insufficient permissions to update user roles';
  END IF;
  
  -- Super admin can assign any role, admin can only assign roles below their level
  IF current_user_role != 'super_admin' AND target_role_level >= current_user_level THEN
    RAISE EXCEPTION 'Cannot assign role equal or higher than your own level';
  END IF;
  
  -- Update the role
  UPDATE user_profiles 
  SET role = new_role, updated_at = NOW()
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_role(UUID, TEXT) TO authenticated;

COMMIT;