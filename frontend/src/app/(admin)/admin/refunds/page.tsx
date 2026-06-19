"use client"

import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatCurrency, formatDateTime, shortenOrderId } from "@/lib/admin";
import { useAdminRefunds } from "@/hooks/useAdminRefunds";
import type { Refund } from "@/server/modules/refunds/types";
import { Loader2 } from "lucide-react";

export default function RefundsPage() {
  const { refunds, loading } = useAdminRefunds({ initialLimit: 100 });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <AdminTablePage<Refund>
      title="Refunds"
      description="Kelola permintaan refund berdasarkan order yang berstatus returned atau refunded."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Refunds" },
      ]}
      data={refunds}
      getRowKey={(refund) => refund.id}
      searchPlaceholder="Search by refund ID, order ID, or customer..."
      searchBy={(refund) => `${refund.refund_number || ''} ${refund.order_id || ''} ${refund.customer_name || ''}`}
      filters={[
        {
          label: "Refund Status",
          value: "status",
          options: [
            { label: "All Refund Status", value: "all" },
            { label: "Pending Confirmation", value: "pending_confirmation" },
            { label: "Processing", value: "processing" },
            { label: "Completed", value: "completed" },
            { label: "Rejected", value: "rejected" },
          ],
          getValue: (refund) => refund.refund_status,
        },
      ]}
      metrics={[
        {
          label: "Open Requests",
          value: String(
            refunds.filter((refund) => refund.refund_status !== "completed" && refund.refund_status !== "rejected").length
          ),
          description: "Jumlah refund yang masih memerlukan keputusan atau proses.",
        },
        {
          label: "Refund Value",
          value: formatCurrency(
            refunds.reduce((total, refund) => total + refund.refund_amount, 0)
          ),
          description: "Nominal refund dari seluruh data request saat ini.",
        },
      ]}
      columns={[
        {
          header: "Refund No",
          cell: (refund) => <span className="font-medium">{refund.refund_number}</span>,
        },
        {
          header: "Order ID",
          cell: (refund) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(refund.order_id)}</p>
              <p className="text-xs text-muted-foreground">{refund.order_id}</p>
            </div>
          ),
        },
        {
          header: "Customer",
          cell: (refund) => refund.customer_name || "-",
        },
        {
          header: "Total Refund",
          cell: (refund) => formatCurrency(refund.refund_amount),
        },
        {
          header: "Status",
          cell: (refund) => <AdminStatusBadge status={refund.refund_status} />,
        },
        {
          header: "Requested At",
          cell: (refund) => formatDateTime(refund.created_at),
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (refund) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "View Request", href: `/admin/refunds/${refund.id}` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No refund requests match the selected filters."
    />
  );
}
