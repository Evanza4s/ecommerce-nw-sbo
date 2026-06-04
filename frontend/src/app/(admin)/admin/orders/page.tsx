"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminOrders } from "@/data/admin-dashboard";
import { formatCurrency, formatDateTime, shortenOrderId } from "@/lib/admin";

const paymentStatusOptions = [
  { label: "All Payments", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
];

const orderStatusOptions = [
  { label: "All Order Status", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Canceled", value: "canceled" },
];

export default function OrdersPage() {
  return (
    <AdminTablePage
      title="Orders"
      description="Monitor pesanan masuk, pembayaran, dan status fulfilment pelanggan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Orders" },
      ]}
      data={adminOrders}
      getRowKey={(order) => order.id}
      searchPlaceholder="Search by order ID or customer name..."
      searchBy={(order) => `${order.id} ${order.customerName}`}
      filters={[
        {
          label: "Payment Status",
          value: "paymentStatus",
          options: paymentStatusOptions,
          getValue: (order) => order.paymentStatus,
        },
        {
          label: "Order Status",
          value: "orderStatus",
          options: orderStatusOptions,
          getValue: (order) => order.orderStatus,
        },
      ]}
      metrics={[
        {
          label: "Incoming Orders",
          value: String(adminOrders.length),
          description: "Total pesanan yang sedang ditangani tim operasional.",
        },
        {
          label: "Paid Orders",
          value: String(adminOrders.filter((order) => order.paymentStatus === "paid").length),
          description: "Pesanan dengan pembayaran yang sudah terverifikasi.",
        },
        {
          label: "Need Attention",
          value: String(
            adminOrders.filter(
              (order) =>
                order.paymentStatus === "failed" || order.orderStatus === "canceled"
            ).length
          ),
          description: "Pesanan gagal bayar atau dibatalkan yang perlu tindak lanjut.",
        },
        {
          label: "Gross Sales",
          value: formatCurrency(
            adminOrders.reduce((total, order) => total + order.totalAmount, 0)
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
              <p className="text-xs text-muted-foreground">{order.id}</p>
            </div>
          ),
        },
        {
          header: "Customer",
          cell: (order) => order.customerName,
        },
        {
          header: "Date",
          cell: (order) => formatDateTime(order.createdAt),
        },
        {
          header: "Total Amount",
          cell: (order) => formatCurrency(order.totalAmount),
        },
        {
          header: "Payment Status",
          cell: (order) => <AdminStatusBadge status={order.paymentStatus} />,
        },
        {
          header: "Order Status",
          cell: (order) => <AdminStatusBadge status={order.orderStatus} />,
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (order) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "View Detail", href: `/admin/orders/${order.id}` },
                  {
                    label: "Update Status",
                    href: `/admin/orders/${order.id}/status`,
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No orders found for the current filters."
    />
  );
}
