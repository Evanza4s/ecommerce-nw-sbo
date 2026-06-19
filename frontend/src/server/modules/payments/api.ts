import { getApi } from '../../core/client';
import type { Payment } from './types';

export const paymentsApi = {
  getAll: async (params?: Record<string, string | number>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/payments/get-all${queryString ? `?${queryString}` : ''}`;
    return getApi<any>(url);
  },
};
