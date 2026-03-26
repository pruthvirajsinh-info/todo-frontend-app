"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPermissionByIdQuery, useUpdatePermissionMutation } from "@/store/services/permissionService";
import PermissionForm, { PermissionFormData } from "../PermissionForm";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPermissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params["id"] as string;

  const { data: permissionData, isLoading: isFetching } = useGetPermissionByIdQuery(id);
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();

  const handleSubmit = async (data: PermissionFormData) => {
    try {
      await updatePermission({ id, data }).unwrap();
      toast.success("Permission updated successfully!");
      router.push("/permissions");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update permission");
    }
  };

  if (isFetching) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium animate-pulse">Loading Permission...</p>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gradient">Edit Permission</h2>
          <p className="text-muted-foreground mt-1">Update the definition for this permission rule.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
        <PermissionForm 
          initialData={permissionData?.data} 
          onSubmit={handleSubmit} 
          isLoading={isUpdating} 
        />
      </motion.div>
    </div>
  );
}
