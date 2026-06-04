import { OrderStatusProps } from "@/types";
import {
  CheckCircle2,
  Clock,
  Package,
  RefreshCcw,
  Truck,
  XCircle,
} from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "Pending"
  | "Paid"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refund";

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  Pending: {
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    icon: Clock,
  },
  Paid: {
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    icon: CheckCircle2,
  },
  Shipped: {
    color:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
    icon: Truck,
  },
  Delivered: {
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    icon: CheckCircle2,
  },
  Cancelled: {
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    icon: XCircle,
  },
  Refund: {
    color:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
    icon: RefreshCcw,
  },
};

const OrderBadge = ({ status, className }: OrderStatusProps) => {
  const config = statusConfig[status] || {
    color: "bg-slate-100 text-slate-800",
    icon: Package,
  };
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn("px-3 py-1 font-semibold gap-1.5", config.color, className)}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

export default OrderBadge;
