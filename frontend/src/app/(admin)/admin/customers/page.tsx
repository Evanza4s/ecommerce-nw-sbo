"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminCustomers } from "@/data/admin-dashboard";
import { formatDateTime } from "@/lib/admin";

export default function CustomersPage() {
  return (
    <AdminTablePage
      title="Customers"
      description="Daftar pelanggan aktif untuk pemantauan akun dan riwayat pembelian."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Customers" },
      ]}
      data={adminCustomers}
      getRowKey={(customer) => customer.id}
      searchPlaceholder="Search by customer name or email..."
      searchBy={(customer) => `${customer.name} ${customer.email} ${customer.phone}`}
      filters={[
        {
          label: "Customer Status",
          value: "status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Suspended", value: "suspended" },
          ],
          getValue: (customer) => customer.status,
        },
      ]}
      columns={[
        {
          header: "Name",
          cell: (customer) => customer.name,
        },
        {
          header: "Email",
          cell: (customer) => customer.email,
        },
        {
          header: "Phone",
          cell: (customer) => customer.phone,
        },
        {
          header: "Gender",
          cell: (customer) => customer.gender,
        },
        {
          header: "Registered",
          cell: (customer) => formatDateTime(customer.registeredAt),
        },
        {
          header: "Status",
          cell: (customer) => <AdminStatusBadge status={customer.status} />,
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
                    href: `/admin/customers/${customer.id}`,
                  },
                  { label: "Suspend / Ban", href: `/admin/customers/${customer.id}` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No customers found for the current search."
    />
  );
}
