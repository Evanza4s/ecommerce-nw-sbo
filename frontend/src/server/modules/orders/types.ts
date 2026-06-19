import { AuthResponse } from '../auth/types';
import type { UserAddress } from '../users/types';

export interface CheckoutRequest {
  address_id: string;
  courier: string;
  shipping_service: string;
  shipping_cost: number;
  voucher_code?: string;
}

export interface CheckoutResponseData {
  order_id: string;
  order_number: string;
  redirect_url: string;
  snap_token: string;
}

export interface OrderItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  // Related variant/product data will be here depending on backend preload
  ProductVariantRef?: any;
}

export interface OrderPayment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
}

export interface OrderShipping {
  id: string;
  shipping_method: string;
  tracking_number: string;
  shipping_status: string;
}

export interface OrderUser {
  id: string;
  fullname: string;
  email: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  address_id: string;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_cost: number;
  grand_total: number;
  order_status: string;
  payment_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  
  UserRef?: OrderUser;
  AddressRef?: UserAddress;
  Items?: OrderItem[];
  Payment?: OrderPayment;
  Shipping?: OrderShipping;
}

export interface UpdateOrderStatusRequest {
  order_status?: string;
  payment_status?: string;
  shipping_status?: string;
  tracking_number?: string;
}

export interface DailyRevenue {
  label: string;
  value: number;
}

export interface TopProduct {
  name: string;
  revenue: string;
}

export interface RevenueStatsResponse {
  revenue_data: DailyRevenue[];
  top_products: TopProduct[];
  total_revenue: string;
  average_order_value: string;
  growth: string;
}
