"use client"
import { use } from "react";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);

  return (
    <AdminPageSection title="Edit Product" description="Perbarui detail, varian, dan spesifikasi produk.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit" },
        ]}
      />
      <AdminProductForm mode="edit" productId={resolvedParams.id} />
    </AdminPageSection>
  );
};

export default EditProductPage;
