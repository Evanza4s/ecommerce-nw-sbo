import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ordersApi } from "@/server/modules/orders/api";
import type { Order, UpdateOrderStatusRequest } from "@/server/modules/orders/types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await ordersApi.getAll(params);
      
      if (res.data) {
        setOrders(res.data);
        setTotal(res.pagination?.total || 0);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, data: UpdateOrderStatusRequest) => {
    try {
      await ordersApi.updateStatus(id, data);
      toast.success("Order status updated successfully");
      await fetchOrders(); // refresh data
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
      return false;
    }
  };

  return {
    orders,
    loading,
    error,
    page,
    limit,
    total,
    search,
    statusFilter,
    setPage,
    setLimit,
    setSearch,
    setStatusFilter,
    updateStatus,
    refresh: fetchOrders,
  };
}
