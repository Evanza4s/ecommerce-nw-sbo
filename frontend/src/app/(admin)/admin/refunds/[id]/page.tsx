import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminRefunds } from "@/data/admin-dashboard";
import { formatCurrency, formatDateTime } from "@/lib/admin";

interface RefundDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RefundDetailPage({ params }: RefundDetailPageProps) {
  const { id } = await params;
  const refund = adminRefunds.find((item) => item.id === id);

  if (!refund) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Refund Detail"
      description="Review permintaan refund dan persiapkan alur approve atau reject."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Refunds", href: "/admin/refunds" },
        { label: refund.id },
      ]}
      summaryTitle={refund.id}
      summaryDescription={`Request from ${refund.customerName} for order ${refund.orderId}.`}
      secondaryAction={{ label: "Back to Refunds", href: "/admin/refunds" }}
      primaryAction={{ label: "Open Order", href: `/admin/orders/${refund.orderId}` }}
      items={[
        { label: "Customer", value: refund.customerName },
        { label: "Order ID", value: refund.orderId },
        { label: "Requested At", value: formatDateTime(refund.requestedAt) },
        { label: "Refund Amount", value: formatCurrency(refund.totalRefund) },
        { label: "Status", value: <AdminStatusBadge status={refund.status} /> },
        {
          label: "Schema Suggestion",
          value:
            "Untuk produksi, sebaiknya simpan data refund terpisah di mstrefund agar evidence, approval notes, dan timeline tidak bercampur dengan mstorders.",
        },
      ]}
    />
  );
}
