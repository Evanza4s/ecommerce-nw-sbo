import React from 'react'
import Card from '../ui/Card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { userRoutes } from '@/lib/user-routes';
import Image from 'next/image';
import AdminStatusBadge from '../admin/AdminStatusBadge';
import type { Order } from '@/server/modules/orders/types';
import { formatCurrency, formatDateTime } from '@/lib/admin';
import { getImageUrl } from '@/lib/utils';
import { Package, Loader2 } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onPayNow?: (orderId: string) => void;
  isPaying?: boolean;
}

const OrderCard = ({ order, onPayNow, isPaying }: OrderCardProps) => {
  return (
    <Card className="border-slate-200 overflow-hidden transition-shadow">

      <div className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50/80 p-4 sm:px-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold text-slate-900">{order.order_number}</span>
          <span className="text-slate-400">|</span>
          <span className="font-medium text-slate-500">{formatDateTime(order.created_at)}</span>
        </div>
        <AdminStatusBadge status={order.order_status?.toLowerCase() || order.payment_status?.toLowerCase() || "pending"} />
      </div>

      <div className="flex flex-col justify-between gap-6 p-4 md:flex-row md:items-center sm:p-6">

        <div className="flex flex-1 gap-4">
          <div className="relative h-20 w-20 flex items-center justify-center shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm text-slate-400">
            {order.Items?.[0]?.ProductVariantRef?.ProductRef?.thumbnail_url ? (
              <Image
                src={getImageUrl(order.Items[0].ProductVariantRef.ProductRef.thumbnail_url) || ""}
                alt={order.Items[0].ProductVariantRef.ProductRef.product_name || "Produk"}
                fill
                className="object-cover"
              />
            ) : (
              <Package className="h-8 w-8" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="line-clamp-1 font-bold text-slate-900">
              {order.Items?.[0]?.ProductVariantRef?.ProductRef?.product_name || `Produk ID: ${order.Items?.[0]?.product_variant_id || "-"}`}
            </h4>
            <p className="text-sm text-slate-500">
              {order.Items?.[0]?.ProductVariantRef?.variant_name || "-"}
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Qty: {order.Items?.[0]?.quantity || 0}
            </p>
            {(order.Items?.length || 0) > 1 && (
              <p className="mt-1 text-xs font-semibold text-primary">
                +{(order.Items?.length || 0) - 1} produk lainnya
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col border-t border-slate-100 pt-4 md:items-end md:justify-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Belanja</p>
          <p className="text-xl font-black text-slate-900">{formatCurrency(order.grand_total)}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/30 p-4 sm:px-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/account/orders/${order.id}`}>View Detail</Link>
        </Button>
        
        {order.order_status?.toLowerCase() === "shipped" && (
          <Button asChild size="sm">
            <Link href={`/account/orders/${order.id}`}>Lacak Pengiriman</Link>
          </Button>
        )}

        {order.order_status?.toLowerCase() === "delivered" && (
          <>
            <Button asChild variant="secondary" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100">
              <Link href={`/account/refunds/request?orderId=${order.id}`}>Ajukan Refund</Link>
            </Button>
            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href={`/account/orders/${order.id}`}>Verifikasi Diterima</Link>
            </Button>
          </>
        )}

        {(order.order_status?.toLowerCase() === "pending" || order.payment_status?.toLowerCase() === "pending") && (
          <Button size="sm" onClick={() => onPayNow && onPayNow(order.id)} disabled={isPaying}>
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
              </>
            ) : "Pay Now"}
          </Button>
        )}
      </div>

    </Card>
  )
}

export default OrderCard