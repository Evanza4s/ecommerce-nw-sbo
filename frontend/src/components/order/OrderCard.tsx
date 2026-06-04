import React from 'react'
import Card from '../ui/Card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { userRoutes } from '@/lib/user-routes';
import Image from 'next/image';
import OrderBadge from './OrderBadge';

interface OrderItem {
  name: string;
  variant: string;
  qty: number;
  image: string;
}

export interface OrderData {
  id: string;
  status: string;
  total: string;
  date: string;
  items: OrderItem[];
}

const OrderCard = ({order}: {order: OrderData}) => {
  return (
<Card className="border-slate-200 overflow-hidden transition-shadow">

      <div className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50/80 p-4 sm:px-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold text-slate-900">{order.id}</span>
          <span className="text-slate-400">|</span>
          <span className="font-medium text-slate-500">{order.date}</span>
        </div>
        <OrderBadge status={order.status} />
      </div>

      <div className="flex flex-col justify-between gap-6 p-4 md:flex-row md:items-center sm:p-6">

        <div className="flex flex-1 gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* <Image 
              src={order.items[0].image} 
              alt={order.items[0].name} 
              fill 
              className="object-cover" 
            /> */}
          </div>
          <div className="space-y-1">
            <h4 className="line-clamp-1 font-bold text-slate-900">{order.items[0].name}</h4>
            <p className="text-sm text-slate-500">{order.items[0].variant}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Qty: {order.items[0].qty}
            </p>
            {order.items.length > 1 && (
              <p className="mt-1 text-xs font-semibold text-primary">
                +{order.items.length - 1} produk lainnya
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col border-t border-slate-100 pt-4 md:items-end md:justify-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Belanja</p>
          <p className="text-xl font-black text-slate-900">{order.total}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/30 p-4 sm:px-6">
        <Button asChild variant="outline" size="sm">
          <Link href={userRoutes.orderDetail(order.id)}>View Detail</Link>
        </Button>

        {order.status === "Shipped" && (
          <Button asChild size="sm">
            <Link href={userRoutes.orderVerify(order.id)}>Verify Received</Link>
          </Button>
        )}
        {order.status === "Pending" && (
          <Button size="sm">Pay Now</Button>
        )}
      </div>

    </Card>
  )
}

export default OrderCard