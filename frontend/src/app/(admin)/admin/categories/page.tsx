"use client"
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminCategories } from "@/data/admin-dashboard";

export default function CategoriesPage() {
  return (
    <AdminTablePage
      title="Categories"
      description="Kelola kategori produk agar struktur katalog tetap rapi dan mudah dicari."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Categories" },
      ]}
      data={adminCategories}
      getRowKey={(category) => category.id}
      searchPlaceholder="Search by category name or slug..."
      searchBy={(category) => `${category.name} ${category.slug}`}
      action={{ label: "Create Category", href: "/admin/categories/create" }}
      filters={[
        {
          label: "Status",
          value: "status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
          getValue: (category) => category.status,
        },
      ]}
      columns={[
        { header: "ID", cell: (category) => category.id },
        { header: "Name", cell: (category) => category.name },
        { header: "Slug", cell: (category) => category.slug },
        {
          header: "Status",
          cell: (category) => <AdminStatusBadge status={category.status} />,
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (category) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "Edit Category", href: `/admin/categories/${category.id}/edit` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No categories found."
    />
  );
}
