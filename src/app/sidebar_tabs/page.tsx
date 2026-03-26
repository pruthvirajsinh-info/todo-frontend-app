"use client";

import AGGridTable from "@/components/ui/AGGridTable";
import { useGetSidebarTabsQuery } from "@/store/services/metaService";
import { ColDef } from "ag-grid-community";
import { LayoutGrid } from "lucide-react";
import { useMemo } from "react";

export default function SidebarTabsPage() {
  const { data: tabs, isLoading } = useGetSidebarTabsQuery();

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "label", headerName: "Tab Label", filter: true, minWidth: 200 },
    { field: "icon", headerName: "Icon", width: 150 },
    { field: "path", headerName: "Route Path", minWidth: 200 },
    { field: "order", headerName: "Sort Order", width: 120 },
    { 
      headerName: "Module", 
      valueGetter: (p) => p.data.module?.name || "None",
      filter: true 
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <LayoutGrid size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gradient">Sidebar Configuration</h2>
          <p className="text-muted-foreground mt-1">Manage application navigation and visual structure.</p>
        </div>
      </div>
      <AGGridTable rowData={tabs?.data || []} columnDefs={columnDefs} isLoading={isLoading} />
    </div>
  );
}
