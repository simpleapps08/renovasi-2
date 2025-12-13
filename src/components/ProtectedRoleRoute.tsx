import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthorizedForRole, UserRole } from '@/utils/roleUtils';

interface ProtectedRoleRouteProps {
  /**
   * The component to render if user is authorized
   */
  children: React.ReactNode;

  /**
   * Array of roles that are allowed to access this route
   * User must have one of these roles (or higher level role)
   * 
   * @example
   * allowedRoles={['admin', 'super_admin']}
   * allowedRoles={['user']} // All users with user level or higher
   */
  allowedRoles: UserRole[];

  /**
   * Path to redirect to if user is not authorized
   * Defaults to '/dashboard'
   * 
   * @example
   * fallbackPath="/login" // Send to login page
   * fallbackPath="/unauthorized" // Send to unauthorized page
   */
  fallbackPath?: string;
}

/**
 * ProtectedRoleRoute Component
 * 
 * Protects routes based on user role using role-level hierarchy.
 * Only renders children if the authenticated user has one of the allowed roles.
 * 
 * Best practices:
 * - Always specify allowed roles explicitly
 * - Use role hierarchy (admin includes admin+super_admin access)
 * - Combine with route organization for cleaner code
 * 
 * @example
 * <Route path="/admin/*" element={
 *   <ProtectedRoleRoute 
 *     allowedRoles={['admin', 'super_admin']}
 *     fallbackPath="/dashboard"
 *   >
 *     <AdminLayout />
 *   </ProtectedRoleRoute>
 * } />
 * 
 * @example
 * <Route path="/super-admin/*" element={
 *   <ProtectedRoleRoute 
 *     allowedRoles={['super_admin']}
 *     fallbackPath="/admin"
 *   >
 *     <SuperAdminLayout />
 *   </ProtectedRoleRoute>
 * } />
 */
export function ProtectedRoleRoute({
  children,
  allowedRoles,
  fallbackPath = '/dashboard'
}: ProtectedRoleRouteProps) {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not authorized for this route - redirect to fallback
  if (!isAuthorizedForRole(profile?.role, allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Authorized - render component
  return <>{children}</>;
}

export default ProtectedRoleRoute;
