import { Suspense } from "react";
import RefundPageClient from "./RefundPageClient";

export default function RefundRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <RefundPageClient />
    </Suspense>
  );
}
