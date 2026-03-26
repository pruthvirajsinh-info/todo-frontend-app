"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type UserFormData = {
  name: string;
  email: string;
  isActive: boolean;
  password?: string;
};

interface UserFormProps {
  initialData?: any;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

export default function UserForm({ initialData, onSubmit, isLoading, isEdit }: UserFormProps) {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || { isActive: true },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    // If edit and password is empty, remove it
    const payload = { ...data };
    if (isEdit && !payload.password) delete payload.password;
    
    try {
      await onSubmit(payload);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/users"
          className="p-3 glass-hover rounded-2xl text-muted-foreground hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gradient">{isEdit ? "Edit User" : "Create New User"}</h2>
          <p className="text-muted-foreground mt-1">
            {isEdit ? "Update user profile and permissions" : "Add a new member to your team"}
          </p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="glass p-8 rounded-3xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Full Name</label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
          </div>

          {(!isEdit) && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium ml-1">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>
          )}

          <div className="flex items-center gap-3 space-y-2 md:col-span-2">
            <input
              type="checkbox"
              {...register("isActive")}
              id="isActive"
              className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active Account
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl font-semibold glass-hover text-muted-foreground transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Save size={20} />
                <span>{isEdit ? "Update User" : "Create User"}</span>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
