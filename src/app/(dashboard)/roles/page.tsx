"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/store/services/roleService";
import { ColDef } from "ag-grid-community";
import { toast } from "sonner";
import ActionButtons from "@/components/ui/ActionButtons";
import { Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function RolesPage() {
  const { data: roles, isLoading } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete role", { description: error.data?.message });
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "name", headerName: "Role Name", filter: true, minWidth: 200 },
    { field: "description", headerName: "Description", filter: true, minWidth: 300 },
    { 
      headerName: "Permissions", 
      valueGetter: (params) => params.data.rolePermissions?.length || 0,
      width: 150 
    },
    {
      headerName: "Actions",
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <ActionButtons 
          editPath={`/roles/${params.data.id}`}
          onDelete={params.data.name === 'superadmin' ? undefined : () => handleDelete(params.data.id)}
        />
      )
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">Role Management</h2>
            <p className="text-muted-foreground mt-1">Define security roles and assign granular permissions.</p>
          </div>
        </div>
        
        <Link 
          href="/roles/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          <span>Add Role</span>
        </Link>
      </div>

      <AGGridTable 
        rowData={roles?.data || []} 
        columnDefs={columnDefs} 
        isLoading={isLoading} 
      />
    </div>
  );
}
