"use client";

import RefundPage from "@/components/refund/RefundPage";
import { useSearchParams } from "next/navigation";

export default function RefundPageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return <RefundPage orderId={orderId || undefined} />;
}
