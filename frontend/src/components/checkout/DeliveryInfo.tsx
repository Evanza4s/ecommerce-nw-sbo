import React from "react";

const DeliveryInfo = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Delivery Information</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Received By</span>
          <span>Evanza</span>
        </div>

        <div className="flex justify-between">
          <span>Date</span>
          <span>18 Aug 2026</span>
        </div>

        <div className="flex justify-between">
          <span>Time</span>
          <span>14:20 WIB</span>
        </div>

        <div className="flex justify-between">
          <span>Courier</span>
          <span>JNE REG</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
