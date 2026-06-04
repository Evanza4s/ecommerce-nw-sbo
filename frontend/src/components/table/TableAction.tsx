import React from "react";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Archive, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TableActionProps {
  itemId: string;
  viewUrl?: string; 
  editUrl?: string;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TableAction = ({ itemId, viewUrl, editUrl, onArchive, onDelete }: TableActionProps) => {
  const hasTopItems = viewUrl || editUrl || onArchive;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
          <MoreHorizontal size={18} />
          <span className="sr-only">Open menu</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">

        {viewUrl && (
          <DropdownMenuItem asChild>
            <Link href={viewUrl} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4 text-slate-500" />
              View
            </Link>
          </DropdownMenuItem>
        )}

        {editUrl && (
          <DropdownMenuItem asChild>
            <Link href={editUrl} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}

        {onArchive && (
          <DropdownMenuItem onClick={() => onArchive(itemId)} className="cursor-pointer">
            <Archive className="mr-2 h-4 w-4 text-slate-500" />
            Archive
          </DropdownMenuItem>
        )}

        {hasTopItems && onDelete && <DropdownMenuSeparator />}


        {onDelete && (
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            onClick={() => onDelete(itemId)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableAction;