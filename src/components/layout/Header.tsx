"use client";

import { useAuth } from "@/hooks/useAuth";
import { User, Bell, Search } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  
  // Robust role extraction:
  // 1. Check user.roles (array of strings from backend getMe/login)
  // 2. Check user.userRoles (orm relation if spread)
  const roleName = user?.roles?.[0] || user?.userRoles?.[0]?.role?.name || "No Role";

  return (
    <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between gap-4">
      <div className="flex-1 max-w-xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for tasks, users or modules..."
          className="w-full h-11 pl-12 pr-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 glass-hover rounded-full text-muted-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
        </button>
        
        <div className="h-10 w-px bg-white/5 mx-2" />
        
        <div className="flex items-center gap-4 px-2 py-1.5 rounded-2xl glass-hover cursor-pointer border border-transparent hover:border-white/10 transition-all">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold">{user?.name || "Guest"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{roleName}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
