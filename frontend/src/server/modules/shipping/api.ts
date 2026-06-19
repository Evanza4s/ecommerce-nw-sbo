import { getApi, postApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { ShippingRatesRequest, ShippingRatesResponseData } from './types';

export const shippingApi = {
  getRates: async (data: ShippingRatesRequest) => {
    return postApi<AuthResponse<ShippingRatesResponseData>>('/shipping/rates', data);
  },

  getAll: async (params?: Record<string, string | number>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/shipping/get-all${queryString ? `?${queryString}` : ''}`;
    return getApi<any>(url);
  },

  getProvinces: async () => {
    return getApi<AuthResponse<import('./types').Province[]>>('/shipping/provinces');
  },

  getCities: async (provinceId: string) => {
    return getApi<AuthResponse<import('./types').City[]>>(`/shipping/cities?province_id=${provinceId}`);
  },

  getDistricts: async (cityId: string) => {
    return getApi<AuthResponse<import('./types').District[]>>(`/shipping/districts/${cityId}`);
  },
};
