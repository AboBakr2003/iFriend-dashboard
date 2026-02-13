"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getFirstAccessibleRoute } from "@/lib/menu-routes";
import SignInContent from "@/features/sign-in/sign-in-content";

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, permissions } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to their first accessible page
    if (isAuthenticated && permissions.length > 0) {
      const firstPage = getFirstAccessibleRoute(permissions);
      router.replace(firstPage);
    }
  }, [isAuthenticated, permissions, router]);

  // Only show sign-in page if user is not authenticated
  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  return <SignInContent />;
}
