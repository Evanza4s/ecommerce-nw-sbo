import React from "react";
import ProductOrderItem from "@/components/product/ProductOrderItem";
import { formatCurrency } from "@/lib/admin";
import type { Order } from "@/server/modules/orders/types";

interface OrderItemsProps {
  order: Order;
}

const OrderItems = ({ order }: OrderItemsProps) => {
  return (
    <section aria-labelledby="order-details-heading" className="rounded-2xl bg-white p-5 shadow-md">
      <h2 id="order-details-heading" className="mb-4 text-xl font-bold">
        Detail Order
      </h2>

      <div className="grid gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-dark/70 md:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-dark">Order ID / Nomor</p>
            <p className="font-mono text-xs">{order.order_number}</p>
          </div>
          <div>
            <p className="font-semibold text-dark">Status Pemesanan</p>
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {order.order_status}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <div>
            <p className="font-semibold text-dark">Pembayaran</p>
            <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              order.payment_status === "Paid" || order.payment_status === "Success"
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}>
              {order.payment_status}
            </p>
          </div>
          <div>
            <p className="font-semibold text-dark">Total Pembayaran</p>
            <p className="font-bold text-dark">{formatCurrency(order.grand_total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {(order.Items || []).map((item) => {
          const variant = item.ProductVariantRef;
          const product = variant?.ProductRef;

          const variantName = [
            variant?.color,
            variant?.size
          ].filter(Boolean).join(", ") || "Default";

          const productName = product?.product_name || "NWV Premium Product";
          const imageSrc = variant?.variant_image || product?.thumbnail_url || "https://placehold.co/100x100?text=NWV";

          return (
            <ProductOrderItem
              key={item.id}
              imageSrc={imageSrc}
              title={productName}
              variant={variantName}
              qty={item.quantity}
              price={formatCurrency(item.price)}
              totalPrice={formatCurrency(item.subtotal)}
              className="border-none"
            />
          );
        })}
      </div>
    </section>
  );
};

export default OrderItems;
