import React from "react";
import { Button } from "@/components/ui/button";

const RefundHelp = () => {
  return (
    <div className="rounded-2xl bg-blue-50 p-5">
      <h3 className="font-bold text-primary">Need Help?</h3>

      <p className="mt-2 text-sm text-dark/70">
        Contact our customer support if you need assistance regarding your
        refund.
      </p>

      <Button variant="outline" className="mt-4 w-full">
        Contact Support
      </Button>
    </div>
  );
};

export default RefundHelp;
