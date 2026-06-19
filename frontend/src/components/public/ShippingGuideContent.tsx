import { Package, Truck, Home } from 'lucide-react';
import React from 'react'

export const Guide = [
  {
    id: 1,
    icon: Package,
    title: "Pesanan Dikemas",
    description: "Pesanan Anda sedang dikemas dengan aman oleh tim kami.",
  },
  {
    id: 2,
    icon: Truck,
    title: "Dalam Perjalanan",
    description: "Pesanan telah diserahkan kepada kurir dan sedang menuju lokasi Anda.",
  },
  {
    id: 3,
    icon: Home,
    title: "Tiba di Tujuan",
    description: "Pesanan telah sampai di alamat pengiriman dan siap diterima.",
  },
];

const ShippingGuideContent = () => {
  return (
    <div className="grid gap-3 grid-cols-1 w-full">
      {Guide.map((item) => (
        <div key={item.id} className="group flex flex-row items-center gap-4 p-4 border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 text-left relative overflow-hidden">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-300">
            <item.icon size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base mb-1">{item.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShippingGuideContent;