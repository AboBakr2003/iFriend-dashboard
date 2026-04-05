"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getFirstAccessibleRoute } from "@/lib/menu-routes";
import SignInContent from "@/features/sign-in/sign-in-content";

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, permissions } = useAuth();

  // 👇 هنا بقى الجديد
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

  useEffect(() => {
    // 👇 لو مفعل skip auth، دخّله على طول
    if (skipAuth) {
      router.replace("/"); // أو أى صفحة dashboard عندك
      return;
    }

    // If user is already authenticated, redirect to their first accessible page
    if (isAuthenticated && permissions.length > 0) {
      const firstPage = getFirstAccessibleRoute(permissions);
      router.replace(firstPage);
    }
  }, [isAuthenticated, permissions, router, skipAuth]);

  // 👇 لو skipAuth شغال، متظهرش صفحة login أصلاً
  if (skipAuth) {
    return null;
  }

  // Only show sign-in page if user is not authenticated
  if (isAuthenticated) {
    return null;
  }

  return <SignInContent />;
}
