import React from "react";
import { Check } from "lucide-react";

const steps = ["Request", "Review", "Approval", "Completed"];

type RefundRequestProps = {
  currentStep?: number;
};

const RefundRequest = ({ currentStep = 1 }: RefundRequestProps) => {
  return (
    <section
      aria-labelledby="refund-status-heading"
      className="rounded-2xl bg-white p-10 md:px-10 shadow-sm border border-gray-100 font-sans"
    >
      <h2 id="refund-status-heading" className="text-lg font-bold text-gray-900 mb-3">
        Status Pengajuan Refund
      </h2>

      <div className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none mb-2">
              <div className="flex flex-col items-center relative">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white shadow-md"
                      : isActive
                      ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50 font-bold"
                      : "bg-white border-gray-200 text-gray-400 font-medium"
                  }`}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : index + 1}
                </div>

                <span
                  className={`absolute top-12 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isCompleted || isActive
                      ? "font-bold text-gray-900"
                      : "font-medium text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 md:mx-4 transition-all duration-300 ${
                    isCompleted ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RefundRequest;
