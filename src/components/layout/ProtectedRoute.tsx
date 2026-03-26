"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, permission }: { children: React.ReactNode, permission?: string }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  if (permission && user && !user.permissions.includes(permission) && !user.roles.includes("superadmin")) {
    return <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">Access Denied: Missing Permission {permission}</div>;
  }

  return <>{children}</>;
}
