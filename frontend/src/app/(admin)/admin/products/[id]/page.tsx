"use client";
import ProductInfo from "@/components/product/ProductInfo";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPanelCard from "@/components/admin/AdminPanelCard";
import AdminPageSection from "@/components/ui/AdminPageSection";
import ProductSpecification from "@/page/ProductDetail/ProductSpesification";
import ProductGallery from "@/components/product/ProductGallery";
import { useAdminProductDetail } from "@/hooks/useAdminProducts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ViewProductPage = ({ params }: { params: { id: string } }) => {
  const { product, isLoading, error } = useAdminProductDetail(params.id);

  if (isLoading) {
    return (
      <AdminPageSection title="Product Detail" description="Memuat data produk...">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminPageSection>
    );
  }

  if (error || !product) {
    return (
      <AdminPageSection title="Product Detail" description="Terjadi kesalahan">
        <AdminPanelCard>
          <div className="py-12 text-center text-red-500">{error || "Produk tidak ditemukan"}</div>
        </AdminPanelCard>
      </AdminPageSection>
    );
  }

  const images = [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order);

  if (images.length === 0 && product.thumbnail_url) {
    images.push({
      id: "thumb",
      product_id: product.id,
      image_url: product.thumbnail_url,
      is_thumbnail: true,
      sort_order: 0
    });
  }

  return (
    <AdminPageSection
      title="Product Detail"
      description="Tinjau tampilan produk, informasi utama, dan spesifikasi yang tampil di storefront."
    >
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: product.product_name },
        ]}
      />

      <AdminPanelCard>
        <div className="mb-6 flex justify-end">
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>Edit Produk</Link>
          </Button>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <ProductGallery images={images} />
          </div>
          <div className="py-2">
            <ProductInfo product={product} />
          </div>
        </div>
        <div className="mt-16 border-t border-slate-200 pt-16">
          <ProductSpecification product={product} />
        </div>
      </AdminPanelCard>
    </AdminPageSection>
  );
};

export default ViewProductPage;
