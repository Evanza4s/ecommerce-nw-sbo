import React from "react";

const ShippingOrder = () => {
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
          <h3 className="font-semibold mb-1 text-lg">Rumah (Utama)</h3>
          <p className="text-sm text-dark/60">Primary delivery address</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold">Evanza Agusta Setiawan</p>
          <p className="text-dark/70">+62 81234567890</p>
          <p className="mt-2 text-dark/70">
            Jl. Mawar No.12, Jakarta Selatan, DKI Jakarta
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShippingOrder;
