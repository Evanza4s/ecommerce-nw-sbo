import Divider from "@/components/product/Divider";
import ProductPage from "@/page/Public/ProductPage";
import RecomendationPage from "@/page/Public/RecomendationPage";

export default function ProductsCatalogPage() {
  return (
    <>
      <ProductPage />
      <Divider className="mt-16" />
      <RecomendationPage />
    </>
  );
}
