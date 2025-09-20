// Role utilities untuk sistem leveling role

export interface RoleLevel {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  description: string;
}

// Mapping role levels berdasarkan sistem database baru
export const ROLE_LEVELS: Record<string, RoleLevel> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    permissions: ['*'],
    description: 'Akses penuh ke semua fitur sistem'
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    level: 80,
    permissions: [
      'user.read',
      'user.create',
      'user.update',
      'user.delete',
      'role.read',
      'role.update',
      'dashboard.access',
      'reports.read'
    ],
    description: 'Mengelola user dan akses ke dashboard admin'
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    level: 60,
    permissions: [
      'user.read',
      'user.update',
      'content.moderate',
      'reports.read'
    ],
    description: 'Moderasi konten dan manajemen user terbatas'
  },
  user: {
    id: 'user',
    name: 'User',
    level: 20,
    permissions: [
      'profile.read',
      'profile.update',
      'content.create',
      'content.read'
    ],
    description: 'User biasa dengan akses terbatas'
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    level: 0,
    permissions: [
      'content.read'
    ],
    description: 'Akses terbatas hanya untuk melihat konten'
  }
};

// Fungsi untuk mendapatkan badge variant berdasarkan role
export const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (role) {
    case 'super_admin':
      return 'destructive';
    case 'admin':
      return 'destructive';
    case 'moderator':
      return 'secondary';
    case 'user':
      return 'default';
    case 'guest':
      return 'outline';
    default:
      return 'default';
  }
};

// Fungsi untuk memeriksa permission
export const hasPermission = (userRole: string, requiredPermission: string): boolean => {
  const role = ROLE_LEVELS[userRole];
  if (!role) return false;
  
  // Super admin memiliki akses ke semua permission
  if (role.permissions.includes('*')) return true;
  
  return role.permissions.includes(requiredPermission);
};

// Fungsi untuk memeriksa level role
export const hasMinimumRoleLevel = (userRole: string, minimumLevel: number): boolean => {
  const role = ROLE_LEVELS[userRole];
  if (!role) return false;
  
  return role.level >= minimumLevel;
};

// Fungsi untuk mendapatkan role yang dapat diubah oleh user tertentu
export const getEditableRoles = (currentUserRole: string): string[] => {
  const currentRole = ROLE_LEVELS[currentUserRole];
  if (!currentRole) return [];
  
  // Super admin dapat mengubah semua role
  if (currentUserRole === 'super_admin') {
    return Object.keys(ROLE_LEVELS);
  }
  
  // Admin dapat mengubah role di bawahnya
  if (currentUserRole === 'admin') {
    return ['moderator', 'user', 'guest'];
  }
  
  // Moderator hanya dapat mengubah user biasa
  if (currentUserRole === 'moderator') {
    return ['user', 'guest'];
  }
  
  return [];
};

// Fungsi untuk format nama role
export const formatRoleName = (role: string): string => {
  const roleData = ROLE_LEVELS[role];
  return roleData ? roleData.name : role.charAt(0).toUpperCase() + role.slice(1);
};

// Fungsi untuk mendapatkan deskripsi role
export const getRoleDescription = (role: string): string => {
  const roleData = ROLE_LEVELS[role];
  return roleData ? roleData.description : 'Role tidak dikenal';
};

// Fungsi untuk validasi role
export const isValidRole = (role: string): boolean => {
  return Object.keys(ROLE_LEVELS).includes(role);
};

// Fungsi untuk mendapatkan semua role yang tersedia
export const getAllRoles = (): RoleLevel[] => {
  return Object.values(ROLE_LEVELS).sort((a, b) => b.level - a.level);
};