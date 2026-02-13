"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { MENU_ROUTES, getFirstAccessibleRoute } from "@/lib/menu-routes";
import IFriendSpinner from "./ifriend-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * يحمي المسارات ويتحقق من صلاحيات المستخدم
 * - يتحقق من تسجيل الدخول
 * - يتحقق من صلاحيات الوصول للصفحة الحالية
 * - يمنع الوصول للصفحات غير المصرح بها
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { permissions, isAuthenticated, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) {
      return;
    }

    // Skip protection for sign-in page
    if (pathname === "/sign-in") {
      setIsChecking(false);
      return;
    }

    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    // Public routes - accessible to any authenticated user without permission check
    const publicRoutes = ["/profile"];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      setIsChecking(false);
      return;
    }

    // Find the route that matches the current pathname
    const currentRoute = MENU_ROUTES.find(route => {
      // Exact match for home page
      if (route.href === "/" && pathname === "/") {
        return true;
      }
      // For other routes, check if pathname starts with the route href
      if (route.href !== "/" && pathname.startsWith(route.href)) {
        return true;
      }
      return false;
    });

    // If no route found in MENU_ROUTES, redirect to not-found
    if (!currentRoute) {
      router.replace("/not-found");
      return;
    }

    // Check if user has at least one of the required permissions
    const hasPermission = currentRoute.requiredPermissions.some(permission =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      // User doesn't have required permissions
      router.replace("/not-found");
      return;
    }

    // All checks passed - user is authenticated and has permission
    setIsChecking(false);
  }, [pathname, permissions, isAuthenticated, isLoading, router]);

  // Show loading state while checking permissions
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IFriendSpinner />
      </div>
    );
  }

  return <>{children}</>;
}