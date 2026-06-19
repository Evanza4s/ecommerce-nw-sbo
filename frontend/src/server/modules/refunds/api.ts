import { getApi, postApi, putApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { RefundRequest, Refund } from './types';

export const refundsApi = {
  create: async (data: RefundRequest) => {
    return postApi<AuthResponse<Refund>>('/refunds', data);
  },

  getAll: async (params?: Record<string, string | number>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/refunds${queryString ? `?${queryString}` : ''}`;
    return getApi<any>(url);
  },

  getById: async (id: string) => {
    return getApi<AuthResponse<Refund>>(`/refunds/${id}`);
  },

  updateStatus: async (id: string, status: string, adminNotes?: string) => {
    return putApi<AuthResponse<Refund>>(`/refunds/${id}/status`, { refund_status: status, admin_notes: adminNotes });
  },
};
