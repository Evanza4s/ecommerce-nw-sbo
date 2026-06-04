import { notFound } from "next/navigation";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminSystemUsers } from "@/data/admin-dashboard";

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params;
  const user = adminSystemUsers.find((item) => item.id === id);

  if (!user) {
    notFound();
  }

  return (
    <AdminDetailPage
      title="Manage User Access"
      description="Placeholder halaman manajemen role, reset password, dan status akun internal."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Users", href: "/admin/users" },
        { label: user.name },
      ]}
      summaryTitle={user.name}
      summaryDescription="Gunakan halaman ini sebagai entry point untuk operasi user management."
      secondaryAction={{ label: "Back to Users", href: "/admin/users" }}
      items={[
        { label: "Username", value: user.username },
        { label: "Role", value: user.roleName },
        { label: "Verified", value: <AdminStatusBadge status={user.verified} /> },
        { label: "Status", value: <AdminStatusBadge status={user.status} /> },
        { label: "Suggested Actions", value: "Edit role, reset password, soft delete, atau suspend access." },
        { label: "Integration Notes", value: "Hubungkan ke mstusers, mstuser_identity, dan mstrole untuk update akses yang aman." },
      ]}
    />
  );
}
