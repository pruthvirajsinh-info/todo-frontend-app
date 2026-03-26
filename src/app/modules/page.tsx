"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetModulesQuery } from "@/store/services/permissionService";
import { ColDef } from "ag-grid-community";
import { Layers } from "lucide-react";
import { useMemo } from "react";

export default function ModulesPage() {
  const { data: modules, isLoading } = useGetModulesQuery();

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "name", headerName: "Module Name", filter: true, minWidth: 200 },
    { field: "description", headerName: "Description", filter: true, minWidth: 300 },
    { field: "isActive", headerName: "Status", width: 120, cellRenderer: (p: any) => p.value ? "Active" : "Inactive" },
    { field: "createdAt", headerName: "Created At", valueFormatter: (p: any) => new Date(p.value).toLocaleDateString() },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gradient">System Modules</h2>
          <p className="text-muted-foreground mt-1">Core system components and features.</p>
        </div>
      </div>
      <AGGridTable rowData={modules?.data || []} columnDefs={columnDefs} isLoading={isLoading} />
    </div>
  );
}
