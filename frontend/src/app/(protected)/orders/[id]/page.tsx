import OrderPage from "@/components/order/OrderPage";

interface OrderDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailRoute({
  params,
}: OrderDetailRouteProps) {
  const { id } = await params;

  return <OrderPage orderId={id} />;
}
