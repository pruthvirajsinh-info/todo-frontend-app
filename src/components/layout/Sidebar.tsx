"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSidebarTabsQuery } from "@/store/services/metaService";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { data: tabsData } = useGetSidebarTabsQuery();

  const visibleTabs = useMemo(() => {
    if (!tabsData?.data || !user) return [];

    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];
    const isSuperAdmin = userRoles.includes("superadmin");

    return tabsData.data
      .filter((tab: any) => {
        // Superadmin bypass
        if (isSuperAdmin) return true;
        
        // Permission check: module:read
        const moduleName = tab.module?.name;
        if (!moduleName) return false;
        
        return userPermissions.includes(`${moduleName}:read`);
      })
      .sort((a: any, b: any) => a.order - b.order);
  }, [tabsData, user]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "260px" }}
      className="glass flex flex-col h-screen fixed left-0 top-0 z-50 border-r"
    >
      <div className="p-6 flex items-center justify-between overflow-hidden">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-gradient whitespace-nowrap"
            >
              AURA TODO
            </motion.h1>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 glass-hover rounded-lg text-muted-foreground"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-x-hidden">
        {visibleTabs.map((tab: any) => {
          const IconComponent = (LucideIcons as any)[tab.icon] || Settings;
          const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`);

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground glass-hover"
              )}
            >
              <IconComponent size={24} className={cn(isActive ? "text-white" : "group-hover:text-primary")} />
              {!isCollapsed && <span className="font-medium">{tab.label}</span>}
              {isCollapsed && (
                <div className="absolute left-16 bg-card border px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {tab.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        {!isCollapsed && user && (
          <div className="px-3 py-3 mb-2 rounded-xl bg-white/5 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate font-medium">
              {user.roles?.[0] || 'User'}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-destructive glass-hover transition-colors"
        >
          <LogOut size={24} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
