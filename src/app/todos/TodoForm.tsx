"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const todoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().nullable(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialData?: any;
  onSubmit: (data: TodoFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

export default function TodoForm({ initialData, onSubmit, isLoading, isEdit }: TodoFormProps) {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || "",
      status: initialData.status,
      priority: initialData.priority,
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : null,
    } : {
      status: "pending",
      priority: "medium",
    },
  });

  const handleFormSubmit = async (data: TodoFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/todos"
          className="p-3 glass-hover rounded-2xl text-muted-foreground hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gradient">{isEdit ? "Edit Task" : "Create New Task"}</h2>
          <p className="text-muted-foreground mt-1">Keep track of your productivity goals.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="glass p-8 rounded-3xl space-y-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Task Title</label>
            <input
              {...register("title")}
              placeholder="e.g. Design System Audit"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            />
            {errors.title && <p className="text-xs text-destructive ml-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Description</label>
            <textarea
              {...register("description")}
              placeholder="Provide more context about this task..."
              rows={4}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Status</label>
              <select
                {...register("status")}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="pending" className="bg-card text-foreground">Pending</option>
                <option value="in_progress" className="bg-card text-foreground">In Progress</option>
                <option value="completed" className="bg-card text-foreground">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Priority</label>
              <select
                {...register("priority")}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="low" className="bg-card text-emerald-500">Low Priority</option>
                <option value="medium" className="bg-card text-amber-500">Medium Priority</option>
                <option value="high" className="bg-card text-destructive">High Priority</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium ml-1">Due Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                <input
                  {...register("dueDate")}
                  type="date"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
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
                <span>{isEdit ? "Update Task" : "Create Task"}</span>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
