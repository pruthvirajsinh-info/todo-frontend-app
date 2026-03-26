"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "@/store/services/userService";
import { ColDef } from "ag-grid-community";
import { toast } from "sonner";
import ActionButtons from "@/components/ui/ActionButtons";
import StatusSwitch from "@/components/ui/StatusSwitch";
import { Plus, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete user", { description: error.data?.message });
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateUser({ id, data: { isActive: !currentStatus } }).unwrap();
      toast.success(`User ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      toast.error("Failed to update status", { description: error.data?.message });
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "name", headerName: "Name", filter: true, minWidth: 200 },
    { field: "email", headerName: "Email", filter: true, minWidth: 250 },
    { 
      field: "isActive", 
      headerName: "Status", 
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <StatusSwitch 
            checked={params.value} 
            onChange={() => handleStatusToggle(params.data.id, params.value)} 
          />
        </div>
      )
    },
    {
      headerName: "Roles",
      valueGetter: (params) => params.data.userRoles?.map((ur: any) => ur.role.name).join(", ") || "No Role",
      filter: true,
    },
    {
      headerName: "Actions",
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <ActionButtons 
          editPath={`/users/${params.data.id}`}
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
            <UsersIcon size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">User Management</h2>
            <p className="text-muted-foreground mt-1">Manage system users, roles and access levels.</p>
          </div>
        </div>
        
        <Link 
          href="/users/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          <span>Add User</span>
        </Link>
      </div>

      <AGGridTable 
        rowData={users?.data || []} 
        columnDefs={columnDefs} 
        isLoading={isLoading} 
      />
    </div>
  );
}
