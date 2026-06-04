import RefundPage from "@/components/refund/RefundPage";

interface OrderRefundRouteProps {
  params: Promise<{ id: string }>;
}

export default async function OrderRefundRoute({
  params,
}: OrderRefundRouteProps) {
  const { id } = await params;

  return <RefundPage orderId={id} />;
}
