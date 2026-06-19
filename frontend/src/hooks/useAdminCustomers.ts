import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { userApi } from "@/server/modules/users/api";

export function useAdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000); // Fetch all for client side pagination
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await userApi.getAll({
        page,
        page_size: limit, // the backend pagination dto uses page_size
      });
      
      if (res.data) {
        setCustomers(res.data);
        setTotal(res.pagination?.total || 0);
      } else {
        setCustomers([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    refresh: fetchCustomers,
  };
}
