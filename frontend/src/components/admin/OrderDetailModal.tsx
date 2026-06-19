"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";
import { formatCurrency, formatDateTime } from "@/lib/admin";

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await ordersApi.getById(orderId);
        if (res.data) {
          setOrder(res.data);
        } else {
          setError("Pesanan tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err?.message || "Terjadi kesalahan saat memuat data pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Memuat rincian pesanan...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center text-rose-500">
              <p>{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-8">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 rounded-lg bg-slate-50 p-6 border">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">
                    Pesanan #{order.order_number}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Dibuat pada {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-start md:items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Payment:</span>
                    <AdminStatusBadge status={order.payment_status?.toLowerCase() as any} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Order:</span>
                    <AdminStatusBadge status={order.order_status?.toLowerCase() as any} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer & Shipping */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Informasi Pelanggan</h3>
                    {order.UserRef ? (
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nama:</span> {order.UserRef.fullname}</p>
                        <p><span className="font-medium">Email:</span> {order.UserRef.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Data pengguna tidak tersedia</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Alamat Pengiriman</h3>
                    {order.AddressRef ? (
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.AddressRef.receiver_name}</p>
                        <p>{order.AddressRef.phone_number}</p>
                        <p>{order.AddressRef.full_address}</p>
                        <p>
                          {order.AddressRef.district}, {order.AddressRef.city}, {order.AddressRef.province} {order.AddressRef.postal_code}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Alamat tidak tersedia</p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 border-b pb-2">Rincian Pembayaran</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(order.subtotal_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span className="font-medium">{formatCurrency(order.shipping_cost)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Diskon</span>
                        <span className="font-medium">-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}
                    {order.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pajak</span>
                        <span className="font-medium">{formatCurrency(order.tax_amount)}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t flex justify-between items-center">
                      <span className="font-semibold text-base">Grand Total</span>
                      <span className="font-bold text-xl text-primary">{formatCurrency(order.grand_total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-2">Barang Pesanan</h3>
                {order.Items && order.Items.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk / Varian</th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground w-24">Harga</th>
                          <th className="px-4 py-3 text-center font-medium text-muted-foreground w-16">Qty</th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground w-32">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {order.Items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <p className="font-medium">{item.ProductVariantRef?.ProductRef?.product_name || "Produk Tidak Diketahui"}</p>
                              {item.ProductVariantRef && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Varian: {item.ProductVariantRef.variant_name} - {item.ProductVariantRef.variant_value}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-slate-50 p-4 rounded-md border text-center">
                    Tidak ada data barang pesanan.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
