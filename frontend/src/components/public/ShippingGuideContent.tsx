import { Package } from 'lucide-react';
import React from 'react'

export const Guide = [
  {
    id: 1,
    icon: Package,
    title: "Pilih Produk",
    description: "Pilih produk yang ingin Anda beli dari katalog kami.",
  },
  {
    id: 2,
    icon: Package,
    title: "Masukkan Alamat Pengiriman",
    description: "Masukkan alamat lengkap tempat Anda ingin barang dikirim.",
  },
  {
    id: 3,
    icon: Package,
    title: "Terima Barang",
    description: "Terima barang dan pastikan semua item sesuai dengan pesanan.",
  },
];

const ShippingGuideContent = () => {
  return (
    <div className="flex flex-col gap-4">
      {Guide.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{item.title}</h4>
            <p className="text-sm text-slate-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShippingGuideContent