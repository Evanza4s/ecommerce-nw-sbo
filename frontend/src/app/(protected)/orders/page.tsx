"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PageSection from "@/components/ui/PageSection";
import { DEMO_ORDER_ID, userRoutes } from "@/lib/user-routes";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import OrderCard, { OrderData } from "@/components/order/OrderCard";

const ORDER_TABS = ["All", "Pending", "Paid", "Shipped", "Delivered", "Cancelled", "Refund"];

const demoOrders: OrderData[] = [
  {
    id: DEMO_ORDER_ID,
    status: "Shipped",
    total: "Rp 1.250.000",
    date: "04 Jun 2026",
    items: [
      {
        name: "Nike Air Force 1 '07",
        variant: "White, Size 42",
        qty: 1,
        image: "https://placehold.co/100x100?text=AF1",
      },
    ],
  },
  {
    id: "ORD-XYZ-998877-11223",
    status: "Delivered",
    total: "Rp 875.000",
    date: "31 Mei 2026",
    items: [
      {
        name: "NWV Premium Hoodie",
        variant: "Black, Size L",
        qty: 1,
        image: "https://placehold.co/100x100?text=Hoodie",
      },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = demoOrders.filter((o) => (activeTab === "All" ? true : o.status === activeTab));
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

<Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b rounded-none h-auto p-0 mb-8 scrollbar-hide">
          {ORDER_TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-semibold transition-all"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid gap-6">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Pesanan tidak ditemukan</h3>
              <p className="text-slate-500">Anda tidak memiliki riwayat pesanan dengan status &quot;{activeTab}&quot;</p>
            </div>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </Tabs>
    </PageSection>
  );
}
