import React from "react";

const RefundEvidanceUpload = () => {
  return (
    <div className="mt-6">
      <label htmlFor="refundEvidence" className="mb-3 block font-semibold">
        Upload Evidence
      </label>

      <div className="rounded-xl border-2 border-dashed p-8 text-center">
        <p className="text-dark/60">Upload photos or videos to support your request.</p>

        <input
          id="refundEvidence"
          name="refundEvidence"
          type="file"
          multiple
          className="mt-4 w-full cursor-pointer text-sm text-gray-600"
          aria-describedby="refund-evidence-help"
        />
        <p id="refund-evidence-help" className="mt-3 text-xs text-dark/50">
          You can upload up to 5 files in JPG, PNG, or MP4 format.
        </p>
      </div>
    </div>
  );
};

export default RefundEvidanceUpload;
