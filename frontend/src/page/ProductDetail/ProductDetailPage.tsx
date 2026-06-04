"use client";
import ProductGallery from "@/components/product/ProductGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ContohProduct from "../../assets/images/background_landingpage.jpeg";
import ContohProduct2 from "../../assets/images/background_sidelogin.jpeg";
import ContohProduct3 from "../../assets/images/model.png";
import ContohProduct4 from "../../assets/images/icon_e-commerce.png";
import ProductInfo from "@/components/product/ProductInfo";
import PublicSection from "@/components/ui/PublicSection";
import { userRoutes } from "@/lib/user-routes";

const sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const colors = ["#000000", "#2561E2", "#EF4444", "#10B981"];

const ProductDetailPage = () => {
  const images = [
    {
      src: ContohProduct,
      alt: "Nike Air Force Front",
    },
    {
      src: ContohProduct2,
      alt: "Nike Air Force Side",
    },
    {
      src: ContohProduct3,
      alt: "Nike Air Force Back",
    },
    {
      src: ContohProduct4,
      alt: "Nike Air Force Detail",
    },
  ];

  return (
    <PublicSection className="px-0 py-0">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={userRoutes.products}>Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={userRoutes.productDetail("sepatu-nike")}>
                  Sepatu Nike
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ProductGallery images={images} />
        </div>
        <ProductInfo
          title="Nike Air Force 1"
          price="Rp 1.000.000"
          description={`Premium sneakers designed for comfort, durability, and everyday style.`}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </PublicSection>
  );
};

export default ProductDetailPage;
