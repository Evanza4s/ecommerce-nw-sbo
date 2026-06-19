"use client";

import DeliveryInfo from "@/components/checkout/DeliveryInfo";
import DeliverySuccess from "@/components/checkout/DeliverySuccess";
import { VerificationAction } from "@/components/order";
import OrderItems from "@/components/order/OrderItems";
import OrderSummary from "@/components/order/OrderSummary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PageSection from "@/components/ui/PageSection";
import { userRoutes } from "@/lib/user-routes";
import { useState, useEffect } from "react";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VerifyOrderPageProps {
  orderId?: string;
}

const VerifyOrderPage = ({ orderId }: VerifyOrderPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getById(orderId);
      if (res.data) setOrder(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat detail pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <PageSection
        title="Verifikasi Pesanan Diterima"
        description="Konfirmasi bahwa pesanan Anda telah diterima dengan baik."
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-slate-500">Memuat data pesanan...</p>
        </div>
      </PageSection>
    );
  }

  if (error || !order) {
    return (
      <PageSection
        title="Verifikasi Pesanan Diterima"
        description="Konfirmasi bahwa pesanan Anda telah diterima dengan baik."
      >
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-600 space-y-4 max-w-md mx-auto">
          <p className="font-bold">Error Memuat Pesanan</p>
          <p className="text-sm">{error || "Pesanan tidak ditemukan."}</p>
          <Button asChild variant="outline">
            <Link href={userRoutes.orders}>Kembali ke Daftar Pesanan</Link>
          </Button>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection
      title="Verifikasi Pesanan Diterima"
      description="Konfirmasi bahwa pesanan Anda telah diterima dengan baik."
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={userRoutes.orders}>Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={userRoutes.orderDetail(order.id)}>{order.order_number}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Verifikasi Order</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
  );
};

export default VerifyOrderPage;
