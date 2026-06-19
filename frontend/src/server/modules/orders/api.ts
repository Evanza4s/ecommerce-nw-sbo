import { getApi, postApi, putApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { CheckoutRequest, CheckoutResponseData, Order, RevenueStatsResponse, UpdateOrderStatusRequest } from './types';

export const ordersApi = {
  checkout: async (data: CheckoutRequest) => {
    return postApi<AuthResponse<CheckoutResponseData>>('/orders/checkout', data);
  },

  getAll: async (params?: Record<string, string | number>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/orders${queryString ? `?${queryString}` : ''}`;
    // Type uses AuthResponse<Order[]> for simplification, though pagination usually has a different wrapper
    return getApi<any>(url);
  },

  getMyOrders: async () => {
    return getApi<AuthResponse<Order[]>>(`/orders/my-orders`);
  },

  getById: async (id: string) => {
    return getApi<AuthResponse<Order>>(`/orders/${id}`);
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest) => {
    return putApi<AuthResponse<null>>(`/orders/${id}/status`, data);
  },

  getSnapToken: async (id: string) => {
    return getApi<AuthResponse<{ snap_token: string }>>(`/orders/${id}/pay`);
  },

  getRevenueStats: async () => {
    return getApi<AuthResponse<RevenueStatsResponse>>(`/orders/revenue/stats`);
  },
};
