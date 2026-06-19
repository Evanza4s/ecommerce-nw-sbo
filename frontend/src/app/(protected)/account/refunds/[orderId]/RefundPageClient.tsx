"use client";

import { useSearchParams } from "next/navigation";
import RefundPage from "@/components/refund/RefundPage";

export default function RefundPageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return <RefundPage orderId={orderId || undefined} />;
}
