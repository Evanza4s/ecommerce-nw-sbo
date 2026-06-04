"use client"

import ProductOrderItem from "@/components/product/ProductOrderItem";
import { checkoutItems } from "@/data/cartData";

const CheckoutItem = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 text-xl font-bold">Review Item</h3>

      {checkoutItems.map((item) => (
        <ProductOrderItem
          key={item.id}
          imageSrc={item.image}
          title={item.title}
          variant={item.variant}
          qty={1}
          price={item.displayPrice ?? `Rp ${item.price}`}
          totalPrice={item.displayPrice ?? `Rp ${item.price}`}
        />
      ))}
    </div>
  );
};

export default CheckoutItem;
