import React from "react";
import type { Order } from "@/server/modules/orders/types";
import { formatDate } from "@/lib/admin";

interface DeliveryInfoProps {
  order: Order;
}

const DeliveryInfo = ({ order }: DeliveryInfoProps) => {
  const receiverName = order.AddressRef?.receiver_name || "Pelanggan";
  const dateStr = order.order_status === "Delivered" ? formatDate(order.updated_at) : "-";
  
  const timeStr = order.order_status === "Delivered" 
    ? new Date(order.updated_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
    : "-";

  const courierName = order.Shipping?.shipping_method || "Regular Courier";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md border">
      <h2 className="mb-4 text-xl font-bold">Delivery Information</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-slate-500 font-medium">Received By</span>
          <span className="font-bold text-slate-800">{receiverName}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-slate-500 font-medium">Date</span>
          <span className="font-bold text-slate-800">{dateStr}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-slate-500 font-medium">Time</span>
          <span className="font-bold text-slate-800">{timeStr}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500 font-medium">Courier</span>
          <span className="font-bold text-slate-800 uppercase">{courierName}</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
