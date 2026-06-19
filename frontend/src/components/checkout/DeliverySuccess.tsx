import { Check, Truck, Clock } from "lucide-react";
import React from "react";

interface DeliverySuccessProps {
  orderStatus: string;
}

const DeliverySuccess = ({ orderStatus }: DeliverySuccessProps) => {
  if (orderStatus === "Delivered") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
            <Check size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">
              Order Successfully Delivered
            </h2>
            <p className="text-sm text-green-600">
              Terima kasih telah berbelanja bersama NWV.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (orderStatus === "Shipped") {
    return (
      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-800">
              Pesanan Sedang Dikirim
            </h2>
            <p className="text-sm text-purple-600">
              Kurir sedang mengantar paket Anda. Silakan verifikasi jika paket sudah sampai.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shrink-0">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-800">
            Pesanan Sedang Diproses
          </h2>
          <p className="text-sm text-blue-600">
            Penjual sedang menyiapkan barang atau menunggu konfirmasi kurir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliverySuccess;
