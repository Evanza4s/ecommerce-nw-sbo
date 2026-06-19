import React from "react";
import OrderAction from "./OrderAction";
import VerifyHelp from "./VerifyHelp";
import { formatCurrency } from "@/lib/admin";
import type { Order } from "@/server/modules/orders/types";
import { PriceSummary } from "@/components/ui/PriceSummary";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

interface OrderSummaryComponentProps {
  order: Order;
  showAction?: boolean;
  showHelp?: boolean;
}

const OrderSummary = ({ order, showAction = true, showHelp = true }: OrderSummaryComponentProps) => {
  const itemsCount = (order.Items || []).reduce((sum, item) => sum + item.quantity, 0);

  const rows = [
    { label: `Subtotal (${itemsCount} Item)`, value: formatCurrency(order.subtotal_amount) },
    { label: "Ongkos Kirim", value: formatCurrency(order.shipping_cost) },
    ...(order.tax_amount > 0 ? [{ label: "Pajak", value: formatCurrency(order.tax_amount) }] : []),
    ...(order.discount_amount > 0 ? [{ label: "Diskon", value: formatCurrency(order.discount_amount), isNegative: true }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <PriceSummary 
        title="Ringkasan Pesanan" 
        rows={rows} 
        total={formatCurrency(order.grand_total)}
        className="shadow-sm border border-gray-200"
      >
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
            <span className="text-slate-600 font-medium">Status Pengiriman</span>
            <AdminStatusBadge status={order.order_status?.toLowerCase() || "pending"} />
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
            <span className="text-slate-600 font-medium">Status Pembayaran</span>
            <AdminStatusBadge status={order.payment_status?.toLowerCase() || "pending"} />
          </div>
        </div>
      </PriceSummary>

      {showAction && <OrderAction />}
      {showHelp && <VerifyHelp />}
    </div>
  );
};

export default OrderSummary;
