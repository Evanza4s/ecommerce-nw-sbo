import { Suspense, use } from "react";
import RefundStatus from "@/components/refund/RefundStatus";

export default function RefundStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <RefundStatus orderId={orderId} />
    </Suspense>
  );
}
