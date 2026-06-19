"use client";

import React, { useEffect, useState } from "react";
import { refundsApi } from "@/server/modules/refunds/api";
import { ordersApi } from "@/server/modules/orders/api";
import type { Refund } from "@/server/modules/refunds/types";
import type { Order } from "@/server/modules/orders/types";
import { Loader2, Package, CheckCircle2, XCircle, AlertCircle, Clock, Copy, ArrowLeft } from "lucide-react";
import PageSection from "@/components/ui/PageSection";
import Card from "@/components/ui/Card";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { userRoutes } from "@/lib/user-routes";

interface RefundStatusProps {
  orderId: string;
}

const RefundStatus = ({ orderId }: RefundStatusProps) => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      refundsApi.getAll({ order_id: orderId, page: 1, page_size: 100 }),
      ordersApi.getById(orderId)
    ])
      .then(([refundRes, orderRes]) => {
        if (!isMounted) return;
        // API returns data in different formats depending on backend
        const refundsData = Array.isArray(refundRes.data) ? refundRes.data : 
                          (refundRes.data?.data ? refundRes.data.data : []);
        setRefunds(refundsData);
        if (orderRes.data) setOrder(orderRes.data);
      })
      .catch(err => {
        console.error("Failed to fetch refund status", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [orderId]);

  if (loading) {
    return (
      <PageSection title="Status Pengembalian" description="Memuat status pengajuan refund Anda...">
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-slate-500">Mengambil data...</p>
        </div>
      </PageSection>
    );
  }

  const refund = refunds.find(r => r.order_id === orderId) || refunds[0];

  if (!refund) {
    return (
      <PageSection title="Status Pengembalian" description="Riwayat pengajuan refund Anda">
        <Card className="flex flex-col items-center justify-center p-12 text-center border-slate-200 shadow-sm">
          <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">Belum Ada Pengajuan Refund</h3>
          <p className="mb-6 max-w-sm text-sm text-slate-500">
            Anda belum pernah mengajukan pengembalian untuk pesanan ini.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/account/orders/${orderId}`}>Kembali ke Pesanan</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link href={`/account/refunds/request?orderId=${orderId}`}>Ajukan Sekarang</Link>
            </Button>
          </div>
        </Card>
      </PageSection>
    );
  }

  // Refund status mapping
  const status = refund.refund_status?.toLowerCase() || "pending";
  const isPending = status === "pending" || status === "pending_confirmation";
  const isApproved = status === "approved" || status === "processed" || status === "completed";
  const isRejected = status === "rejected";
  const isCompleted = status === "completed";

  const timelineSteps = [
    {
      title: "Pengajuan Selesai",
      description: isCompleted ? "Dana telah berhasil dikembalikan." : "Dana berhasil dikembalikan dan refund ditutup.",
      isActive: isCompleted,
      isCompleted: false, // nothing is strictly after this
      date: isCompleted ? formatDateTime(refund.created_at) : "-",
    },
    {
      title: isRejected ? "Pengajuan Ditolak" : "Menunggu Pengembalian Dana",
      description: isRejected 
        ? "Pengajuan refund Anda ditolak oleh admin."
        : "Pengajuan disetujui, dana sedang diproses untuk dikembalikan ke rekening Anda.",
      isActive: isApproved || isRejected,
      isCompleted: isCompleted,
      date: (isApproved || isRejected) ? formatDateTime(refund.created_at) : "-",
    },
    {
      title: "Menunggu Konfirmasi Admin",
      description: "Pengajuan refund Anda sedang ditinjau oleh tim kami. Mohon menunggu maksimal 2x24 jam.",
      isActive: isPending,
      isCompleted: isApproved || isRejected || isCompleted,
      date: formatDateTime(refund.created_at),
    }
  ];

  return (
    <PageSection 
      title="Status Pengembalian" 
      description="Lacak status pengajuan refund (pengembalian dana) pesanan Anda"
      className="space-y-6"
    >
      <div className="mb-6">
        <Button asChild variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
          <Link href={`/account/orders/${orderId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Pesanan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        {/* Timeline Column */}
        <div className="space-y-6">
          <Card className="p-6 md:p-8 shadow-sm border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Timeline Pengembalian</h3>
            
            <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-10">
              {timelineSteps.map((step, idx) => {
                const markerColor = step.isCompleted 
                  ? "bg-blue-600 border-blue-600" 
                  : step.isActive && isRejected
                    ? "bg-red-500 border-red-500"
                  : step.isActive
                    ? "bg-white border-blue-600 ring-4 ring-blue-50"
                  : "bg-slate-100 border-slate-200";
                  
                const textColor = step.isCompleted || step.isActive ? "text-slate-900" : "text-slate-400";
                
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2 ${markerColor} flex items-center justify-center`}>
                      {step.isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h4 className={`font-bold ${textColor}`}>{step.title}</h4>
                        <span className="text-xs font-medium text-slate-400">{step.date}</span>
                      </div>
                      <p className={`text-sm ${step.isActive || step.isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 border-b pb-3">Informasi Refund</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Nomor Pesanan</p>
                <p className="font-semibold text-slate-900">{order?.order_number || orderId}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">ID Refund</p>
                <p className="font-semibold text-slate-900 font-mono text-xs">{refund.refund_number || refund.id}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Alasan</p>
                <p className="font-medium text-slate-800 bg-slate-50 p-3 rounded-lg mt-1 border border-slate-100">
                  {refund.reason}
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Total Pengembalian</p>
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(refund.refund_amount || order?.grand_total || 0)}
                </p>
              </div>
              {refund.evidence_url && (() => {
                let images = [refund.evidence_url];
                try {
                  const parsed = JSON.parse(refund.evidence_url);
                  if (Array.isArray(parsed)) images = parsed;
                } catch {}
                
                return (
                  <div>
                    <p className="text-slate-500 mb-2">Bukti Kendala ({images.length})</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {images.map((img, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 relative aspect-square">
                          <img src={img} alt={`Bukti Kendala ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </div>
      </div>
    </PageSection>
  );
};

export default RefundStatus;
