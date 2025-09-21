-- Create admin user for Servisoo
-- Note: This script creates the user profile. The actual auth user must be created through Supabase Auth

-- First, let's create a function to create admin user safely
CREATE OR REPLACE FUNCTION create_admin_user_profile(
  admin_email TEXT,
  admin_full_name TEXT DEFAULT 'Servisoo Administrator',
  admin_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  admin_user_id UUID;
  existing_profile_id UUID;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;
  
  -- If user doesn't exist in auth, we can't create profile
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % does not exist in auth.users. Please create the user first through Supabase Auth.', admin_email;
  END IF;
  
  -- Check if profile already exists
  SELECT id INTO existing_profile_id
  FROM user_profiles
  WHERE user_id = admin_user_id;
  
  -- If profile exists, update it
  IF existing_profile_id IS NOT NULL THEN
    UPDATE user_profiles SET
      full_name = admin_full_name,
      phone = COALESCE(admin_phone, phone),
      role = 'admin',
      is_active = true,
      email_verified = true,
      updated_at = NOW()
    WHERE user_id = admin_user_id;
    
    RAISE NOTICE 'Updated existing profile for user %', admin_email;
    RETURN existing_profile_id;
  ELSE
    -- Create new profile
    INSERT INTO user_profiles (
      user_id,
      full_name,
      phone,
      role,
      is_active,
      email_verified,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      admin_full_name,
      admin_phone,
      'admin',
      true,
      true,
      NOW(),
      NOW()
    ) RETURNING id INTO existing_profile_id;
    
    RAISE NOTICE 'Created new profile for user %', admin_email;
    RETURN existing_profile_id;
  END IF;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permission to service_role
GRANT EXECUTE ON FUNCTION create_admin_user_profile(TEXT, TEXT, TEXT) TO service_role;

-- Create a function to setup initial admin (to be run manually)
CREATE OR REPLACE FUNCTION setup_initial_admin()
RETURNS TEXT AS $$
DECLARE
  result_message TEXT;
BEGIN
  -- This function provides instructions for manual admin setup
  result_message := '
=== MANUAL ADMIN SETUP INSTRUCTIONS ===

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" and create user with:
   - Email: admin@servisoo.com
   - Password: [Generate secure password]
   - Email Confirm: true
   
3. After creating the user, run this SQL in Supabase SQL Editor:
   SELECT create_admin_user_profile(''admin@servisoo.com'', ''Servisoo Administrator'');
   
4. The admin user will be ready to use with full admin permissions.

Alternatively, if the user already exists, just run:
SELECT create_admin_user_profile(''admin@servisoo.com'', ''Servisoo Administrator'');

=== END INSTRUCTIONS ===
';
  
  RAISE NOTICE '%', result_message;
  RETURN result_message;
END;
$$ language 'plpgsql';

-- Create a function to promote existing user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
  current_user_level INTEGER;
BEGIN
  -- Check if current user has permission (must be super_admin)
  SELECT ur.role_level INTO current_user_level
  FROM user_profiles up
  JOIN user_roles ur ON up.role = ur.role_name
  WHERE up.user_id = auth.uid();
  
  IF current_user_level < 100 THEN
    RAISE EXCEPTION 'Only super_admin can promote users to admin';
  END IF;
  
  -- Find target user
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update or create profile
  INSERT INTO user_profiles (
    user_id, role, is_active, email_verified, full_name, created_at, updated_at
  )
  SELECT 
    target_user_id, 
    'admin', 
    true, 
    true, 
    COALESCE(au.raw_user_meta_data->>'full_name', au.email),
    NOW(),
    NOW()
  FROM auth.users au WHERE au.id = target_user_id
  ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    is_active = true,
    updated_at = NOW();
  
  RETURN true;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION promote_user_to_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION setup_initial_admin() TO authenticated;

-- Display setup instructions
SELECT setup_initial_admin();

COMMIT;