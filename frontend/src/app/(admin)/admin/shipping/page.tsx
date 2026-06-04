"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminShipping } from "@/data/admin-dashboard";
import { formatDateTime, shortenOrderId } from "@/lib/admin";

export default function ShippingPage() {
  return (
    <AdminTablePage
      title="Shipping"
      description="Pantau pergerakan pengiriman dan estimasi kedatangan barang."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Shipping" },
      ]}
      data={adminShipping}
      getRowKey={(shipment) => shipment.id}
      searchPlaceholder="Search by tracking number or courier..."
      searchBy={(shipment) =>
        `${shipment.trackingNumber} ${shipment.orderId} ${shipment.courierName}`
      }
      filters={[
        {
          label: "Shipping Status",
          value: "shippingStatus",
          options: [
            { label: "All Status", value: "all" },
            { label: "Ready to Ship", value: "ready_to_ship" },
            { label: "In Transit", value: "in_transit" },
            { label: "Out for Delivery", value: "out_for_delivery" },
            { label: "Delivered", value: "delivered" },
            { label: "Exception", value: "exception" },
          ],
          getValue: (shipment) => shipment.shippingStatus,
        },
      ]}
      columns={[
        { header: "Tracking No", cell: (shipment) => shipment.trackingNumber },
        {
          header: "Order ID",
          cell: (shipment) => (
            <div>
              <p className="font-medium text-foreground">#{shortenOrderId(shipment.orderId)}</p>
              <p className="text-xs text-muted-foreground">{shipment.orderId}</p>
            </div>
          ),
        },
        { header: "Courier", cell: (shipment) => shipment.courierName },
        { header: "Location", cell: (shipment) => shipment.currentLocation },
        {
          header: "Status",
          cell: (shipment) => <AdminStatusBadge status={shipment.shippingStatus} />,
        },
        {
          header: "Est. Arrival",
          cell: (shipment) => formatDateTime(shipment.estimatedArrival),
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (shipment) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  {
                    label: "Update Tracking/Status",
                    href: `/admin/orders/${shipment.orderId}/status`,
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
