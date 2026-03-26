"use client";

import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, 
  GridApi, 
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Register all community modules for a robust "out-of-the-box" experience in v35
ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  isLoading?: boolean;
  onGridReady?: (params: GridReadyEvent) => void;
  pagination?: boolean;
  paginationPageSize?: number;
}

export default function AGGridTable({ 
  rowData, 
  columnDefs, 
  isLoading, 
  onGridReady,
  pagination = true,
  paginationPageSize = 10
}: AGGridTableProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  const onGridReadyInternal = (params: GridReadyEvent) => {
    setGridApi(params.api);
    if (onGridReady) onGridReady(params);
  };

  const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    gridApi?.setGridOption("quickFilterText", value);
  };

  const toggleColumn = (colId: string) => {
    if (!gridApi) return;
    const isVisible = gridApi.getColumn(colId)?.isVisible();
    gridApi.setColumnsVisible([colId], !isVisible);
  };

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={onFilterTextChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowColumnPicker(!showColumnPicker)}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Columns
            <ChevronDown size={14} className={cn("transition-transform", showColumnPicker && "rotate-180")} />
          </button>

          {showColumnPicker && (
            <div className="absolute right-0 mt-2 w-48 glass p-2 rounded-2xl shadow-2xl z-50 border border-white/10 min-w-[200px]">
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {columnDefs.filter(c => c.headerName).map((col) => {
                  const id = col.colId || (col.field as string);
                  if (!id) return null;
                  const isVisible = gridApi?.getColumn(id)?.isVisible() ?? true;

                  return (
                    <button
                      key={id}
                      onClick={() => toggleColumn(id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                    >
                      <span className="text-muted-foreground">{col.headerName}</span>
                      {isVisible && <Check size={14} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/10 h-[500px]">
        <div className="ag-theme-alpine-dark w-full h-full"> 
          <AgGridReact
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReadyInternal}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={[10, 20, 50]}
            loading={isLoading}
            animateRows={true}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </div>
  );
}
