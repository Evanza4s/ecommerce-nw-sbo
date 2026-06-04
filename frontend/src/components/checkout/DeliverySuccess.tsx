import { Check } from "lucide-react";
import React from "react";

const DeliverySuccess = () => {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-center gap-4">
        <div
          className="
            flex h-14 w-14 items-center
            justify-center rounded-full
            bg-green-500 text-2xl text-white
          "
        >
          <Check />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-700">
            Order Successfully Delivered
          </h2>

          <p className="text-sm text-green-600">
            Thank you for shopping with NWV.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliverySuccess;
