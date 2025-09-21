import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database directly...');
    console.log('📊 Project ID:', supabaseUrl.split('//')[1].split('.')[0]);
    console.log('');

    // Step 1: Create user_roles table
    console.log('📋 Step 1: Creating user_roles table...');
    
    const createRolesTable = `
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
    `;
    
    const { error: createTableError } = await supabase.rpc('exec', { sql: createRolesTable });
    
    if (createTableError) {
      console.log('⚠️  RPC exec failed, trying direct table creation...');
      
      // Try using direct SQL execution via edge function or manual approach
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);
        
      if (error && error.message.includes('does not exist')) {
        console.log('❌ Table user_roles does not exist and cannot be created via client.');
        console.log('💡 Please create the table manually in Supabase Dashboard:');
        console.log('');
        console.log('SQL to run in Supabase SQL Editor:');
        console.log('=' .repeat(60));
        console.log(createRolesTable);
        console.log('');
        console.log('-- Insert default roles');
        console.log(`INSERT INTO public.user_roles (role_name, role_level, permissions, description) VALUES`);
        console.log(`('super_admin', 1, '{"all": true, "manage_users": true, "manage_roles": true, "manage_system": true}', 'Super Administrator with full system access'),`);
        console.log(`('admin', 2, '{"manage_users": true, "manage_content": true, "view_analytics": true}', 'Administrator with user and content management'),`);
        console.log(`('manager', 3, '{"manage_content": true, "view_analytics": true, "manage_team": true}', 'Manager with content and team management'),`);
        console.log(`('editor', 4, '{"manage_content": true, "edit_posts": true}', 'Editor with content management permissions'),`);
        console.log(`('user', 5, '{"view_content": true, "create_posts": true}', 'Regular user with basic permissions')`);
        console.log(`ON CONFLICT (role_name) DO NOTHING;`);
        console.log('');
        console.log('=' .repeat(60));
        return;
      } else if (!error) {
        console.log('✅ Table user_roles already exists');
      }
    } else {
      console.log('✅ Table user_roles created successfully');
    }

    // Step 2: Insert default roles
    console.log('📋 Step 2: Inserting default roles...');
    
    const roles = [
      {
        role_name: 'super_admin',
        role_level: 1,
        permissions: { all: true, manage_users: true, manage_roles: true, manage_system: true },
        description: 'Super Administrator with full system access'
      },
      {
        role_name: 'admin',
        role_level: 2,
        permissions: { manage_users: true, manage_content: true, view_analytics: true },
        description: 'Administrator with user and content management'
      },
      {
        role_name: 'manager',
        role_level: 3,
        permissions: { manage_content: true, view_analytics: true, manage_team: true },
        description: 'Manager with content and team management'
      },
      {
        role_name: 'editor',
        role_level: 4,
        permissions: { manage_content: true, edit_posts: true },
        description: 'Editor with content management permissions'
      },
      {
        role_name: 'user',
        role_level: 5,
        permissions: { view_content: true, create_posts: true },
        description: 'Regular user with basic permissions'
      }
    ];

    for (const role of roles) {
      const { error: insertError } = await supabase
        .from('user_roles')
        .upsert(role, { onConflict: 'role_name' });
        
      if (insertError) {
        console.log(`⚠️  Error inserting role ${role.role_name}:`, insertError.message);
      } else {
        console.log(`✅ Role ${role.role_name} inserted/updated`);
      }
    }

    // Step 3: Check and modify user_profiles table
    console.log('📋 Step 3: Checking user_profiles table...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (profilesError) {
      console.log('❌ Cannot access user_profiles table:', profilesError.message);
      console.log('💡 Please ensure user_profiles table exists in your Supabase project.');
      return;
    }
    
    console.log('✅ user_profiles table accessible');

    // Step 4: Create admin user
    console.log('📋 Step 4: Creating admin user...');
    
    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role_name', 'admin')
      .single();
      
    if (roleError || !adminRole) {
      console.log('❌ Admin role not found:', roleError?.message);
      return;
    }
    
    console.log('✅ Admin role found:', adminRole.id);
    
    // Create admin user profile
    const adminUser = {
      id: crypto.randomUUID(),
      email: 'admin@servisoo',
      full_name: 'System Administrator',
      role_id: adminRole.id
    };
    
    const { error: adminError } = await supabase
      .from('user_profiles')
      .upsert(adminUser, { onConflict: 'email' });
      
    if (adminError) {
      console.log('❌ Error creating admin user:', adminError.message);
      console.log('💡 This might be due to missing role_id column in user_profiles.');
      console.log('💡 Please add role_id column manually:');
      console.log('ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id);');
    } else {
      console.log('✅ Admin user created/updated successfully!');
      console.log('📧 Email: admin@servisoo');
      console.log('👤 Name: System Administrator');
      console.log('🎭 Role: admin');
    }

    console.log('');
    console.log('🎉 Database setup completed!');
    console.log('💡 You can now test the admin user functionality.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run setup if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('setup-database-direct.js')) {
  setupDatabase();
}

export { setupDatabase };