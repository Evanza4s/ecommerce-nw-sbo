import Divider from "@/components/product/Divider";
import ProductDetailPage from "@/page/ProductDetail/ProductDetailPage";
import RecomendationPage from "@/page/Public/RecomendationPage";

export default async function ProductDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <ProductDetailPage slug={slug} />
      <Divider />
      <RecomendationPage />
    </>
  );
}
