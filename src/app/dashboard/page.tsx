"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Tasks", value: "24", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
    { label: "In Progress", value: "8", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "High Priority", value: "3", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Completed", value: "12", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Hello, {user?.name || "User"}</h2>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl space-y-4"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-3xl h-[400px] flex flex-col justify-center items-center text-muted-foreground">
          <TrendingUp size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">Activity Chart Coming Soon</p>
          <p className="text-sm">We are preparing your productivity analytics.</p>
        </div>
        
        <div className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">You completed &quot;UI Design Polish&quot;</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
