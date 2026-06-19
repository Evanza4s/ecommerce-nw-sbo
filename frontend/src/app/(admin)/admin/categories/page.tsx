"use client"
import { useState } from "react";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { useAdminCategories, useDeleteCategory } from "@/hooks/useAdminCategories";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import type { Category } from "@/server";

export default function CategoriesPage() {
  const { categories, isLoading, refetch } = useAdminCategories({ page_size: 100 });
  const { remove } = useDeleteCategory(() => refetch());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await remove(categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminTablePage
        title="Categories"
        description="Kelola kategori produk agar struktur katalog tetap rapi dan mudah dicari."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories" },
        ]}
        data={categories}
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
            getValue: (category) => category.is_active ? "active" : "inactive",
          },
        ]}
        columns={[
          { header: "Name", cell: (category) => <span className="font-medium">{category.name}</span> },
          { header: "Slug", cell: (category) => category.slug },
          { header: "Icon", cell: (category) => category.icon || "-" },
          {
            header: "Status",
            cell: (category) => <AdminStatusBadge status={category.is_active ? "active" : "inactive"} />,
          },
          {
            header: "Actions",
            className: "w-20 text-right",
            cell: (category) => (
              <div className="flex justify-end">
                <AdminRowActions
                  actions={[
                    { label: "Edit Category", href: `/admin/categories/${category.id}/edit` },
                    {
                      label: "Hapus Kategori",
                      onClick: () => {
                        setCategoryToDelete(category);
                        setIsDeleteModalOpen(true);
                      },
                      className: "text-red-600 focus:text-red-700"
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        emptyMessage="No categories found."
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />
    </>
  );
}
