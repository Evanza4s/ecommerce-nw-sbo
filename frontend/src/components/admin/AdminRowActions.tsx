import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export interface AdminRowActionItem {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

interface AdminRowActionsProps {
  actions: AdminRowActionItem[];
}

const AdminRowActions = ({ actions }: AdminRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-md">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {actions.map((action) => (
          <DropdownMenuItem 
            key={action.label} 
            asChild={Boolean(action.href)}
            onClick={action.onClick}
            className={action.className}
          >
            {action.href ? (
              <Link href={action.href}>{action.label}</Link>
            ) : (
              <span>{action.label}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminRowActions;
