"use client";

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
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Loader2 } from "lucide-react";
import OrderCard from "@/components/order/OrderCard";
import { cn } from "@/lib/utils";
import { useMyOrders } from "@/hooks/useMyOrders";
import { formatCurrency, formatDate } from "@/lib/admin";

const ORDER_TABS = [
  "All",
  "Pending",
  "Paid",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refund",
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const { orders, loading, error } = useMyOrders();

  const filteredOrders = (orders || []).filter((o) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return o.order_status?.toLowerCase() === "pending" || o.payment_status?.toLowerCase() === "pending";
    return o.order_status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <PageSection
      title="My Orders"
      description="Lihat riwayat pesanan, status pengiriman, dan tindakan lanjutan setelah pembelian."
      className="space-y-8"
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={userRoutes.home}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs
        defaultValue="All"
        onValueChange={setActiveTab}
        className="w-full mt-8"
      >
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

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 my-6">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500">Memuat data pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">
                Pesanan tidak ditemukan
              </h3>
              <p className="text-slate-500 mt-1">
                Anda tidak memiliki riwayat pesanan dengan status &quot;
                {activeTab}&quot;
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </Tabs>
    </PageSection>
  );
}
