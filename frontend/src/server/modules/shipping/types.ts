import { AuthResponse } from '../auth/types';

export interface ShippingRatesRequest {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

export interface ShippingCost {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingRatesResponseData {
  courier: string;
  name: string;
  costs: ShippingCost[];
}

export interface Shipping {
  id: string;
  order_id: string;
  courier_name: string;
  service_name: string;
  tracking_number: string;
  shipping_status: string;
  estimated_arrival?: string | null;
  delivered_at?: string | null;
  created_at: string;
	updated_at: string;
	OrderRef?: any;
}

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  city_name: string;
  province_id: string;
  province: string;
  type: string;
  postal_code: string;
}

export interface District {
  district_id: string;
  district_name: string;
  city_id: string;
}
