"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Script from "next/script";
import { Package, Truck, CreditCard, ChevronLeft, Loader2, CheckCircle, ShieldCheck, Info } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import PageSection from "@/components/ui/PageSection";
import Card from "@/components/ui/Card";
import OrderItems from "@/components/order/OrderItems";
import OrderNote from "@/components/order/OrderNote";
import OrderProgress from "@/components/order/OrderProgress";
import OrderSummary from "@/components/order/OrderSummary";
import ShippingOrder from "@/components/order/ShippingOrder";
import TrackingTimeline from "@/components/order/TrackingTimeline";
import DeliveryInfo from "@/components/checkout/DeliveryInfo";
import DeliverySuccess from "@/components/checkout/DeliverySuccess";
import { VerificationAction } from "@/components/order";
import { userRoutes } from "@/lib/user-routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface UserOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserOrderDetailPage({ params }: UserOrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchOrder = () => {
    ordersApi.getById(id)
      .then((res) => {
        if (res.data) setOrder(res.data);
      })
      .catch((err) => console.error("Failed to fetch order", err));
  };

  useEffect(() => {
    let isMounted = true;
    ordersApi.getById(id)
      .then((res) => {
        if (isMounted && res.data) {
          setOrder(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

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
              setOrder(prev => prev ? { ...prev, payment_status: "Paid" } : null);

              let attempts = 0;
              const interval = setInterval(() => {
                fetchOrder();
                attempts++;
                if (attempts >= 5) clearInterval(interval);
              }, 2000);
            },
            onPending: function () {
              toast.info("Menunggu pembayaran Anda.");
              fetchOrder();
            },
            onError: function () {
              toast.error("Pembayaran gagal!");
            },
            onClose: function () {
              fetchOrder();
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

  const handleFinishOrder = async () => {
    toast.success("Terima kasih! Pesanan telah dikonfirmasi selesai.");
    setOrder(prev => prev ? { ...prev, order_status: "Completed" } : null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500 mb-4">Maaf, pesanan yang Anda cari tidak ditemukan.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/account/orders">Kembali ke Daftar Pesanan</Link>
        </Button>
      </div>
    );
  }

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX";
  const snapScriptSrc = "https://app.sandbox.midtrans.com/snap/snap.js";

  const isDelivered = order.order_status?.toLowerCase() === "delivered";
  const isPendingPayment = order.payment_status?.toLowerCase() === "pending";
  const isFinished = isDelivered || order.order_status?.toLowerCase() === "completed" || order.order_status?.toLowerCase() === "canceled";

  if (!isFinished) {
    let currentStep = 0;
    if (order.order_status === "Processing" || order.payment_status === "Paid") currentStep = 1;
    if (order.order_status === "Shipped") currentStep = 2;
    if (order.order_status === "Delivered" || order.order_status === "Completed") currentStep = 4;

    return (
      <>
        <Script
          src={snapScriptSrc}
          data-client-key={midtransClientKey}
          strategy="lazyOnload"
        />

        <PageSection
          title="Detail Pesanan"
          description="Pantau status dan informasi pesanan Anda di bawah ini"
          className="space-y-8"
        >
          <div className="space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={userRoutes.home}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={userRoutes.orders}>Order</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{order.order_number}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <OrderProgress currentStep={currentStep} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px] mt-6 mb-4">
            <div className="space-y-6">
              <OrderItems order={order} />
              <ShippingOrder address={order.AddressRef} />
              <OrderNote notes={order.notes} />
            </div>

            <div className="space-y-6">
              {isPendingPayment && (
                <Card className="border border-slate-200 p-6 shadow-sm text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Menunggu Pembayaran</h2>
                  <p className="text-sm text-slate-500 mb-6">Selesaikan pembayaran Anda agar pesanan dapat segera diproses.</p>

                  <Button
                    className="w-full max-w-md mx-auto rounded-xl h-12 font-medium"
                    onClick={() => handlePayNow(order.id)}
                    disabled={payingOrderId === order.id}
                  >
                    {payingOrderId === order.id ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
                      </>
                    ) : "Bayar Sekarang"}
                  </Button>
                </Card>
              )}

              <TrackingTimeline order={order} />
              <OrderSummary order={order} showAction={false} showHelp={false} />
            </div>
          </div>
        </PageSection>

        {/* Bottom Sticky Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="mx-auto max-w-6xl flex justify-end">
            <Button asChild variant="outline" className="rounded-xl px-8">
              <Link href="/account/orders" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Pesanan
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script
        src={snapScriptSrc}
        data-client-key={midtransClientKey}
        strategy="lazyOnload"
      />

      <PageSection
        title={isDelivered ? "Verifikasi Pesanan Diterima" : "Detail Pesanan"}
        description={isDelivered ? "Konfirmasi bahwa pesanan Anda telah diterima dengan baik." : "Pantau status dan informasi pesanan Anda di bawah ini"}
        className="space-y-8"
      >
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={userRoutes.home}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={userRoutes.orders}>Order</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{order.order_number}</BreadcrumbPage>
              </BreadcrumbItem>
              {isDelivered && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Verifikasi Diterima</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] mt-6">
          <div className="space-y-6">
            <DeliverySuccess orderStatus={order.order_status} />
            <OrderItems order={order} />
            <DeliveryInfo order={order} />
            <VerificationAction 
              orderId={order.id} 
              orderStatus={order.order_status} 
              onSuccess={fetchOrder} 
            />
          </div>
          <div className="space-y-6">
            <OrderSummary order={order} showAction={false} showHelp={true} />
          </div>
        </div>
      </PageSection>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-6xl flex justify-end">
          <Button asChild variant="outline" className="rounded-xl px-8">
            <Link href="/account/orders" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Pesanan
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
