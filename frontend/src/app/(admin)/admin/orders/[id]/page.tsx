import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminOrders } from "@/data/admin-dashboard";
import { formatCurrency, formatDateTime } from "@/lib/admin";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = adminOrders.find((item) => item.id === id);

  if (!order) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Order Detail"
      description="Ringkasan order untuk membantu tim admin memverifikasi dan menindaklanjuti pesanan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.id },
      ]}
      summaryTitle={order.id}
      summaryDescription={`${order.customerName} placed this order on ${formatDateTime(order.createdAt)}.`}
      secondaryAction={{ label: "Back to Orders", href: "/admin/orders" }}
      primaryAction={{
        label: "Update Status",
        href: `/admin/orders/${order.id}/status`,
      }}
      items={[
        { label: "Customer", value: order.customerName },
        { label: "Created At", value: formatDateTime(order.createdAt) },
        { label: "Total Amount", value: formatCurrency(order.totalAmount) },
        {
          label: "Payment Status",
          value: <AdminStatusBadge status={order.paymentStatus} />,
        },
        {
          label: "Order Status",
          value: <AdminStatusBadge status={order.orderStatus} />,
        },
        {
          label: "Operational Note",
          value:
            "Sambungkan halaman ini ke mstorders, mstusers, dan mstuser_identity untuk detail item, alamat, dan histori pembayaran.",
        },
      ]}
    />
  );
}
