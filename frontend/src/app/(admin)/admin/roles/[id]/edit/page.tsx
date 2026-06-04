import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { adminRoles } from "@/data/admin-dashboard";

interface RoleEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoleEditPage({ params }: RoleEditPageProps) {
  const { id } = await params;
  const role = adminRoles.find((item) => item.id === id);

  if (!role) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Edit Role"
      description="Halaman placeholder untuk mengatur role dan permission matrix."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Roles", href: "/admin/roles" },
        { label: role.roleName },
      ]}
      summaryTitle={role.roleName}
      summaryDescription="Di tahap berikutnya halaman ini bisa dihubungkan ke permission CRUD yang lebih granular."
      secondaryAction={{ label: "Back to Roles", href: "/admin/roles" }}
      items={[
        { label: "Role Name", value: role.roleName },
        { label: "Is Admin", value: role.isAdmin ? "Yes" : "No" },
        { label: "Is Super Admin", value: role.isSuperAdmin ? "Yes" : "No" },
        { label: "Recommended Fields", value: "permission_key, module_scope, allowed_actions, dan audit trail." },
        { label: "Delete Strategy", value: "Gunakan soft delete jika role pernah dipakai oleh user aktif." },
        { label: "Current State", value: "Ready untuk diubah menjadi form update role dan permission." },
      ]}
    />
  );
}
