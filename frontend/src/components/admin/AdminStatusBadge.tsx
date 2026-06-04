import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const toneClassMap: Record<BadgeTone, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

const toneByStatus: Record<string, BadgeTone> = {
  active: "success",
  approved: "success",
  completed: "success",
  delivered: "success",
  paid: "success",
  processing: "info",
  shipped: "info",
  verified: "success",
  scheduled: "warning",
  pending: "warning",
  pending_confirmation: "warning",
  ready_to_ship: "warning",
  unverified: "warning",
  in_transit: "info",
  out_for_delivery: "info",
  draft: "neutral",
  inactive: "neutral",
  expired: "neutral",
  refunded: "neutral",
  returned: "neutral",
  suspended: "danger",
  canceled: "danger",
  exception: "danger",
  failed: "danger",
  rejected: "danger",
};

interface AdminStatusBadgeProps {
  status: string;
  label?: string;
}

const toLabel = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const AdminStatusBadge = ({ status, label }: AdminStatusBadgeProps) => {
  const tone = toneByStatus[status] ?? "neutral";

  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", toneClassMap[tone])}
    >
      {label ?? toLabel(status)}
    </Badge>
  );
};

export default AdminStatusBadge;
