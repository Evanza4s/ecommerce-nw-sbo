"use client"
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const CreateProductPage = () => {
  return (
    <AdminPageSection title="Create Product" description="Tambahkan produk baru beserta varian dan spesifikasinya.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Create" },
        ]}
      />
      <AdminProductForm mode="create" />
    </AdminPageSection>
  );
};

export default CreateProductPage;
