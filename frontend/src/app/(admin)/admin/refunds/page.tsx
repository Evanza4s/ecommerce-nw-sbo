"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminRefunds } from "@/data/admin-dashboard";
import { formatCurrency, formatDateTime, shortenOrderId } from "@/lib/admin";

export default function RefundsPage() {
  return (
    <AdminTablePage
      title="Refunds"
      description="Kelola permintaan refund berdasarkan order yang berstatus returned atau refunded."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Refunds" },
      ]}
      data={adminRefunds}
      getRowKey={(refund) => refund.id}
      searchPlaceholder="Search by refund ID, order ID, or customer..."
      searchBy={(refund) => `${refund.id} ${refund.orderId} ${refund.customerName}`}
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
          getValue: (refund) => refund.status,
        },
      ]}
      metrics={[
        {
          label: "Open Requests",
          value: String(
            adminRefunds.filter((refund) => refund.status !== "completed").length
          ),
          description: "Jumlah refund yang masih memerlukan keputusan atau proses.",
        },
        {
          label: "Refund Value",
          value: formatCurrency(
            adminRefunds.reduce((total, refund) => total + refund.totalRefund, 0)
          ),
          description: "Nominal refund dari seluruh data request saat ini.",
        },
      ]}
      columns={[
        {
          header: "Order ID",
          cell: (refund) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(refund.orderId)}</p>
              <p className="text-xs text-muted-foreground">{refund.orderId}</p>
            </div>
          ),
        },
        {
          header: "Customer",
          cell: (refund) => refund.customerName,
        },
        {
          header: "Total Refund",
          cell: (refund) => formatCurrency(refund.totalRefund),
        },
        {
          header: "Status",
          cell: (refund) => <AdminStatusBadge status={refund.status} />,
        },
        {
          header: "Requested At",
          cell: (refund) => formatDateTime(refund.requestedAt),
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (refund) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "View", href: `/admin/refunds/${refund.id}` },
                  { label: "Approve", href: `/admin/refunds/${refund.id}` },
                  { label: "Reject", href: `/admin/refunds/${refund.id}` },
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
