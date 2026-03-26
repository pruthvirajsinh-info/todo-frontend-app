"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetActionsQuery } from "@/store/services/permissionService";
import { ColDef } from "ag-grid-community";
import { Terminal } from "lucide-react";
import { useMemo } from "react";

export default function ActionsPage() {
  const { data: actions, isLoading } = useGetActionsQuery();

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "name", headerName: "Action Name", filter: true, minWidth: 200 },
    { field: "description", headerName: "Description", filter: true, minWidth: 300 },
    { field: "createdAt", headerName: "Created At", valueFormatter: (p: any) => new Date(p.value).toLocaleDateString() },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Terminal size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gradient">System Actions</h2>
          <p className="text-muted-foreground mt-1">Granular operations available in the system.</p>
        </div>
      </div>
      <AGGridTable rowData={actions?.data || []} columnDefs={columnDefs} isLoading={isLoading} />
    </div>
  );
}
