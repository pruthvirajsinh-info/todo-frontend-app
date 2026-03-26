"use client";

import { useRouter } from "next/navigation";
import { useCreatePermissionMutation } from "@/store/services/permissionService";
import PermissionForm, { PermissionFormData } from "../PermissionForm";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPermissionPage() {
  const router = useRouter();
  const [createPermission, { isLoading }] = useCreatePermissionMutation();

  const handleSubmit = async (data: PermissionFormData) => {
    try {
      await createPermission(data).unwrap();
      toast.success("Permission created successfully!");
      router.push("/permissions");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create permission");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/permissions"
          className="p-3 glass-hover rounded-2xl text-muted-foreground hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gradient">New Permission</h2>
          <p className="text-muted-foreground mt-1">Define a new system-wide permission rule.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
        <PermissionForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
