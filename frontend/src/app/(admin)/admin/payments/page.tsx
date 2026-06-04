"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminPayments } from "@/data/admin-dashboard";
import { formatDateTime, shortenOrderId } from "@/lib/admin";

export default function PaymentsPage() {
  return (
    <AdminTablePage
      title="Payments"
      description="Rekam jejak transaksi pembayaran dari seluruh order pelanggan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Payments" },
      ]}
      data={adminPayments}
      getRowKey={(payment) => payment.id}
      searchPlaceholder="Search by ref number or order ID..."
      searchBy={(payment) =>
        `${payment.paymentReference} ${payment.orderId} ${payment.paymentProvider}`
      }
      filters={[
        {
          label: "Payment Status",
          value: "paymentStatus",
          options: [
            { label: "All Status", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Failed", value: "failed" },
          ],
          getValue: (payment) => payment.paymentStatus,
        },
      ]}
      columns={[
        { header: "Ref Number", cell: (payment) => payment.paymentReference },
        {
          header: "Order ID",
          cell: (payment) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(payment.orderId)}</p>
              <p className="text-xs text-muted-foreground">{payment.orderId}</p>
            </div>
          ),
        },
        { header: "Method", cell: (payment) => payment.paymentMethod },
        { header: "Provider", cell: (payment) => payment.paymentProvider },
        {
          header: "Status",
          cell: (payment) => <AdminStatusBadge status={payment.paymentStatus} />,
        },
        { header: "Paid At", cell: (payment) => formatDateTime(payment.paidAt) },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (payment) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[{ label: "View Detail", href: `/admin/orders/${payment.orderId}` }]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No payment records found."
    />
  );
}
