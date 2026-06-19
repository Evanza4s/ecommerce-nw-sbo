export interface AuthResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'super admin';
  is_active: boolean;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  access_token_expiry: number;
  refresh_token_expiry: number;
  user: User;
}

export interface RegisterData {
  success: boolean;
  message: string;
  userId: string;
  email: string;
}

export interface BasicSuccessData {
  success: boolean;
  message: string;
}

export interface RefreshTokenData {
  success: boolean;
  message: string;
  access_token: string;
  access_token_expiry: number;
  session_id: string;
}
