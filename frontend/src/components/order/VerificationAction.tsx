"use client"
import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const VerificationAction = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Konfirmasi Penerimaan</h3>
          <p className="text-sm text-gray-500">Pastikan pesanan sesuai sebelum menyelesaikan transaksi.</p>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors mb-6">
        <input 
          type="checkbox" 
          className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          Saya menyetujui bahwa pesanan telah diterima dalam kondisi baik, berfungsi normal, dan tidak ada masalah.
        </span>
      </label>

      <div className="flex flex-col gap-3">
        <button 
          disabled={!isChecked}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            isChecked 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Ya, Pesanan Telah Diterima
        </button>
        
        <button className="w-full py-3 rounded-xl font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
          <AlertTriangle size={18} /> Ajukan Refund / Komplain
        </button>
        <p className="text-center text-xs text-gray-400 mt-1">
          *Sertakan video unboxing untuk pengajuan refund.
        </p>
      </div>
    </div>
  );
};

export default VerificationAction;
