"use client";

import { useGetPermissionsQuery, useDeletePermissionMutation } from "@/store/services/permissionService";
import AGGridTable from "@/components/ui/AGGridTable";
import type { ColDef } from "ag-grid-community";
import { Plus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionButtons from "@/components/ui/ActionButtons";
import Link from "next/link";
import { useMemo } from "react";

export default function PermissionsPage() {
  const router = useRouter();
  const { data: permissionsData, isLoading } = useGetPermissionsQuery();
  const [deletePermission] = useDeletePermissionMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) return;
    try {
      await deletePermission(id).unwrap();
      toast.success("Permission deleted successfully");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete permission");
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "name", headerName: "Name", flex: 1, sortable: true, filter: true, minWidth: 200 },
    { field: "description", headerName: "Description", flex: 2, minWidth: 300 },
    { 
      field: "createdAt", 
      headerName: "Created At", 
      width: 150, 
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : "-" 
    },
    {
      headerName: "Actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <ActionButtons 
          editPath={`/permissions/${params.data.id}`}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">Permission Management</h2>
            <p className="text-muted-foreground mt-1">Manage system-wide permissions and access rules.</p>
          </div>
        </div>
        
        <Link 
          href="/permissions/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          <span>Add Permission</span>
        </Link>
      </div>

      <AGGridTable 
        rowData={permissionsData?.data || []} 
        columnDefs={columnDefs} 
        isLoading={isLoading} 
      />
    </div>
  );
}
