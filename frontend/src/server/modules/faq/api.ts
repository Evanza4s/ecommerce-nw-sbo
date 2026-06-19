import { getApi, postApi, putApi, deleteApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { FAQ, FAQRequest, FAQListResponse } from './types';

export const faqApi = {
  getAll: async (params?: Record<string, string | number | boolean>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const endpoint = params ? '/faq/get-all' : '/faq';
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    return getApi<AuthResponse<FAQListResponse>>(url);
  },

  getById: async (id: string) => {
    return getApi<AuthResponse<FAQ>>(`/faq/${id}`);
  },

  create: async (data: FAQRequest) => {
    return postApi<AuthResponse<FAQ>>('/faq', data);
  },

  update: async (id: string, data: FAQRequest) => {
    return putApi<AuthResponse<FAQ>>(`/faq/${id}`, data);
  },

  delete: async (id: string) => {
    return deleteApi<AuthResponse<null>>(`/faq/${id}`);
  },
};
