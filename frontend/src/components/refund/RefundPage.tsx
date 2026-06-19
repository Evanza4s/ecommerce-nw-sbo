"use client";

import FormRefund from "@/components/refund/FormRefund";
import RefundHelp from "@/components/refund/RefundHelp";
import RefundPolicy from "@/components/refund/RefundPolicy";
import RefundRequest from "@/components/refund/RefundRequest";
import RefundSummary from "@/components/refund/RefundSummary";
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
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RefundPageProps {
  orderId?: string;
}

const RefundPage = ({ orderId }: RefundPageProps) => {
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
        title="Refund Request"
        description="Submit a refund request for your order"
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
        title="Refund Request"
        description="Submit a refund request for your order"
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

  const orderDetailHref = userRoutes.orderDetail(order.id);

  return (
    <PageSection
      title="Refund Request"
      description="Submit a refund request for your order"
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
              <BreadcrumbLink href={userRoutes.orders}>Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={orderDetailHref}>{order.order_number}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Refund Request</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <RefundRequest />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <FormRefund order={order} />
        </div>

        <div className="space-y-6">
          <RefundSummary order={order} />
          <RefundPolicy />
          <RefundHelp />
        </div>
      </div>
    </PageSection>
  );
};

export default RefundPage;
