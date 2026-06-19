import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order } from "@/server/modules/orders/types";

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await ordersApi.getMyOrders();
      
      if (res.data) {
        // Backend returns the orders directly as res.data
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    setOrders,
  };
}
