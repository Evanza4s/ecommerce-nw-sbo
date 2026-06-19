import React from "react";
import type { UserAddress } from "@/server/modules/users/types";

interface ShippingOrderProps {
  address?: UserAddress;
}

const ShippingOrder = ({ address }: ShippingOrderProps) => {
  if (!address) {
    return (
      <section
        aria-labelledby="shipping-address-heading"
        className="rounded-2xl bg-white p-5 shadow-md border"
      >
        <h2 id="shipping-address-heading" className="mb-4 text-xl font-bold">
          Shipping Address
        </h2>
        <div className="text-sm text-slate-500">Alamat tidak ditemukan.</div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="shipping-address-heading"
      className="rounded-2xl bg-white p-5 shadow-md border"
    >
      <h2 id="shipping-address-heading" className="mb-4 text-xl font-bold">
        Shipping Address
      </h2>

      <div className="rounded-xl border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="font-semibold mb-1 text-lg">{address.address_label || "Alamat Pengiriman"}</h3>
          <p className="text-sm text-dark/60">Alamat pengiriman pesanan Anda</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold">{address.receiver_name}</p>
          <p className="text-dark/70">{address.phone_number}</p>
          <p className="mt-2 text-dark/70">
            {address.full_address}, {address.district}, {address.city}, {address.province} {address.postal_code}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShippingOrder;
