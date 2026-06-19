"use client"

import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatDateTime, shortenOrderId } from "@/lib/admin";
import { useAdminShipping } from "@/hooks/useAdminShipping";
import type { Shipping } from "@/server/modules/shipping/types";
import { Loader2 } from "lucide-react";

export default function ShippingPage() {
  const { shippings, loading } = useAdminShipping({ initialLimit: 100 });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <AdminTablePage<Shipping>
      title="Shipping"
      description="Pantau pergerakan pengiriman pesanan pelanggan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Shipping" },
      ]}
      data={shippings}
      getRowKey={(shipment) => shipment.id}
      searchPlaceholder="Search by tracking number or order ID..."
      searchBy={(shipment) =>
        `${shipment.tracking_number || ''} ${shipment.order_id || ''}`
      }
      filters={[
        {
          label: "Shipping Status",
          value: "shipping_status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Pending", value: "Pending" },
            { label: "Ready to Ship", value: "ready_to_ship" },
            { label: "In Transit", value: "in_transit" },
            { label: "Out for Delivery", value: "out_for_delivery" },
            { label: "Delivered", value: "delivered" },
            { label: "Exception", value: "exception" },
          ],
          getValue: (shipment) => shipment.shipping_status,
        },
      ]}
      columns={[
        { header: "Tracking No", cell: (shipment) => shipment.tracking_number || "-" },
        {
          header: "Order ID",
          cell: (shipment) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(shipment.order_id)}</p>
              <p className="text-xs text-muted-foreground">{shipment.order_id}</p>
            </div>
          ),
        },
        { header: "Courier", cell: (shipment) => shipment.courier_name ? shipment.courier_name.toUpperCase() : "-" },
        { header: "Service", cell: (shipment) => shipment.service_name || "-" },
        {
          header: "Status",
          cell: (shipment) => <AdminStatusBadge status={shipment.shipping_status.toLowerCase()} />,
        },
        {
          header: "Est. Arrival",
          cell: (shipment) => shipment.estimated_arrival ? formatDateTime(shipment.estimated_arrival) : "-",
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (shipment) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  {
                    label: "View Order",
                    href: `/admin/orders/${shipment.order_id}`,
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No shipping records found."
    />
  );
}
