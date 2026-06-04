"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminSystemUsers } from "@/data/admin-dashboard";

export default function UsersPage() {
  return (
    <AdminTablePage
      title="Users"
      description="Daftar akun internal yang memiliki akses ke dashboard sistem."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Users" },
      ]}
      data={adminSystemUsers}
      getRowKey={(user) => user.id}
      searchPlaceholder="Search by name, username, or role..."
      searchBy={(user) => `${user.name} ${user.username} ${user.roleName}`}
      filters={[
        {
          label: "Role",
          value: "roleName",
          options: [
            { label: "All Roles", value: "all" },
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Staff", value: "Staff" },
          ],
          getValue: (user) => user.roleName,
        },
      ]}
      columns={[
        { header: "Name", cell: (user) => user.name },
        { header: "Username", cell: (user) => user.username },
        { header: "Role", cell: (user) => user.roleName },
        {
          header: "Verified",
          cell: (user) => <AdminStatusBadge status={user.verified} />,
        },
        { header: "Status", cell: (user) => <AdminStatusBadge status={user.status} /> },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (user) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "Edit Role", href: `/admin/users/${user.id}/edit` },
                  { label: "Reset Password", href: `/admin/users/${user.id}/edit` },
                  { label: "Delete", href: `/admin/users/${user.id}/edit` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No system users found."
    />
  );
}
