import React from "react";

const PaymentMethod = () => {
  return (
    <div className="mt-6">
      <h4 className="mb-3 font-semibold">Payment Method</h4>

      <div className="space-y-2">
        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input type="radio" name="payment" defaultChecked />
          BCA Virtual Account
        </label>

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input type="radio" name="payment" />
          Mandiri Virtual Account
        </label>

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input type="radio" name="payment" />
          QRIS
        </label>

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input type="radio" name="payment" />
          ShopeePay
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
