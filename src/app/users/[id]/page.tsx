"use client";

import UserForm from "../UserForm";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/store/services/userService";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: user, isLoading: isFetching } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await updateUser({ id, data }).unwrap();
      toast.success("User updated successfully");
      router.push("/users");
    } catch (error: any) {
      toast.error("Failed to update user", {
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
    <UserForm 
      initialData={user?.data} 
      onSubmit={handleSubmit} 
      isLoading={isUpdating} 
      isEdit 
    />
  );
}
