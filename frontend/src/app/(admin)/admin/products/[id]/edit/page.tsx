import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const EditProductPage = () => {
  return (
    <AdminPageSection title="Edit Product" description="Perbarui detail produk, stok, varian, dan spesifikasinya.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit" },
        ]}
      />
      <AdminProductForm mode="edit" />
    </AdminPageSection>
  );
};

export default EditProductPage;
