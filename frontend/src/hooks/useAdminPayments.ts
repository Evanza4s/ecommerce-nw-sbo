import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { paymentsApi } from '@/server/index';
import type { Payment } from '@/server/modules/payments/types';

interface UseAdminPaymentsProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useAdminPayments({ initialPage = 1, initialLimit = 10 }: UseAdminPaymentsProps = {}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number> = {
        page,
        page_size: limit,
      };

      if (searchQuery) {
        params.payment_reference = searchQuery;
      }

      if (statusFilter && statusFilter !== 'all') {
        params.payment_status = statusFilter;
      }

      const response = await paymentsApi.getAll(params);
      
      if (response.status && response.data) {
        setPayments(response.data);
        if (response.pagination) {
          setTotalItems(response.pagination.total || 0);
          setTotalPages(response.pagination.total_pages || 0);
        }
      } else {
        setPayments([]);
        toast.error(response.message || 'Gagal memuat data payment');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat payment');
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      setPage,
      setLimit,
    },
    filters: {
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
    },
    refresh: fetchPayments,
  };
}
