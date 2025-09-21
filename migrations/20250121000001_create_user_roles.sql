-- Migration: Create user_roles table
-- Created: 2025-01-21
-- Description: Creates the user_roles table with hierarchical role system

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_level INTEGER NOT NULL,
    permissions JSONB DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for role_level for faster queries
CREATE INDEX IF NOT EXISTS idx_user_roles_level ON public.user_roles(role_level);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);

-- Insert default roles with hierarchical levels
INSERT INTO public.user_roles (role_name, role_level, permissions, description) VALUES
('super_admin', 1, '{"all": true, "manage_users": true, "manage_roles": true, "manage_system": true}', 'Super Administrator with full system access'),
('admin', 2, '{"manage_users": true, "manage_content": true, "view_analytics": true}', 'Administrator with user and content management'),
('manager', 3, '{"manage_content": true, "view_analytics": true, "manage_team": true}', 'Manager with content and team management'),
('editor', 4, '{"manage_content": true, "edit_posts": true}', 'Editor with content management permissions'),
('user', 5, '{"view_content": true, "create_posts": true}', 'Regular user with basic permissions')
ON CONFLICT (role_name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles (only authenticated users can read)
CREATE POLICY "Users can view roles" ON public.user_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for admins to manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_level <= 2
        )
    );

COMMIT;