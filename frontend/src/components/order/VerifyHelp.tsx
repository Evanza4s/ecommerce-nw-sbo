import { Info } from "lucide-react";
import React from "react";

const VerifyHelp = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-blue-100 flex gap-3">
      <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
      <div>
        <h4 className="font-bold text-blue-900 text-sm mb-1">
          Mengapa perlu verifikasi?
        </h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          Verifikasi membantu kami memastikan pesanan tiba dengan aman dan
          memungkinkan Anda untuk memberikan ulasan produk.
        </p>
      </div>
    </div>
  );
};

export default VerifyHelp;
