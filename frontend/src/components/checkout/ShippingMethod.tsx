import React from "react";

const ShippingMethod = () => {
  return (
    <div className="py-3">
      <h3 className="mb-4 text-xl font-bold">Shipping Method</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="cursor-pointer rounded-xl border p-4">
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <input type="radio" name="shipping" defaultChecked />
              <h4 className="font-semibold">JNE REG</h4>
            </div>
            <p className="text-sm">Estimasi 2-3 Days</p>
            <p className="font-bold">Rp 15.000</p>
          </div>
        </label>

        <label className="cursor-pointer rounded-xl border p-4">
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <input type="radio" name="shipping" />
              <h4 className="font-semibold">JNE REG</h4>
            </div>
            <p className="text-sm">Estimasi 2-3 Days</p>
            <p className="font-bold">Rp 15.000</p>
          </div>
        </label>

        <label className="cursor-pointer rounded-xl border p-4">
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <input type="radio" name="shipping" />
              <h4 className="font-semibold">JNE REG</h4>
            </div>
            <p className="text-sm">Estimasi 2-3 Days</p>
            <p className="font-bold">Rp 15.000</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ShippingMethod;
