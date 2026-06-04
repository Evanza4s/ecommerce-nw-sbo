import React from "react";
import RefundEvidanceUpload from "./RefundEvidanceUpload";
import RefundBankInfo from "./RefundBankInfo";
import { Button } from "@/components/ui/button";

const FormRefund = () => {
  return (
    <form className="rounded-2xl bg-white p-6 shadow-md" aria-labelledby="refund-form-heading">
      <h2 id="refund-form-heading" className="mb-6 text-xl font-bold">
        Refund Information
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Full Name</span>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Order Number</span>
          <input
            name="orderNumber"
            type="text"
            placeholder="Order Number"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Refund Reason</span>
          <select
            name="refundReason"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Refund Reason</option>
            <option value="damaged">Damaged Product</option>
            <option value="wrong-product">Wrong Product</option>
            <option value="missing-item">Missing Item</option>
            <option value="wrong-size">Wrong Size</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Product Name</span>
          <input
            name="productName"
            type="text"
            placeholder="Product Name"
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col text-sm text-dark/70">
        <span className="mb-2 font-medium">Description</span>
        <textarea
          name="description"
          rows={5}
          placeholder="Describe your issue..."
          className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <RefundEvidanceUpload />

      <RefundBankInfo />

      <div className="mt-8 flex flex-col gap-3">
        <Button className="w-full" type="submit">
          Submit Refund Request
        </Button>

        <Button variant="outline" className="w-full" type="button">
          Contact Seller
        </Button>
      </div>
    </form>
  );
};

export default FormRefund;
