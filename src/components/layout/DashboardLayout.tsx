"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) return <>{children}</>;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col md:pl-[260px] transition-all duration-300 overflow-x-hidden">
          <Header />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 flex-1"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
