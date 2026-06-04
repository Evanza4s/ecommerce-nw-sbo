import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCategoryForm from "@/components/admin/AdminCategoryForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const CreateCategoryPage = () => {
  return (
    <AdminPageSection
      title="Create Category"
      description="Tambahkan kategori baru untuk memperjelas pengelompokan produk."
    >
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: "Create" },
        ]}
      />
      <AdminCategoryForm title="New Category" submitLabel="Save Category" />
    </AdminPageSection>
  );
};

export default CreateCategoryPage;
