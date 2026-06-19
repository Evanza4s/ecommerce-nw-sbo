"use client"

import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatDateTime, shortenOrderId } from "@/lib/admin";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import type { Payment } from "@/server/modules/payments/types";
import { Loader2 } from "lucide-react";

export default function PaymentsPage() {
  const { payments, loading } = useAdminPayments({ initialLimit: 100 });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <AdminTablePage<Payment>
      title="Payments"
      description="Rekam jejak transaksi pembayaran dari seluruh order pelanggan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Payments" },
      ]}
      data={payments}
      getRowKey={(payment) => payment.id}
      searchPlaceholder="Search by ref number or order ID..."
      searchBy={(payment) =>
        `${payment.payment_reference || ''} ${payment.order_id || ''}`
      }
      filters={[
        {
          label: "Payment Status",
          value: "payment_status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Pending", value: "Pending" },
            { label: "Success", value: "Success" },
            { label: "Challenge", value: "Challenge" },
            { label: "Failed", value: "Failed" },
          ],
          getValue: (payment) => payment.payment_status,
        },
      ]}
      columns={[
        { header: "Ref Number", cell: (payment) => payment.payment_reference || "-" },
        {
          header: "Order ID",
          cell: (payment) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(payment.order_id)}</p>
              <p className="text-xs text-muted-foreground">{payment.order_id}</p>
            </div>
          ),
        },
        { header: "Provider", cell: (payment) => payment.ProviderRef?.provider_name || "-" },
        { header: "Method", cell: (payment) => payment.MethodRef?.method_name || "-" },
        {
          header: "Status",
          cell: (payment) => <AdminStatusBadge status={payment.payment_status.toLowerCase()} />,
        },
        { header: "Amount", cell: (payment) => `Rp ${payment.amount.toLocaleString('id-ID')}` },
        { header: "Paid At", cell: (payment) => payment.paid_at ? formatDateTime(payment.paid_at) : "-" },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (payment) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[{ label: "View Order", href: `/admin/orders/${payment.order_id}` }]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No payment records found."
    />
  );
}
