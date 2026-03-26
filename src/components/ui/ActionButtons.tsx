"use client";

import { Edit2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

interface ActionButtonsProps {
  editPath?: string;
  viewPath?: string;
  onDelete?: () => void;
}

export default function ActionButtons({ editPath, viewPath, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 h-full">
      {viewPath && (
        <Link 
          href={viewPath}
          className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
      )}
      {editPath && (
        <Link 
          href={editPath}
          className="p-1.5 rounded-lg hover:bg-white/10 text-primary hover:bg-primary/10 transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </Link>
      )}
      {onDelete && (
        <button 
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-white/10 text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
