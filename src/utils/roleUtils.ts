// Role utilities untuk sistem leveling role

// Type-safe role definitions
export type UserRole = 'super_admin' | 'admin' | 'admin_store' | 'moderator' | 'user' | 'guest';

export interface RoleLevel {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  dashboardPath: string;
  description: string;
}

// Mapping role levels berdasarkan sistem database baru
export const ROLE_LEVELS: Record<string, RoleLevel> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    permissions: ['*'],
    dashboardPath: '/super-admin/dashboard',
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
    dashboardPath: '/admin',
    description: 'Mengelola user dan akses ke dashboard admin'
  },
  admin_store: {
    id: 'admin_store',
    name: 'Admin Toko',
    level: 60,
    permissions: [
      'store.read',
      'store.manage',
      'store.settings',
      'products.manage',
      'sales.read'
    ],
    dashboardPath: '/admin/toko',
    description: 'Mengelola toko dan penjualan'
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    level: 40,
    permissions: [
      'user.read',
      'user.update',
      'content.moderate',
      'reports.read'
    ],
    dashboardPath: '/dashboard',
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
    dashboardPath: '/dashboard',
    description: 'User biasa dengan akses terbatas'
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    level: 0,
    permissions: [
      'content.read'
    ],
    dashboardPath: '/',
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
    case 'admin_store':
      return 'secondary';
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

// ========================================
// NEW HELPER FUNCTIONS FOR ROUTING
// ========================================

/**
 * Centralized role-to-dashboard mapping
 * Single source of truth for role-based redirects
 */
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  super_admin: '/super-admin/dashboard',
  admin: '/admin',
  admin_store: '/admin/toko',
  moderator: '/dashboard',
  user: '/dashboard',
  guest: '/'
};

/**
 * Get the correct dashboard path for a given role
 * Used in login pages to redirect users to their appropriate dashboard
 * 
 * @param role - The user's role
 * @returns The dashboard path for that role
 * 
 * @example
 * const redirectPath = getRedirectPathByRole(userProfile.role);
 * navigate(redirectPath);
 */
export const getRedirectPathByRole = (role: string | undefined): string => {
  if (!role) return '/dashboard';
  return ROLE_DASHBOARD_MAP[role as UserRole] || '/dashboard';
};

/**
 * Check if a user role is authorized for a specific set of required roles
 * Uses role level hierarchy - higher or equal level grants access
 * 
 * @param userRole - The user's current role
 * @param requiredRoles - Array of roles that are allowed
 * @returns true if user is authorized
 * 
 * @example
 * // User must be admin or super_admin
 * const canAccess = isAuthorizedForRole(userRole, ['admin', 'super_admin']);
 * 
 * @example
 * // User must be admin or above
 * const canManageUsers = isAuthorizedForRole(userRole, ['admin']);
 */
export const isAuthorizedForRole = (
  userRole: string | undefined, 
  requiredRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  
  const userLevel = ROLE_LEVELS[userRole]?.level || -1;
  if (userLevel === -1) return false;
  
  // Check if user's role level is >= any of the required role levels
  return requiredRoles.some(role => {
    const requiredLevel = ROLE_LEVELS[role]?.level || 0;
    return userLevel >= requiredLevel;
  });
};

/**
 * Alias for isAuthorizedForRole - check if user has required role(s)
 * 
 * @param userRole - The user's current role
 * @param requiredRoles - Array of roles or single role that is allowed
 * @returns true if user has one of the required roles
 */
export const hasRequiredRole = (
  userRole: string | undefined,
  requiredRoles: UserRole | UserRole[]
): boolean => {
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return isAuthorizedForRole(userRole, rolesArray);
};

/**
 * Check if user has specific permission within their role
 * 
 * @param userRole - The user's role
 * @param requiredPermission - The permission to check
 * @returns true if user has the permission
 * 
 * @example
 * if (hasPermission(userRole, 'user.delete')) {
 *   // Show delete button
 * }
 */
export const hasPermissionForAction = (
  userRole: string | undefined,
  requiredPermission: string
): boolean => {
  if (!userRole) return false;
  return hasPermission(userRole, requiredPermission);
};