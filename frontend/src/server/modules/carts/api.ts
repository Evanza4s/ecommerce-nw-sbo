import { getApi, postApi, putApi, deleteApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type { Cart, CartItem } from './types';

export const cartsApi = {
  get: async () => {
    return getApi<AuthResponse<Cart>>('/carts');
  },

  addItem: async (data: { product_variant_id: string; quantity: number }) => {
    return postApi<AuthResponse<CartItem>>('/carts/items', data);
  },

  updateItem: async (itemId: string, data: { quantity: number }) => {
    return putApi<AuthResponse<CartItem>>(`/carts/items/${itemId}`, data);
  },

  deleteItem: async (itemId: string) => {
    return deleteApi<AuthResponse<null>>(`/carts/items/${itemId}`);
  },

  clearCart: async () => {
    return deleteApi<AuthResponse<null>>('/carts');
  },
};
