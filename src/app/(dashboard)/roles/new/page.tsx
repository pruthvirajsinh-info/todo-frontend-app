"use client";

import RoleForm from "../RoleForm";
import { useCreateRoleMutation } from "@/store/services/roleService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewRolePage() {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createRole(data).unwrap();
      toast.success("Role created successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error("Failed to create role", {
        description: error.data?.message || "Something went wrong",
      });
      throw error;
    }
  };

  return <RoleForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
