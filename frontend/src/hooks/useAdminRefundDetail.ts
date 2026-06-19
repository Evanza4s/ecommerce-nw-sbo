import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { refundsApi } from '@/server/modules/refunds/api';
import type { Refund } from '@/server/modules/refunds/types';

export function useAdminRefundDetail(id: string) {
  const [refund, setRefund] = useState<Refund | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRefund = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await refundsApi.getById(id);
      
      if (response.status && response.data) {
        setRefund(response.data);
      } else {
        setRefund(null);
        toast.error(response.message || 'Gagal memuat detail pengembalian dana');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat detail pengembalian dana');
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRefund();
  }, [fetchRefund]);

  const updateRefundStatus = async (status: string, adminNotes?: string) => {
    try {
      const response = await refundsApi.updateStatus(id, status, adminNotes);
      if (response.status) {
        toast.success(`Refund status updated to ${status}`);
        fetchRefund(); // Refresh the data
        return true;
      } else {
        toast.error(response.message || 'Failed to update refund status');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating refund status');
      return false;
    }
  };

  return {
    refund,
    loading,
    error,
    refresh: fetchRefund,
    updateRefundStatus,
  };
}
