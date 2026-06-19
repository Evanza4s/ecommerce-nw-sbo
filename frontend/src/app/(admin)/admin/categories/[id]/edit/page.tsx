"use client"
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCategoryForm from "@/components/admin/AdminCategoryForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const EditCategoryPage = ({ params }: { params: { id: string } }) => {
  return (
    <AdminPageSection title="Edit Category" description="Perbarui detail kategori.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: "Edit" },
        ]}
      />
      <AdminCategoryForm mode="edit" categoryId={params.id} />
    </AdminPageSection>
  );
};

export default EditCategoryPage;
