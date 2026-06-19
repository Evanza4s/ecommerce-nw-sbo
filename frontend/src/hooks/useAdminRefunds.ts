import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { refundsApi } from '@/server/modules/refunds/api';
import type { Refund } from '@/server/modules/refunds/types';

interface UseAdminRefundsProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useAdminRefunds({ initialPage = 1, initialLimit = 10 }: UseAdminRefundsProps = {}) {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number> = {
        page,
        page_size: limit,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await refundsApi.getAll(params);
      
      if (response.status && response.data) {
        setRefunds(response.data);
        if (response.pagination) {
          setTotalItems(response.pagination.total || 0);
          setTotalPages(response.pagination.total_pages || 0);
        }
      } else {
        setRefunds([]);
        toast.error(response.message || 'Gagal memuat data pengembalian dana');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data pengembalian dana');
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  return {
    refunds,
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
    refresh: fetchRefunds,
  };
}
