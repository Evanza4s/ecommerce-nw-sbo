import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { shippingApi } from '@/server/modules/shipping/api';
import type { Shipping } from '@/server/modules/shipping/types';

interface UseAdminShippingProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useAdminShipping({ initialPage = 1, initialLimit = 10 }: UseAdminShippingProps = {}) {
  const [shippings, setShippings] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchShippings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number> = {
        page,
        page_size: limit,
      };

      if (searchQuery) {
        params.tracking_number = searchQuery;
      }

      if (statusFilter && statusFilter !== 'all') {
        params.shipping_status = statusFilter;
      }

      const response = await shippingApi.getAll(params);
      
      if (response.status && response.data) {
        setShippings(response.data);
        if (response.pagination) {
          setTotalItems(response.pagination.total || 0);
          setTotalPages(response.pagination.total_pages || 0);
        }
      } else {
        setShippings([]);
        toast.error(response.message || 'Gagal memuat data pengiriman');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data pengiriman');
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchShippings();
  }, [fetchShippings]);

  return {
    shippings,
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
    refresh: fetchShippings,
  };
}
