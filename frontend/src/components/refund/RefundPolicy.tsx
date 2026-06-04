import React from "react";

const RefundPolicy = () => {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
      <h3 className="font-bold">Refund Policy</h3>

      <ul className="mt-3 space-y-2 text-sm">
        <li>✓ Refund request within 7 days.</li>

        <li>✓ Product must not be used.</li>

        <li>✓ Original label required.</li>

        <li>✓ Evidence photo/video required.</li>
      </ul>
    </div>
  );
};

export default RefundPolicy;
