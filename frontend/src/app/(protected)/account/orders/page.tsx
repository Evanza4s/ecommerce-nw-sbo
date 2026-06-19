"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Package, Clock, CheckCircle2, XCircle, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";
import PageSection from "@/components/ui/PageSection";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useMyOrders } from "@/hooks/useMyOrders";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import type { Order } from "@/server/modules/orders/types";
import { ordersApi } from "@/server/modules/orders/api";
import { toast } from "react-toastify";
import { cn, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/order/OrderCard";

const ORDER_TABS = ["Semua", "Pending", "Processing", "Shipped", "Delivered", "Canceled"];



export default function MyOrdersPage() {
  const { orders, loading, refresh, setOrders } = useMyOrders();
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Semua");

  const handlePayNow = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      const res = await ordersApi.getSnapToken(orderId);
      if (res.data?.snap_token) {
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(res.data.snap_token, {
            onSuccess: function () {
              toast.success("Pembayaran berhasil diproses, menunggu konfirmasi...");
              // Optimistic UI Update
              setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: "Paid" } : o));
              
              // Polling to wait for webhook
              let attempts = 0;
              const interval = setInterval(() => {
                refresh();
                attempts++;
                if (attempts >= 5) clearInterval(interval);
              }, 2000);
            },
            onPending: function () {
              toast.info("Menunggu pembayaran Anda.");
              refresh();
            },
            onError: function () {
              toast.error("Pembayaran gagal!");
            },
            onClose: function () {
              refresh();
            }
          });
        } else {
          toast.error("Modul pembayaran belum dimuat.");
        }
      } else {
        toast.error("Gagal mendapatkan token pembayaran.");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setPayingOrderId(null);
    }
  };

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX";
  const snapScriptSrc = "https://app.sandbox.midtrans.com/snap/snap.js";

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Pending") return o.order_status?.toLowerCase() === "pending" || o.payment_status?.toLowerCase() === "pending";
    return o.order_status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <>
      <Script
        src={snapScriptSrc}
        data-client-key={midtransClientKey}
        strategy="lazyOnload"
      />
      <PageSection
      title="Daftar Pesanan"
      description="Lacak status pesanan Anda dan lihat riwayat belanja."
      className="bg-slate-50 min-h-screen"
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <Tabs defaultValue="Semua" onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="flex h-13 border w-full min-w-max items-center justify-center rounded-full bg-slate-100/80 p-6">
            {ORDER_TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-4 text-sm font-medium transition-all",
                  "text-slate-500 hover:text-slate-900",
                  "data-[state=active]:bg-secondary-divider py-4 data-[state=active]:text-light data-[state=active]:shadow-sm data-[state=active]:font-bold",
                )}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <p className="text-sm text-slate-500">Memuat pesanan...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center border-slate-200">
                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">Pesanan tidak ditemukan</h3>
                <p className="mb-6 max-w-sm text-sm text-slate-500">
                  Anda tidak memiliki riwayat pesanan dengan status "{activeTab}".
                </p>
                <Button asChild className="rounded-xl">
                  <Link href="/products">Mulai Belanja</Link>
                </Button>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPayNow={handlePayNow}
                  isPaying={payingOrderId === order.id}
                />
              ))
            )}
          </div>
        </Tabs>
      </div>
    </PageSection>
    </>
  );
}
