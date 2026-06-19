// ============================================================
// USER ROLE TYPE — matches mst_roles.role_name values in DB
// ============================================================

export type UserRole = 'customer' | 'admin' | 'super admin';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// AUTH STATE
// ============================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================
// AUTH CREDENTIALS
// ============================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

// ============================================================
// OTP
// ============================================================

export interface OtpVerification {
  email: string;
  otpCode: string;
  otpType: 'verification' | 'forgot_password' | 'change_email' | 'two_factor';
}

// ============================================================
// PASSWORD RESET
// ============================================================

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================
// SESSION
// ============================================================

export interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  loginAt: string;
  lastActivityAt: string;
  expiredAt: string;
  isCurrent: boolean;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  status: 'success' | 'failed';
  code: number;
  message: string;
  data: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  access_token_expiry: number;
  refresh_token_expiry: number;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
  email: string;
}
