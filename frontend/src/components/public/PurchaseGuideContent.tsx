import React from "react";

import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ClipboardCheck,
  Truck,
  PackageCheck,
} from "lucide-react";

export const Guide = [
  {
    id: 1,
    icon: ShoppingBag, // Ikon tas belanja
    title: "Pilih Produk",
    description: "Pilih produk yang ingin Anda beli dari katalog kami.",
  },
  {
    id: 2,
    icon: MapPin, // Ikon pin lokasi peta
    title: "Masukkan Alamat Pengiriman",
    description: "Masukkan alamat lengkap tempat Anda ingin barang dikirim.",
  },
  {
    id: 3,
    icon: CreditCard, // Ikon kartu kredit/pembayaran
    title: "Pilih Metode Pembayaran",
    description: "Pilih metode pembayaran yang paling nyaman bagi Anda.",
  },
  {
    id: 4,
    icon: ClipboardCheck, // Ikon papan jalan dengan centang
    title: "Konfirmasi Pesanan",
    description: "Periksa kembali detail pesanan dan konfirmasi pembelian.",
  },
  {
    id: 5,
    icon: Truck, // Ikon truk pengiriman
    title: "Pesanan Dikirim",
    description:
      "Kami akan mengirimkan pesanan Anda sesuai dengan alamat yang telah dimasukkan.",
  },
  {
    id: 6,
    icon: PackageCheck, // Ikon paket diterima/selesai
    title: "Terima Barang",
    description: "Terima barang dan pastikan semua item sesuai dengan pesanan.",
  },
];

const PurchaseGuideContent = () => {
  return (
    <div className="flex flex-col gap-4">
      {Guide.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {/* Render Ikon di sini */}
            <item.icon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{item.title}</h4>
            <p className="text-sm text-slate-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseGuideContent;
