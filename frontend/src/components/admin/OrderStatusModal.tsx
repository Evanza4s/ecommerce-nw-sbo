"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";

interface OrderStatusModalProps {
  orderId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function OrderStatusModal({ orderId, onClose, onUpdated }: OrderStatusModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [paymentStatus, setPaymentStatus] = useState<string>("Pending");
  const [orderStatus, setOrderStatus] = useState<string>("Pending");
  const [trackingNumber, setTrackingNumber] = useState<string>("");

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
          setPaymentStatus(res.data.payment_status || "Pending");
          setOrderStatus(res.data.order_status || "Pending");
          setTrackingNumber(res.data.Shipping?.tracking_number || "");
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

  const handleSave = async () => {
    if (!orderId) return;
    
    setIsSaving(true);
    setError(null);
    try {
      const payload: any = {
        order_status: orderStatus,
        payment_status: paymentStatus,
      };

      // Auto update shipping status based on order status
      if (orderStatus === "Shipped" || orderStatus === "Delivered") {
        payload.shipping_status = orderStatus;
        if (trackingNumber) {
          payload.tracking_number = trackingNumber;
        }
      }

      await ordersApi.updateStatus(orderId, payload);
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal memperbarui status pesanan.");
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Status Pesanan</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-sm text-rose-500 bg-rose-50 p-3 rounded-md border border-rose-100">
              {error}
            </div>
          ) : order ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                <p className="font-semibold">{order.order_number}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Payment Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Order Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              {orderStatus === "Shipped" && (
                <div className="space-y-2 pt-2 border-t mt-4">
                  <label className="text-sm font-medium leading-none text-primary">Nomor Resi (Tracking Number)</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan resi pengiriman (opsional)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pelanggan akan dapat melihat nomor resi ini di halaman pesanan mereka.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving || isLoading}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading || !!error}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
