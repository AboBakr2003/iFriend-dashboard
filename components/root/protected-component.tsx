/**
 * ProtectedComponent
 * 
 * A reusable component wrapper that shows content only if user has the required permission(s)
 * 
 * Usage:
 * <ProtectedComponent permission="Users">
 *   <button>Delete User</button>
 * </ProtectedComponent>
 * 
 * Or with multiple permissions (OR logic):
 * <ProtectedComponent permissions={["Users", "Settings"]}>
 *   <button>Manage</button>
 * </ProtectedComponent>
 */

import { useAuth } from '@/contexts/auth-context';
import { ReactNode } from 'react';

interface ProtectedComponentProps {
  /** Single permission required to view the component */
  permission?: string;
  /** Multiple permissions - user needs at least ONE to view (OR logic) */
  permissions?: string[];
  /** Content to show when user doesn't have permission */
  fallback?: ReactNode;
  /** Children to render if user has permission */
  children: ReactNode;
}

export function ProtectedComponent({
  permission,
  permissions,
  fallback = null,
  children,
}: ProtectedComponentProps) {
  const { permissions: userPermissions } = useAuth();

  // Determine required permissions
  const requiredPerms = permission ? [permission] : permissions || [];

  // Check if user has at least one of the required permissions
  const hasAccess = requiredPerms.length === 0 ||
    requiredPerms.some(perm => userPermissions.includes(perm));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * ProtectedRoute Component
 * 
 * Use this to protect entire pages/routes
 * 
 * Usage in a page component:
 * 
 * export default function UsersPage() {
 *   return (
 *     <ProtectedRoute permission="Users" redirectTo="/">
 *       <div>Users Management Content</div>
 *     </ProtectedRoute>
 *   );
 * }
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  /** Single permission required to access this route */
  permission?: string;
  /** Multiple permissions - user needs at least ONE (OR logic) */
  permissions?: string[];
  /** Where to redirect if user doesn't have permission */
  redirectTo?: string;
  /** Message to show before redirect */
  unauthorizedMessage?: string;
  /** Children to render if user has permission */
  children: ReactNode;
}

export function ProtectedRoute({
  permission,
  permissions,
  redirectTo = '/',
  unauthorizedMessage = 'ليس لديك صلاحية للوصول إلى هذه الصفحة',
  children,
}: ProtectedRouteProps) {
  const { permissions: userPermissions, isAuthenticated } = useAuth();
  const router = useRouter();

  // Determine required permissions
  const requiredPerms = permission ? [permission] : permissions || [];

  // Check if user has at least one of the required permissions
  const hasAccess = requiredPerms.length === 0 ||
    requiredPerms.some(perm => userPermissions.includes(perm));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (!hasAccess) {
      console.warn(unauthorizedMessage);
      router.push(redirectTo);
    }
  }, [hasAccess, isAuthenticated, router, redirectTo, unauthorizedMessage]);

  if (!isAuthenticated || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">جاري التحويل...</h2>
          <p className="text-gray-600">{unauthorizedMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
