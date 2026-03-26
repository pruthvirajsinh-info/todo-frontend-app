"use client";

import RoleForm from "../RoleForm";
import { useGetRoleByIdQuery, useUpdateRoleMutation } from "@/store/services/roleService";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: role, isLoading: isFetching } = useGetRoleByIdQuery(id);
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await updateRole({ id, data }).unwrap();
      toast.success("Role updated successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error("Failed to update role", {
        description: error.data?.message || "Something went wrong",
      });
      throw error;
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <RoleForm 
      initialData={role?.data} 
      onSubmit={handleSubmit} 
      isLoading={isUpdating} 
      isEdit 
    />
  );
}
