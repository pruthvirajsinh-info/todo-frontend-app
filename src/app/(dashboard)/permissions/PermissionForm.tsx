"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

const permissionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  initialData?: any;
  onSubmit: (data: PermissionFormData) => void;
  isLoading?: boolean;
}

export default function PermissionForm({ initialData, onSubmit, isLoading }: PermissionFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Permission Name (e.g. module:action)</label>
          <input
            {...register("name")}
            placeholder="users:create"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all glass"
          />
          {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Description</label>
          <input
            {...register("description")}
            placeholder="Allows creating users"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all glass"
          />
          {errors.description && <p className="text-xs text-destructive ml-1">{errors.description.message}</p>}
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
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              <span>{initialData ? "Save Changes" : "Create Permission"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
