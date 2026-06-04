import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCategoryForm from "@/components/admin/AdminCategoryForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const EditCategoriesPage = () => {
  return (
    <AdminPageSection
      title="Edit Category"
      description="Perbarui kategori agar katalog tetap terstruktur dan akurat."
    >
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: "Edit" },
        ]}
      />
      <AdminCategoryForm
        title="Edit Category"
        submitLabel="Update Category"
        initialValues={{ name: "Sport", slug: "sport", status: "active" }}
      />
    </AdminPageSection>
  );
};

export default EditCategoriesPage;
