"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderItems from "@/components/order/OrderItems";
import OrderNote from "@/components/order/OrderNote";
import OrderProgress from "@/components/order/OrderProgress";
import OrderSummary from "@/components/order/OrderSummary";
import ShippingOrder from "@/components/order/ShippingOrder";
import TrackingTimeline from "@/components/order/TrackingTimeline";
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
import Link from "next/link";

interface OrderPageProps {
  orderId?: string;
}

const OrderPage = ({ orderId }: OrderPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    ordersApi.getById(orderId)
      .then((res) => {
        if (res.data) setOrder(res.data);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || "Gagal memuat detail pesanan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <PageSection
        title="Order Details"
        description="Review your order, shipment progress, and delivery information."
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-slate-500">Memuat detail pesanan...</p>
        </div>
      </PageSection>
    );
  }

  if (error || !order) {
    return (
      <PageSection
        title="Order Details"
        description="Review your order, shipment progress, and delivery information."
      >
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-600 space-y-4 max-w-md mx-auto">
          <p className="font-bold">Error Memuat Detail Pesanan</p>
          <p className="text-sm">{error || "Pesanan tidak ditemukan."}</p>
          <Button asChild variant="outline">
            <Link href={userRoutes.orders}>Kembali ke Daftar Pesanan</Link>
          </Button>
        </div>
      </PageSection>
    );
  }

  let currentStep = 0;
  if (order.order_status === "Processing") currentStep = 2;
  else if (order.order_status === "Shipped") currentStep = 3;
  else if (order.order_status === "Delivered") currentStep = 5;

  return (
    <PageSection
      title="Order Details"
      description="Review your order, shipment progress, and delivery information."
      className="space-y-8"
    >
      <div className="space-y-6">
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
          <OrderSummary order={order} showAction={false} showHelp={false} />
          <TrackingTimeline order={order} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          asChild
          variant="outline"
          size="default"
          className="gap-2 border-dark text-black"
        >
          <Link href="/products">
            <ArrowLeft /> <span>Kembali belanja</span>
          </Link>
        </Button>
      </div>
    </PageSection>
  );
};

export default OrderPage;
