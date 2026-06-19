import { AuthResponse } from '../auth/types';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullname: string;
  role_id: string;
  role_name: string;
  is_active: boolean;
  is_verified: boolean;
  identity?: UserIdentity;
  addresses?: UserAddress[];
}

export interface UserIdentity {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender?: string;
  birth_place?: string;
  birth_date?: string;
  avatar_url?: string;
}

export interface UserAddress {
  street: any;
  district_id: string;
  id: string;
  user_id?: string;
  receiver_name: string;
  phone_number: string;
  province_id: string;
  province: string;
  city_id: string;
  city: string;
  district: string;
  village: string;
  postal_code: string;
  full_address: string;
  address_label?: string;
  is_default: boolean;
  latitude?: number;
  longitude?: number;
}
