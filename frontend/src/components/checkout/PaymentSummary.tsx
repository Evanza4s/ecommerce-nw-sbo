import React from "react";
import { Button } from "@/components/ui/button";
import PaymentMethod from "./PaymentMethod";
import { PriceSummary } from "@/components/ui/PriceSummary";

const PaymentSummary = () => {
  const rows = [
    { label: "Subtotal", value: "Rp 300.000" },
    { label: "Shipping", value: "Rp 15.000" },
    { label: "Discount", value: "Rp 20.000", isNegative: true },
  ];

  return (
    <PriceSummary title="Payment Summary" rows={rows} total="Rp 295.000">
      <PaymentMethod />
      <div className="mt-4 rounded-xl bg-green-200 p-3 text-sm text-green-700">
        🔒 Secure Checkout
      </div>
      <Button className="mt-6 w-full">Pay Now</Button>
    </PriceSummary>
  );
};

export default PaymentSummary;
