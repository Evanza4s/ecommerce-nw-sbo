"use client";
import ProductGallery from "@/components/product/ProductGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductInfo from "@/components/product/ProductInfo";
import PublicSection from "@/components/ui/PublicSection";
import ProductSpecification from "./ProductSpesification";
import { useProductDetail } from "@/hooks/useProducts";
import Divider from "@/components/product/Divider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ProductDetailPageProps = {
  slug?: string;
};

const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const { product, isLoading, error } = useProductDetail(slug || "");

  if (isLoading) {
    return (
      <PublicSection className="px-0 py-16">
        <div className="flex flex-col items-center justify-center animate-pulse gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-dark/40 font-medium">Memuat detail produk...</p>
        </div>
      </PublicSection>
    );
  }

  if (error || !product) {
    return (
      <PublicSection className="px-0 py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-2xl font-bold">Produk Tidak Ditemukan</h2>
          <p className="text-dark/60">{error || "Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia."}</p>
          <Button asChild className="mt-4 gap-2">
            <Link href="/products">
              <ArrowLeft size={16} />
              Kembali ke Katalog
            </Link>
          </Button>
        </div>
      </PublicSection>
    );
  }

  // Ensure images array is properly formatted
  const images = [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order);

  // If no images exist but thumbnail_url does, use that as a fallback image
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
    <>
      <PublicSection className="px-0 py-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6 lg:gap-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {product.product_name}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <ProductGallery images={images} />
          </div>
          
          <ProductInfo product={product} />
        </div>
      </PublicSection>
      
      <Divider className="my-10" />
      
      <ProductSpecification product={product} />
    </>
  );
};

export default ProductDetailPage;
