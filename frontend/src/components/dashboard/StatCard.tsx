import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatProps {
  title: string;
  value: string;
  bgColor: string;
  icon: LucideIcon;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  bgColor,
  icon: Icon,
  iconColor,
}: StatProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        bgColor,
      )}
    >
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight">{value}</h3>
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm",
            iconColor,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
};

export default StatCard;
