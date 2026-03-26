"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetTodosQuery, useDeleteTodoMutation, useUpdateTodoMutation } from "@/store/services/todoService";
import { ColDef } from "ag-grid-community";
import { toast } from "sonner";
import ActionButtons from "@/components/ui/ActionButtons";
import { Plus, CheckSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const PRIORITY_COLORS = {
  high: "text-destructive bg-destructive/10",
  medium: "text-amber-500 bg-amber-500/10",
  low: "text-emerald-500 bg-emerald-500/10",
};

const STATUS_ICONS = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle2,
};

export default function TodosPage() {
  const { data: todos, isLoading } = useGetTodosQuery();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTodo(id).unwrap();
      toast.success("Task deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete task", { description: error.data?.message });
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: "title", 
      headerName: "Task Title", 
      filter: true, 
      minWidth: 250,
      cellRenderer: (params: any) => (
        <div className="font-semibold">{params.value}</div>
      )
    },
    { 
      field: "priority", 
      headerName: "Priority", 
      width: 130,
      cellRenderer: (params: any) => (
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
          PRIORITY_COLORS[params.value as keyof typeof PRIORITY_COLORS]
        )}>
          {params.value}
        </div>
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 150,
      cellRenderer: (params: any) => {
        const Icon = STATUS_ICONS[params.value as keyof typeof STATUS_ICONS] || Clock;
        return (
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-muted-foreground" />
            <span className="capitalize">{params.value.replace("_", " ")}</span>
          </div>
        );
      }
    },
    {
      headerName: "Owner",
      valueGetter: (params) => params.data.user?.name || "Unknown",
      filter: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      sort: 'desc',
    },
    {
      headerName: "Actions",
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <ActionButtons 
          editPath={`/todos/${params.data.id}`}
          onDelete={() => handleDelete(params.data.id)}
        />
      )
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <CheckSquare size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">Todo Management</h2>
            <p className="text-muted-foreground mt-1">Track and manage your project tasks.</p>
          </div>
        </div>
        
        <Link 
          href="/todos/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          <span>New Task</span>
        </Link>
      </div>

      <AGGridTable 
        rowData={todos?.data || []} 
        columnDefs={columnDefs} 
        isLoading={isLoading} 
      />
    </div>
  );
}
