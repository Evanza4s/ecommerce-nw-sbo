"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AdminPageSection from "@/components/ui/AdminPageSection";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";

interface OrderStatusPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    let isMounted = true;
    ordersApi.getById(id)
      .then((res) => {
        if (isMounted && res.data) {
          const o = res.data;
          setOrder(o);
          setPaymentStatus(o.payment_status || "Pending");
          setOrderStatus(o.order_status || "Pending");
          setShippingStatus(o.Shipping?.shipping_status || "Pending");
          setTrackingNumber(o.Shipping?.tracking_number || "");
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await ordersApi.updateStatus(id, {
        payment_status: paymentStatus,
        order_status: orderStatus,
        shipping_status: shippingStatus,
        tracking_number: trackingNumber,
      });
      toast.success("Status updated successfully!");
      router.push(`/admin/orders/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading order...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <AdminPageSection
      title={`Update Status: #${order.order_number}`}
      description="Update payment, shipping, and fulfillment statuses."
    >
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.order_number, href: `/admin/orders/${order.id}` },
          { label: "Update Status" },
        ]}
      />

      <div className="mt-8 max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Payment Status</label>
              <select 
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Order Status</label>
              <select 
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Shipping Status</label>
              <select 
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tracking Number (Resi)</label>
              <input 
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (optional)"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageSection>
  );
}
