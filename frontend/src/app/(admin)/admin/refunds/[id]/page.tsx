"use client"

import { use, useEffect } from "react";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import { useAdminRefundDetail } from "@/hooks/useAdminRefundDetail";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RefundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { refund, loading, error, updateRefundStatus } = useAdminRefundDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !refund) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">{error || "Refund not found"}</p>
        <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <AdminDetailPage
      title="Refund Detail"
      description="Review permintaan refund dan persiapkan alur approve atau reject."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Refunds", href: "/admin/refunds" },
        { label: refund.refund_number },
      ]}
      summaryTitle={refund.refund_number}
      summaryDescription={`Request from ${refund.customer_name || 'Customer'} for order ${refund.order_id}.`}
      secondaryAction={{ label: "Back to Refunds", href: "/admin/refunds" }}
      primaryAction={{ label: "Open Order", href: `/admin/orders/${refund.order_id}` }}
      items={[
        { label: "Customer", value: refund.customer_name || "-" },
        { label: "Order ID", value: refund.order_id },
        { label: "Requested At", value: formatDateTime(refund.created_at) },
        { label: "Refund Amount", value: formatCurrency(refund.refund_amount) },
        { label: "Reason", value: refund.reason },
        { label: "Evidence", value: refund.evidence_url ? <a href={refund.evidence_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Evidence</a> : "-" },
        { label: "Status", value: <AdminStatusBadge status={refund.refund_status} /> },
      ]}
    >
      {refund.refund_status !== "completed" && refund.refund_status !== "rejected" && (
        <div className="flex justify-end gap-3">
          <Button 
            variant="destructive" 
            onClick={() => updateRefundStatus("rejected")}
            disabled={loading}
          >
            Reject Refund
          </Button>
          <Button 
            variant="default"
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => updateRefundStatus("completed")}
            disabled={loading}
          >
            Approve Refund
          </Button>
        </div>
      )}
    </AdminDetailPage>
  );
}
