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
    icon: ShoppingBag,
    title: "Pilih Produk",
    description: "Pilih produk yang ingin Anda beli dari katalog kami.",
  },
  {
    id: 2,
    icon: MapPin,
    title: "Masukkan Alamat Pengiriman",
    description: "Masukkan alamat lengkap tempat Anda ingin barang dikirim.",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Pilih Metode Pembayaran",
    description: "Pilih metode pembayaran yang paling nyaman bagi Anda.",
  },
  {
    id: 4,
    icon: ClipboardCheck,
    title: "Konfirmasi Pesanan",
    description: "Periksa kembali detail pesanan dan konfirmasi pembelian.",
  },
  {
    id: 5,
    icon: Truck,
    title: "Pesanan Dikirim",
    description:
      "Kami akan mengirimkan pesanan Anda sesuai dengan alamat yang telah dimasukkan.",
  },
  {
    id: 6,
    icon: PackageCheck,
    title: "Terima Barang",
    description: "Terima barang dan pastikan semua item sesuai dengan pesanan.",
  },
];

const PurchaseGuideContent = () => {
  return (
    <div className="grid gap-3 grid-cols-1 w-full">
      {Guide.map((item) => (
        <div key={item.id} className="group flex flex-row items-center gap-4 p-4 border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 text-left">
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
  );
};

export default PurchaseGuideContent;
