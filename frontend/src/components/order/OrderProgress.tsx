import { Check } from 'lucide-react';
import React from 'react';

const steps = [
  'Dibayar',
  'Dibungkus',
  'Dikirim',
  'Dalam Pengantaran',
  'Terkirim',
];

type OrderProgressProps = {
  currentStep?: number;
};

const OrderProgress = ({ currentStep = 2 }: OrderProgressProps) => {
  return (
    <section
      aria-labelledby="order-progress-heading"
      className="mt-8 rounded-2xl bg-white p-10 shadow-sm border border-gray-100"
    >
      <h2 id="order-progress-heading" className="mb-6 text-xl font-semibold text-dark">
        Status Pengiriman
      </h2>

      <div className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCurrent
                      ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50'
                      : 'bg-white border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={5} />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </div>

                <span
                  className={`absolute top-12 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
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

export default OrderProgress;
