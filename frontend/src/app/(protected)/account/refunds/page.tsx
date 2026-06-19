"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, RefreshCcw, Loader2 } from "lucide-react";
import PageSection from "@/components/ui/PageSection";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { refundsApi } from "@/server/modules/refunds/api";
import { formatCurrency, formatDateTime } from "@/lib/admin";
import type { Refund } from "@/server/modules/refunds/types";
import { toast } from "react-toastify";

export default function MyRefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    refundsApi.getAll({ page: 1, page_size: 100 })
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setRefunds(data);
      })
      .catch((err) => {
        console.error("Failed to fetch refunds", err);
        toast.error("Gagal memuat daftar pengembalian dana.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "pending" || s === "pending_confirmation") return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold">Menunggu Konfirmasi</span>;
    if (s === "approved" || s === "processed") return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">Diproses</span>;
    if (s === "completed") return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">Dana Dikembalikan</span>;
    if (s === "rejected") return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">Ditolak</span>;
    
    // Fallback formatting for unexpected statuses
    const formatted = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">{formatted}</span>;
  };

  return (
    <PageSection
      title="Daftar Pengembalian"
      description="Lacak status pengajuan refund dan pengembalian dana Anda."
      className="bg-slate-50 min-h-screen"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Memuat data refund...</p>
              </div>
            </div>
          ) : refunds.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-slate-200">
              <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                <RefreshCcw className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Belum Ada Pengajuan Refund</h3>
              <p className="mb-6 max-w-sm text-sm text-slate-500">
                Anda belum pernah mengajukan pengembalian dana atau komplain produk.
              </p>
              <Button asChild className="rounded-xl">
                <Link href="/account/orders">Lihat Daftar Pesanan</Link>
              </Button>
            </Card>
          ) : (
            refunds.map((refund) => (
              <Card key={refund.id} className="overflow-hidden border border-slate-200 transition-shadow hover:shadow-md">
                <div className="flex flex-col border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">#{refund.refund_number || refund.id.substring(0, 8)}</span>
                      <span className="text-sm text-slate-500">•</span>
                      <span className="text-sm text-slate-500">{formatDateTime(refund.created_at)}</span>
                    </div>
                    {getStatusBadge(refund.refund_status)}
                  </div>
                  <div className="mt-4 text-left sm:mt-0 sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pengembalian</p>
                    <p className="text-lg font-black text-primary">{formatCurrency(refund.refund_amount || 0)}</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 overflow-hidden relative mt-1">
                      {(() => {
                        if (!refund.evidence_url) return <Package className="h-6 w-6" />;
                        let firstImg = refund.evidence_url;
                        try {
                          const parsed = JSON.parse(refund.evidence_url);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            firstImg = parsed[0];
                          }
                        } catch {}
                        return (
                          <img
                            src={firstImg}
                            alt="Bukti Komplain"
                            className="h-full w-full object-cover"
                          />
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm mb-1">
                        Untuk Pesanan #{refund.order_id.substring(0, 8)}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        "{refund.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <Button asChild size="sm" className="rounded-xl px-6">
                      <Link href={`/account/refunds/${refund.order_id}`}>Cek Status Detail</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageSection>
  );
}
