"use client";

import UserForm from "../UserForm";
import { useCreateUserMutation } from "@/store/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createUser(data).unwrap();
      toast.success("User created successfully");
      router.push("/users");
    } catch (error: any) {
      toast.error("Failed to create user", {
        description: error.data?.message || "Something went wrong",
      });
      throw error;
    }
  };

  return <UserForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
