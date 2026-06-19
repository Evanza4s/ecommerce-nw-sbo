"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatDateTime } from "@/lib/admin";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";

export default function CustomersPage() {
  const { customers, loading } = useAdminCustomers();

  return (
    <AdminTablePage
      title="Customers"
      description="Daftar pelanggan aktif untuk pemantauan akun dan riwayat pembelian."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Customers" },
      ]}
      data={customers}
      getRowKey={(customer) => customer.id}
      searchPlaceholder="Search by customer name or email..."
      searchBy={(customer) => `${customer.first_name} ${customer.last_name} ${customer.email} ${customer.phone_number}`}
      filters={[
        {
          label: "Customer Status",
          value: "status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
          getValue: (customer) => customer.is_active ? "active" : "inactive",
        },
      ]}
      columns={[
        {
          header: "Name",
          cell: (customer) => `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.username,
        },
        {
          header: "Email",
          cell: (customer) => customer.email,
        },
        {
          header: "Phone",
          cell: (customer) => customer.phone_number || "-",
        },
        {
          header: "Role",
          cell: (customer) => customer.role_name || "User",
        },
        {
          header: "Registered",
          cell: (customer) => formatDateTime(customer.created_at),
        },
        {
          header: "Status",
          cell: (customer) => <AdminStatusBadge status={customer.is_active ? "active" : "inactive"} />,
        },
        {
          header: "Verified",
          cell: (customer) => <AdminStatusBadge status={customer.is_verified ? "verified" : "unverified"} />,
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (customer) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  {
                    label: "View History Order",
                    href: `/admin/customers/${customer.id}`, // Placeholder
                  },
                  { label: "Suspend / Ban", href: `/admin/customers/${customer.id}` }, // Placeholder
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage={loading ? "Loading customers..." : "No customers found for the current search."}
    />
  );
}
