"use client";
import DashbordStats from "@/components/dashboard/DashbordStats";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageSection from "@/components/ui/AdminPageSection";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { formatCurrency } from "@/lib/admin";

export default function AdminDashboardPage() {
  const { orders } = useAdminOrders();
  const { customers } = useAdminCustomers();
  const { products } = useAdminProducts();

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.payment_status === "Paid") {
      return sum + order.grand_total;
    }
    return sum;
  }, 0);

  return (
    <AdminPageSection title="Dashboard" description="Welcome admin">
      <AdminBreadcrumbs items={[{ label: "Dashboard" }]} />

      <div className="mt-8 space-y-6">
        <DashbordStats 
          revenue={formatCurrency(totalRevenue)}
          orders={String(orders.length)}
          customers={String(customers.length)}
          products={String(products.length)}
        />
        <RevenueChart />
      </div>
    </AdminPageSection>
  );
}
