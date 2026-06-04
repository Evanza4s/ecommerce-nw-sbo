import React from "react";
import { Button } from "../ui/button";

const OrderAction = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Actions</h2>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full text-dark hover:border-dark"
        >
          Write Review
        </Button>

        <Button variant="secondary" className="w-full">
          Buy Again
        </Button>

        <Button variant="ghost" className="w-full">
          Download Invoice
        </Button>
      </div>
    </div>
  );
};

export default OrderAction;
