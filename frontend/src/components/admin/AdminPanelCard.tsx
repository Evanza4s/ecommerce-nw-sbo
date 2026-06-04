import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AdminPanelCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

const AdminPanelCard = ({
  children,
  className,
  interactive = false,
}: AdminPanelCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 text-card-foreground shadow-sm",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AdminPanelCard;
