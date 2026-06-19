"use client"

import ProductOrderItem from "@/components/product/ProductOrderItem";
import type { CartItem } from "@/server/modules/carts/types";
import { formatCurrency } from "@/lib/admin";

interface CheckoutItemProps {
  items: CartItem[];
}

const CheckoutItem = ({ items }: CheckoutItemProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="mb-4 text-xl font-bold">Review Item</h3>
        <p className="text-sm text-slate-500">Keranjang Anda kosong.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 text-xl font-bold">Review Item</h3>

      {items.map((item) => {
        const title = item.product_name || "Unknown Product";
        const variantLabel = `${item.color || ''} ${item.size || ''}`.trim() || "Unknown Variant";
        const imageUrl = item.variant_image || "https://placehold.co/100x100";

        const finalPrice = item.discount_price > 0 ? item.discount_price : item.price;

        return (
          <ProductOrderItem
            key={item.id}
            imageSrc={imageUrl}
            title={title}
            variant={variantLabel}
            qty={item.quantity}
            price={formatCurrency(finalPrice)}
            totalPrice={formatCurrency(item.subtotal || (finalPrice * item.quantity))}
          />
        );
      })}
    </div>
  );
};

export default CheckoutItem;
