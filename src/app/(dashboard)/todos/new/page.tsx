"use client";

import TodoForm from "../TodoForm";
import { useCreateTodoMutation } from "@/store/services/todoService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewTodoPage() {
  const [createTodo, { isLoading }] = useCreateTodoMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createTodo(data).unwrap();
      toast.success("Task created successfully");
      router.push("/todos");
    } catch (error: any) {
      toast.error("Failed to create task", {
        description: error.data?.message || "Something went wrong",
      });
      throw error;
    }
  };

  return <TodoForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
