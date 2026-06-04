import Divider from "@/components/product/Divider";
import ProductDetailPage from "@/page/ProductDetail/ProductDetailPage";
import ProductSpecification from "@/page/ProductDetail/ProductSpesification";
import RecomendationPage from "@/page/Public/RecomendationPage";

export default function ProductDetailRoute() {
  return (
    <>
      <ProductDetailPage />
      <Divider />
      <ProductSpecification />
      <Divider />
      <RecomendationPage />
    </>
  );
}
