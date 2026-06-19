import React from "react";
import type { Order } from "@/server/modules/orders/types";
import { formatCurrency } from "@/lib/admin";
import ProductOrderItem from "@/components/product/ProductOrderItem";
import { PriceSummary } from "@/components/ui/PriceSummary";

interface RefundSummaryProps {
  order: Order;
}

const RefundSummary = ({ order }: RefundSummaryProps) => {
  const firstItem = order.Items?.[0];
  const variant = firstItem?.ProductVariantRef;
  const product = variant?.ProductRef;

  const productName = product?.product_name || "NWV Premium Product";
  const variantText = [
    variant?.color,
    variant?.size
  ].filter(Boolean).join(" • ") || "Default";

  const priceText = firstItem ? formatCurrency(firstItem.price) : "-";
  const imageSrc = variant?.variant_image || product?.thumbnail_url || "https://placehold.co/100x100?text=NWV";

  const rows = [
    { label: "Nomor Order", value: order.order_number },
    { label: "Total Pembayaran", value: formatCurrency(order.grand_total) }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4 text-xl font-bold">Produk yang Diajukan</h3>
        <ProductOrderItem 
          imageSrc={imageSrc}
          title={productName}
          variant={variantText}
          qty={firstItem?.quantity || 1}
          price={priceText}
          totalPrice={firstItem ? formatCurrency(firstItem.subtotal) : "-"}
        />
      </div>

      <PriceSummary 
        title="Rincian Refund" 
        rows={rows} 
        total={formatCurrency(order.grand_total)}
        className="shadow-sm border border-slate-200"
      />
    </div>
  );
};

export default RefundSummary;
