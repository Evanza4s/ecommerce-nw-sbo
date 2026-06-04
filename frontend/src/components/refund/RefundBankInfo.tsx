import React from "react";

const RefundBankInfo = () => {
  return (
    <section className="mt-6">
      <h3 className="mb-3 font-semibold">Refund Account</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Bank Name</span>
          <input
            name="bankName"
            type="text"
            placeholder="Bank Name"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Account Number</span>
          <input
            name="accountNumber"
            type="text"
            placeholder="Account Number"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Account Holder</span>
          <input
            name="accountHolder"
            type="text"
            placeholder="Account Holder"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>
    </section>
  );
};

export default RefundBankInfo;
