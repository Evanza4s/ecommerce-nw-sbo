"use client";

import { useEffect, useState, use } from "react";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    ordersApi.getById(id)
      .then((res) => {
        if (isMounted && res.data) {
          setOrder(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order details", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  const customerName = order.UserRef 
    ? order.UserRef.fullname
    : "Unknown Customer";

  return (
    <AdminDetailPage
      title="Order Detail"
      description="Ringkasan order untuk membantu tim admin memverifikasi dan menindaklanjuti pesanan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.order_number },
      ]}
      summaryTitle={`#${order.order_number}`}
      summaryDescription={`${customerName} placed this order on ${formatDateTime(order.created_at)}.`}
      secondaryAction={{ label: "Back to Orders", href: "/admin/orders" }}
      primaryAction={{
        label: "Update Status",
        href: `/admin/orders/${order.id}/status`,
      }}
      items={[
        { label: "Customer", value: customerName },
        { label: "Created At", value: formatDateTime(order.created_at) },
        { label: "Total Amount", value: formatCurrency(order.grand_total) },
        {
          label: "Payment Status",
          value: <AdminStatusBadge status={order.payment_status?.toLowerCase()} />,
        },
        {
          label: "Order Status",
          value: <AdminStatusBadge status={order.order_status?.toLowerCase()} />,
        },
        {
          label: "Shipping Cost",
          value: formatCurrency(order.shipping_cost),
        },
        {
          label: "Items Count",
          value: `${order.Items?.length || 0} items`,
        },
      ]}
    />
  );
}
