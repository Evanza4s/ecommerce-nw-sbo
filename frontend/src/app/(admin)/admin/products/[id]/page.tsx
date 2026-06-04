"use client";
import ProductInfo from "@/components/product/ProductInfo";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPanelCard from "@/components/admin/AdminPanelCard";
import AdminPageSection from "@/components/ui/AdminPageSection";
import ProductSpecification from "@/page/ProductDetail/ProductSpesification";
import Image from "next/image";

const productData = {
  id: "1",
  title: "Nike Air Force 1 '07",
  price: "Rp 1.549.000",
  description:
    "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colours and the perfect amount of flash to make you shine.",
  sizes: ["39", "40", "41", "42", "43", "44"],
  colors: ["#ffffff", "#000000", "#e5e5e5"],
  images: [
    "/products/af1-main.jpg", // Pastikan ada gambar dummy di folder public
    "/products/af1-side.jpg",
    "/products/af1-back.jpg",
    "/products/af1-top.jpg",
  ],
};

const ViewProductPage = () => {
  return (
    <AdminPageSection
      title="Product Detail"
      description="Tinjau tampilan produk, informasi utama, dan spesifikasi yang tampil di storefront."
    >
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: productData.title },
        ]}
      />

      <AdminPanelCard>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={productData.images[0]}
                alt={productData.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/800x800?text=Product+Image";
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border-2 border-transparent hover:border-primary transition-colors focus:border-primary focus:outline-none"
                >
                  <Image
                    src={img}
                    alt={`${productData.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Thumb";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="py-2">
            <ProductInfo
              title={productData.title}
              price={productData.price}
              description={productData.description}
              sizes={productData.sizes}
              colors={productData.colors}
            />
          </div>
        </div>
        <div className="mt-16 border-t border-slate-200 pt-16">
          <ProductSpecification />
        </div>
      </AdminPanelCard>
    </AdminPageSection>
  );
};

export default ViewProductPage;
