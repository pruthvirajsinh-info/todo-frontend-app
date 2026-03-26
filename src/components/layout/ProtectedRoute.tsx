"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, permission }: { children: React.ReactNode, permission?: string }) {
  const { isAuthenticated, isInitialLoading, user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no token found after initialization, redirect to login
    if (!isInitialLoading && !token && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isInitialLoading, token, router, pathname]);

  // If we are still restoring the session, don't show anything yet.
  // The DashboardLayout loader will be visible.
  if (isInitialLoading) {
    return null;
  }

  // If no session found and not on login, don't show children.
  if (!token && pathname !== "/login") {
    return null;
  }

  // Permission Check
  if (permission && user) {
    const userPermissions = user.permissions || [];
    const userRoles = user.roles || [];
    const isSuperAdmin = userRoles.includes("superadmin");

    if (!isSuperAdmin && !userPermissions.includes(permission)) {
      return (
        <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20 m-8 glass">
          <h3 className="text-xl font-bold mb-2">Access Denied</h3>
          <p>You do not have the required permission: <code className="bg-destructive/20 px-2 py-0.5 rounded">{permission}</code></p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
