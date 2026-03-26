"use client";

import TodoForm from "../TodoForm";
import { useGetTodoByIdQuery, useUpdateTodoMutation } from "@/store/services/todoService";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export default function EditTodoPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: todo, isLoading: isFetching } = useGetTodoByIdQuery(id);
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await updateTodo({ id, data }).unwrap();
      toast.success("Task updated successfully");
      router.push("/todos");
    } catch (error: any) {
      toast.error("Failed to update task", {
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
    <TodoForm 
      initialData={todo?.data} 
      onSubmit={handleSubmit} 
      isLoading={isUpdating} 
      isEdit 
    />
  );
}
