"use client"
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCategoryForm from "@/components/admin/AdminCategoryForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const CreateCategoryPage = () => {
  return (
    <AdminPageSection title="Create Category" description="Tambahkan kategori produk baru ke dalam sistem.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: "Create" },
        ]}
      />
      <AdminCategoryForm mode="create" />
    </AdminPageSection>
  );
};

export default CreateCategoryPage;
