-- Create user_roles table for comprehensive role management system
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_display_name VARCHAR(100) NOT NULL,
  role_description TEXT,
  role_level INTEGER NOT NULL DEFAULT 1,
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_roles_name ON user_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_user_roles_level ON user_roles(role_level);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(is_active);

-- Insert default roles with hierarchical levels
INSERT INTO user_roles (role_name, role_display_name, role_description, role_level, permissions) VALUES
('super_admin', 'Super Administrator', 'Akses penuh ke seluruh sistem', 100, '{
  "users": ["create", "read", "update", "delete"],
  "roles": ["create", "read", "update", "delete"],
  "content": ["create", "read", "update", "delete"],
  "billing": ["create", "read", "update", "delete"],
  "gallery": ["create", "read", "update", "delete"],
  "materials": ["create", "read", "update", "delete"],
  "rab": ["create", "read", "update", "delete"],
  "toko": ["create", "read", "update", "delete"],
  "upah": ["create", "read", "update", "delete"],
  "system": ["create", "read", "update", "delete"]
}'),
('admin', 'Administrator', 'Administrator dengan akses luas', 80, '{
  "users": ["create", "read", "update"],
  "content": ["create", "read", "update", "delete"],
  "billing": ["read", "update"],
  "gallery": ["create", "read", "update", "delete"],
  "materials": ["create", "read", "update", "delete"],
  "rab": ["create", "read", "update", "delete"],
  "toko": ["create", "read", "update", "delete"],
  "upah": ["create", "read", "update", "delete"]
}'),
('moderator', 'Moderator', 'Moderator konten dan user', 60, '{
  "users": ["read", "update"],
  "content": ["create", "read", "update"],
  "gallery": ["create", "read", "update"],
  "materials": ["read", "update"],
  "rab": ["read", "update"],
  "toko": ["read", "update"]
}'),
('premium_user', 'Premium User', 'User premium dengan fitur tambahan', 40, '{
  "content": ["create", "read"],
  "gallery": ["create", "read"],
  "materials": ["read"],
  "rab": ["create", "read", "update"],
  "toko": ["read"]
}'),
('user', 'Regular User', 'User biasa dengan akses terbatas', 20, '{
  "content": ["read"],
  "gallery": ["read"],
  "materials": ["read"],
  "rab": ["create", "read"],
  "toko": ["read"]
}'),
('guest', 'Guest', 'Pengunjung tanpa akun', 1, '{
  "content": ["read"],
  "gallery": ["read"],
  "materials": ["read"],
  "toko": ["read"]
}');

-- Enable RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Everyone can view active roles" ON user_roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only super_admin can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      JOIN user_roles ur ON up.role = ur.role_name 
      WHERE up.user_id = auth.uid() 
      AND ur.role_name = 'super_admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_roles_updated_at();

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(permission_type TEXT, action TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
BEGIN
  -- Get user permissions from role
  SELECT ur.permissions INTO user_permissions
  FROM user_profiles up
  JOIN user_roles ur ON up.role = ur.role_name
  WHERE up.user_id = auth.uid() AND ur.is_active = true;
  
  -- Check if user has the required permission
  RETURN user_permissions ? permission_type AND 
         user_permissions->permission_type ? action;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create function to get user role level
CREATE OR REPLACE FUNCTION get_user_role_level()
RETURNS INTEGER AS $$
DECLARE
  role_level INTEGER;
BEGIN
  SELECT ur.role_level INTO role_level
  FROM user_profiles up
  JOIN user_roles ur ON up.role = ur.role_name
  WHERE up.user_id = auth.uid() AND ur.is_active = true;
  
  RETURN COALESCE(role_level, 1);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION check_user_permission(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role_level() TO authenticated;