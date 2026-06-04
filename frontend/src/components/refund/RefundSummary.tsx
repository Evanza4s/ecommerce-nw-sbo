import React from "react";

const RefundSummary = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

      <div className="mb-4 rounded-xl border p-4">
        <div className="flex gap-3">
          <div className="h-20 w-20 rounded-xl bg-dark/10" />

          <div>
            <h3 className="font-semibold">NWV Essential Hoodie</h3>

            <p className="text-sm text-dark/60">Black • XL</p>

            <p className="mt-2 font-bold text-primary">Rp 300.000</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Order ID</span>
          <span>ABC-123456</span>
        </div>

        <div className="flex justify-between">
          <span>Total Payment</span>
          <span>Rp 300.000</span>
        </div>

        <div className="flex justify-between">
          <span>Refund Amount</span>
          <span className="font-bold text-green-600">Rp 300.000</span>
        </div>
      </div>
    </div>
  );
};

export default RefundSummary;
