import React from "react";
import ProductOrderItem from "@/components/product/ProductOrderItem";
import { orderItems } from "@/data/cartData";

const OrderItems = () => {
  return (
    <section aria-labelledby="order-details-heading" className="rounded-2xl bg-white p-5 shadow-md">
      <h2 id="order-details-heading" className="mb-4 text-xl font-bold">
        Detail Order
      </h2>

      <div className="grid gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-dark/70 md:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-dark">Order ID</p>
            <p>Order-ABC-123566-34423</p>
          </div>
          <div>
            <p className="font-semibold text-dark">Status Pemesanan</p>
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              Dalam Pengiriman
            </p>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <div>
            <p className="font-semibold text-dark">Pembayaran</p>
            <p className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              Lunas
            </p>
          </div>
          <div>
            <p className="font-semibold text-dark">Total Pembayaran</p>
            <p>Rp 300.000</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {orderItems.map((item) => (
          <ProductOrderItem
            key={item.id}
            imageSrc={item.image}
            title={item.title}
            variant={item.variant}
            qty={1}
            price={item.displayPrice ?? `Rp ${item.price}`}
            totalPrice={item.displayPrice ?? `Rp ${item.price}`}
            className="border-none"
          />
        ))}
      </div>
    </section>
  );
};

export default OrderItems;
