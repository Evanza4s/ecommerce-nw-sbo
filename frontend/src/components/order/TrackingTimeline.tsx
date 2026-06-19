import React from "react";
import { Copy, Package, Check, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/admin";
import type { Order } from "@/server/modules/orders/types";
import { toast } from "react-toastify";

interface TrackingTimelineProps {
  order: Order;
}

const ProfessionalTracking = ({ order }: TrackingTimelineProps) => {
  const orderStatus = order.order_status;
  const isDelivered = orderStatus === "Delivered";
  const isShipped = orderStatus === "Shipped";
  const isProcessing = orderStatus === "Processing";
  const isPending = orderStatus === "Pending";

  const timelineData = [
    {
      status: isDelivered ? "completed" : "pending",
      title: "Pesanan Diterima",
      description: "Pesanan telah sukses diterima oleh pelanggan.",
      date: isDelivered ? formatDate(order.updated_at) : "-",
      time: "-",
    },
    {
      status: isDelivered ? "completed" : isShipped ? "active" : "pending",
      title: "Dalam Pengiriman",
      description: order.Shipping?.tracking_number 
        ? `Pesanan sedang dikirim oleh kurir dengan nomor resi ${order.Shipping.tracking_number}.`
        : "Pesanan telah diserahkan kepada kurir dan sedang dalam perjalanan.",
      date: (isDelivered || isShipped) ? formatDate(order.updated_at) : "-",
      time: "-",
    },
    {
      status: (isDelivered || isShipped) ? "completed" : isProcessing ? "active" : "pending",
      title: "Pesanan Diproses",
      description: "Penjual sedang menyiapkan dan mengemas pesanan Anda.",
      date: (isDelivered || isShipped || isProcessing) ? formatDate(order.updated_at) : "-",
      time: "-",
    },
    {
      status: (isDelivered || isShipped || isProcessing) ? "completed" : "active",
      title: "Pesanan Dibuat",
      description: "Pesanan berhasil dibuat dan menunggu konfirmasi.",
      date: formatDate(order.created_at),
      time: "-",
    },
  ];

  const handleCopyResi = () => {
    if (order.Shipping?.tracking_number) {
      navigator.clipboard.writeText(order.Shipping.tracking_number);
      toast.success("Nomor resi berhasil disalin!");
    }
  };

  const shippingCarrier = order.Shipping?.shipping_method || "Regular Courier";
  const trackingNo = order.Shipping?.tracking_number || "Belum ada resi";

  return (
    <div className="max-w-2xl mx-auto rounded-2xl bg-white p-6 md:p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Package size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5 animate-pulse">
              {shippingCarrier}
            </p>
            <p className="text-lg font-bold text-gray-900 tracking-tight leading-none">
              {trackingNo}
            </p>
          </div>
        </div>
        {order.Shipping?.tracking_number && (
          <button 
            onClick={handleCopyResi}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 hover:bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors border border-gray-200"
          >
            <Copy size={16} /> Salin Resi
          </button>
        )}
      </div>

      <div className="px-2">
        {timelineData.map((item, index) => {
          const isCompleted = item.status === "completed";
          const isActive = item.status === "active";
          const isPending = item.status === "pending";

          const lineColor = !isPending ? "bg-blue-600" : "bg-gray-200";

          return (
            <div key={index} className="flex gap-4 md:gap-6 relative">

              <div className="w-16 md:w-24 pt-0.5 shrink-0 text-right hidden sm:block">
                <div className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                  {item.time !== "-" ? item.time : ""}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>
              </div>

              <div className="flex flex-col items-center">
                <div 
                  className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300 ${
                    isActive
                      ? "border-blue-600 ring-4 ring-blue-50"
                      : isCompleted
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                  {isActive && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                </div>

                {index < timelineData.length - 1 && (
                  <div className={`w-1 flex-1 my-1 rounded-full ${lineColor}`} />
                )}
              </div>

              <div className="flex-1 pb-8 pt-0">
                <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                  {item.date !== "-" ? item.date : "Estimasi Waktu"}
                </div>
                
                <h3 
                  className={`text-base font-bold ${
                    isActive ? "text-blue-600" : isPending ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p className={`mt-1 text-sm ${isPending ? "text-gray-400" : "text-gray-600"}`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-start gap-3 rounded-xl bg-blue-50/50 p-4 border border-blue-100">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 leading-relaxed">
          Estimasi pengiriman disesuaikan dengan kondisi operasional logistik di lapangan. 
          Pembaruan status mungkin memakan waktu 1-2 jam.
        </p>
      </div>

    </div>
  );
};

export default ProfessionalTracking;
