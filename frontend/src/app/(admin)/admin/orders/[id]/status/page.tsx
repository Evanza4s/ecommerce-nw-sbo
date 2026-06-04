import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminOrders } from "@/data/admin-dashboard";
import { formatDateTime, toSentenceCase } from "@/lib/admin";

interface OrderStatusPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { id } = await params;
  const order = adminOrders.find((item) => item.id === id);

  if (!order) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Update Order Status"
      description="Panduan update status order dan sinkronisasi payment atau shipping milestones."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.id, href: `/admin/orders/${order.id}` },
        { label: "Status" },
      ]}
      summaryTitle="Status Workflow"
      summaryDescription="Halaman ini disiapkan untuk alur update status order, payment, dan shipping dari satu tempat."
      secondaryAction={{
        label: "View Order Detail",
        href: `/admin/orders/${order.id}`,
      }}
      primaryAction={{ label: "Back to Orders", href: "/admin/orders" }}
      items={[
        { label: "Current Payment Status", value: <AdminStatusBadge status={order.paymentStatus} /> },
        { label: "Current Order Status", value: <AdminStatusBadge status={order.orderStatus} /> },
        { label: "Last Updated", value: formatDateTime(order.createdAt) },
        {
          label: "Recommended Next State",
          value:
            order.orderStatus === "processing"
              ? "Move to Shipped once packing is complete and tracking number is created."
              : `Current flow is ${toSentenceCase(order.orderStatus)}.`,
        },
        {
          label: "Integration Notes",
          value:
            "Saat backend siap, hubungkan form ini ke PATCH mstorders, lalu sinkronkan mstpayment dan mstshipping sesuai perubahan status.",
        },
      ]}
    />
  );
}
