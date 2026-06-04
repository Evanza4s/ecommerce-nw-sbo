"use client"
import { Check, X } from "lucide-react";

import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminRoles } from "@/data/admin-dashboard";
import { formatDateTime } from "@/lib/admin";

const BooleanCell = ({ value }: { value: boolean }) => {
  return value ? (
    <span className="inline-flex items-center text-emerald-700">
      <Check className="mr-1 h-4 w-4" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center text-rose-700">
      <X className="mr-1 h-4 w-4" />
      No
    </span>
  );
};

export default function RolesPage() {
  return (
    <AdminTablePage
      title="Roles"
      description="Manajemen role dan hak akses untuk pengguna sistem internal."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Roles" },
      ]}
      data={adminRoles}
      getRowKey={(role) => role.id}
      searchPlaceholder="Search by role name..."
      searchBy={(role) => role.roleName}
      columns={[
        { header: "Role Name", cell: (role) => role.roleName },
        { header: "Is Admin", cell: (role) => <BooleanCell value={role.isAdmin} /> },
        {
          header: "Is Super Admin",
          cell: (role) => <BooleanCell value={role.isSuperAdmin} />,
        },
        { header: "Created At", cell: (role) => formatDateTime(role.createdAt) },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (role) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "Edit", href: `/admin/roles/${role.id}/edit` },
                  { label: "Delete", href: `/admin/roles/${role.id}/edit` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No roles found."
    />
  );
}
