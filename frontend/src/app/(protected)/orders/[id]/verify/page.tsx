import VerifyOrderPage from "@/components/order/VerifyOrderPage";

interface OrderVerifyRouteProps {
  params: Promise<{ id: string }>;
}

export default async function OrderVerifyRoute({
  params,
}: OrderVerifyRouteProps) {
  const { id } = await params;

  return <VerifyOrderPage orderId={id} />;
}
