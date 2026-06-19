import { getApi, putApi, postApi, deleteApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { UserProfile, UserIdentity, UserAddress } from './types';

// ============================================================
// PROFILE API
// ============================================================
export const profileApi = {
  get: async () => {
    return getApi<AuthResponse<UserProfile>>('/users/profile');
  },

  update: async (data: { fullname?: string; username?: string }) => {
    return putApi<AuthResponse<{ id: string; email: string; username: string; fullname: string }>>('/users/profile', data);
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    return putApi<AuthResponse<null>>('/users/change-password', data);
  },
};

// ============================================================
// IDENTITY API
// ============================================================
export const identityApi = {
  get: async (userId: string) => {
    return getApi<AuthResponse<UserIdentity>>(`/user-identities/${userId}/identity`);
  },

  update: async (userId: string, data: Partial<UserIdentity>) => {
    return putApi<AuthResponse<UserIdentity>>(`/user-identities/${userId}/identity`, data);
  },

  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Custom fetch for FormData (omit Content-Type so browser sets boundary)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || getCookie('accessToken')) : null;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/user-identities/${userId}/avatar`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      if (errData && errData.message) {
        throw new Error(errData.message);
      }
      throw new Error(`Upload failed with status ${response.status}`);
    }
    return response.json();
  },
};

// ============================================================
// ADDRESS API
// ============================================================
export const addressApi = {
  getAll: async (userId: string) => {
    return getApi<AuthResponse<UserAddress[]>>(`/addresses/${userId}/addresses`);
  },

  create: async (userId: string, data: Omit<UserAddress, 'id' | 'user_id'>) => {
    return postApi<AuthResponse<{ id: string; user_id: string; receiver_name: string; is_default: boolean }>>(`/addresses/${userId}/addresses`, data);
  },

  update: async (userId: string, addressId: string, data: Partial<UserAddress>) => {
    return putApi<AuthResponse<{ id: string }>>(`/addresses/${userId}/addresses/${addressId}`, data);
  },

  delete: async (userId: string, addressId: string) => {
    return deleteApi<AuthResponse<null>>(`/addresses/${userId}/addresses/${addressId}`);
  },

  setDefault: async (userId: string, addressId: string) => {
    return putApi<AuthResponse<null>>(`/addresses/${userId}/addresses/${addressId}/default`);
  },
};

export const userApi = {
  ...profileApi,
  
  // Admin Methods
  getAll: async (params?: Record<string, string | number>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    return getApi<any>(url);
  },
  
  getById: async (id: string) => {
    return getApi<AuthResponse<UserProfile>>(`/users/${id}`);
  },

  delete: async (id: string) => {
    return deleteApi<AuthResponse<null>>(`/users/${id}`);
  },

  updateStatus: async (id: string, is_active: boolean) => {
    return putApi<AuthResponse<null>>(`/users/${id}/status`, { is_active });
  },

  updateRole: async (id: string, role_id: string) => {
    return putApi<AuthResponse<null>>(`/users/${id}/role/${role_id}`);
  },

  identity: identityApi,
  address: addressApi,
};
