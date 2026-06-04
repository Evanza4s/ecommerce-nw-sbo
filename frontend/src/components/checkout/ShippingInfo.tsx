import React from "react";

const ShippingInfo = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Shipping Information</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Courier</span>
          <span>JNE</span>
        </div>

        <div className="flex justify-between">
          <span>Service</span>
          <span>JNE REG</span>
        </div>

        <div className="flex justify-between">
          <span>Tracking Number</span>

          <button className="font-medium text-primary">JNEX123456789</button>
        </div>

        <div className="flex justify-between">
          <span>Estimated Delivery</span>
          <span>20 Aug 2026</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
