import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminCustomers } from "@/data/admin-dashboard";
import { formatDateTime } from "@/lib/admin";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = adminCustomers.find((item) => item.id === id);

  if (!customer) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Customer Detail"
      description="Profil pelanggan dan ringkasan histori order untuk kebutuhan support atau fraud check."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Customers", href: "/admin/customers" },
        { label: customer.name },
      ]}
      summaryTitle={customer.name}
      summaryDescription="Tampilan detail ini bisa diperluas menjadi order history, customer notes, dan ban control."
      secondaryAction={{ label: "Back to Customers", href: "/admin/customers" }}
      primaryAction={{ label: "See Orders", href: "/admin/orders" }}
      items={[
        { label: "Email", value: customer.email },
        { label: "Phone", value: customer.phone },
        { label: "Gender", value: customer.gender },
        { label: "Registered At", value: formatDateTime(customer.registeredAt) },
        { label: "Account Status", value: <AdminStatusBadge status={customer.status} /> },
        { label: "Total Orders", value: customer.totalOrders.toString() },
      ]}
    />
  );
}
