"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-3xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">Welcome to Aura</h1>
          <p className="text-muted-foreground">Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive ml-1">{(errors.email as any).message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-xs text-destructive ml-1">{(errors.password as any).message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <span className="text-primary hover:underline cursor-pointer">Contact Admin</span>
        </p>
      </motion.div>
    </div>
  );
}
