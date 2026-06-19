"use client"
import { useState } from "react";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatCurrency, formatDateTime, shortenOrderId } from "@/lib/admin";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { OrderStatusModal } from "@/components/admin/OrderStatusModal";

const paymentStatusOptions = [
  { label: "All Payments", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Failed", value: "Failed" },
];

const orderStatusOptions = [
  { label: "All Order Status", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Canceled", value: "Canceled" },
];

export default function OrdersPage() {
  const { orders, loading, search, statusFilter, setSearch, setStatusFilter, refresh } = useAdminOrders();

  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [updateStatusOrderId, setUpdateStatusOrderId] = useState<string | null>(null);

  return (
    <>
      <AdminTablePage
        title="Orders"
        description="Monitor pesanan masuk, pembayaran, dan status fulfilment pelanggan."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Orders" },
        ]}
        data={orders}
        getRowKey={(order) => order.id}
        searchPlaceholder="Search by order ID or customer name..."
        searchBy={(order) => `${order.order_number} ${order.UserRef?.fullname}`}
        filters={[
          {
            label: "Status",
            value: "orderStatus",
            options: orderStatusOptions,
            getValue: (order) => order.order_status,
          },
        ]}
        metrics={[
          {
            label: "Incoming Orders",
            value: String(orders.length),
            description: "Total pesanan yang sedang ditangani tim operasional.",
          },
          {
            label: "Paid Orders",
            value: String(orders.filter((order) => order.payment_status === "Paid").length),
            description: "Pesanan dengan pembayaran yang sudah terverifikasi.",
          },
          {
            label: "Need Attention",
            value: String(
              orders.filter(
                (order) =>
                  order.payment_status === "Failed" || order.order_status === "Canceled"
              ).length
            ),
            description: "Pesanan gagal bayar atau dibatalkan yang perlu tindak lanjut.",
          },
          {
            label: "Gross Sales",
            value: formatCurrency(
              orders.reduce((total, order) => total + order.grand_total, 0)
            ),
            description: "Akumulasi nilai order dari data dashboard saat ini.",
          },
        ]}
        columns={[
          {
            header: "Order ID",
            cell: (order) => (
              <div>
                <p className="font-medium text-foreground">#{shortenOrderId(order.id)}</p>
                <p className="text-xs text-muted-foreground">{order.order_number}</p>
              </div>
            ),
          },
          {
            header: "Customer",
            cell: (order) => order.UserRef ? order.UserRef.fullname : "Unknown",
          },
          {
            header: "Date",
            cell: (order) => formatDateTime(order.created_at),
          },
          {
            header: "Total Amount",
            cell: (order) => formatCurrency(order.grand_total),
          },
          {
            header: "Payment Status",
            cell: (order) => <AdminStatusBadge status={order.payment_status?.toLowerCase()} />,
          },
          {
            header: "Order Status",
            cell: (order) => <AdminStatusBadge status={order.order_status?.toLowerCase()} />,
          },
          {
            header: "Actions",
            className: "w-20 text-right",
            cell: (order) => (
              <div className="flex justify-end">
                <AdminRowActions
                  actions={[
                    {
                      label: "View Detail",
                      onClick: () => setViewOrderId(order.id)
                    },
                    {
                      label: "Update Status",
                      onClick: () => setUpdateStatusOrderId(order.id)
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        emptyMessage={loading ? "Loading orders..." : "No orders found for the current filters."}
      />

      <OrderDetailModal
        orderId={viewOrderId}
        onClose={() => setViewOrderId(null)}
      />

      <OrderStatusModal
        orderId={updateStatusOrderId}
        onClose={() => setUpdateStatusOrderId(null)}
        onUpdated={() => refresh()}
      />
    </>
  );
}
