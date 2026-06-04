import React from "react";
import OrderAction from "./OrderAction";
import VerifyHelp from "./VerifyHelp";
import { OrderSummaryProps } from "@/types";

const OrderSummary = ({ showAction = true, showHelp = true }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Ringkasan Harga */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 text-lg mb-4">
          Ringkasan Pesanan
        </h3>

        <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal (1 Item)</span>
            <span className="font-medium text-gray-900">Rp 100.000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ongkos Kirim</span>
            <span className="font-medium text-gray-900">Rp 15.000</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-gray-900">Total Pembayaran</span>
          <span className="font-black text-xl text-gray-900">Rp 115.000</span>
        </div>

        {/* Status Pills */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
            <span className="text-gray-600">Status Pengiriman</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded-md text-xs">
              Terkirim
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
            <span className="text-gray-600">Status Pembayaran</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded-md text-xs">
              Lunas
            </span>
          </div>
        </div>
      </div>

      {showAction && <OrderAction />}

      {showHelp && <VerifyHelp />}
    </div>
  );
};

export default OrderSummary;
