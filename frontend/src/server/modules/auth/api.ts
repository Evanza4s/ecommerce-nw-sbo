import { postApi } from '../../core/client';
import type {
  AuthResponse,
  LoginData,
  RegisterData,
  BasicSuccessData,
  RefreshTokenData
} from './types';

export const authApi = {
  login: async (email: string, password: string, rememberMe?: boolean) => {
    return postApi<AuthResponse<LoginData>>('/auth/login', { email, password, remember_me: rememberMe });
  },

  register: async (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    return postApi<AuthResponse<RegisterData>>('/auth/register', {
      email: data.email,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      firstName: data.firstName,
      lastName: data.lastName
    });
  },

  verifyOtp: async (email: string, otp_code: string, otp_type: string = 'verification') => {
    return postApi<AuthResponse<BasicSuccessData>>('/auth/verify-otp', { email, otp_code, otp_type });
  },

  resendOtp: async (email: string, otp_type: string = 'verification') => {
    return postApi<AuthResponse<BasicSuccessData>>('/auth/resend-otp', { email, otp_type });
  },

  refreshToken: async (refresh_token: string) => {
    return postApi<AuthResponse<RefreshTokenData>>('/auth/refresh-token', { refresh_token });
  },

  logout: async (allDevices?: boolean) => {
    return postApi<AuthResponse<BasicSuccessData>>('/auth/logout', { all_devices: allDevices });
  },

  forgotPassword: async (email: string) => {
    return postApi<AuthResponse<BasicSuccessData>>('/auth/forgot-password', { email });
  },

  resetPassword: async (data: {
    email: string;
    otp_code: string;
    new_password: string;
    confirm_password: string;
  }) => {
    return postApi<AuthResponse<null>>('/auth/reset-password', data);
  },
};
