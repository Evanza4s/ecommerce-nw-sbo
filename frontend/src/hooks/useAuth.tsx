'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '@/server';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/user.types';

// ============================================================
// AUTH CONTEXT
// ============================================================

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<{ userId: string; email: string }>;
  verifyOtp: (email: string, otpCode: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otpCode: string, newPassword: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // Also check cookies as a fallback if localStorage somehow doesn't have it but cookie does (or sync them)
        const cookieToken = Cookies.get('accessToken');
        if (cookieToken && !storedToken) {
          localStorage.setItem('accessToken', cookieToken);
        }

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (storedRefreshToken) {
          // Try to refresh token if access token is missing
          await refreshAccessToken();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for auth:logout event from API interceptor
  useEffect(() => {
    const handleLogoutEvent = () => {
      clearAuth();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogoutEvent);
      return () => window.removeEventListener('auth:logout', handleLogoutEvent);
    }
  }, []);

  // ============================================================
  // AUTH ACTIONS
  // ============================================================

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await authApi.login(credentials.email, credentials.password, credentials.rememberMe);
      const { data } = response;

      // Store tokens
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);

      // Store in cookies for middleware
      Cookies.set('accessToken', data.access_token, { expires: 1, path: '/' });
      Cookies.set('refreshToken', data.refresh_token, { expires: 30, path: '/' });
      Cookies.set('userRole', data.user.role, { expires: 1, path: '/' });

      // Map user data
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        avatar: data.user.avatar,
        role: data.user.role,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
      };

      localStorage.setItem('user', JSON.stringify(userData));

      setToken(data.access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Return user so callers can redirect based on role
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register({
        email: data.email,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      return {
        userId: response.data.userId,
        email: response.data.email,
      };
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email: string, otpCode: string) => {
    try {
      await authApi.verifyOtp(email, otpCode, 'verification');
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      await authApi.resendOtp(email, 'verification');
    } catch (error) {
      throw error;
    }
  };

  const logout = async (allDevices?: boolean) => {
    try {
      await authApi.logout(allDevices);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, otpCode: string, newPassword: string) => {
    try {
      await authApi.resetPassword({
        email,
        otp_code: otpCode,
        new_password: newPassword,
        confirm_password: newPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authApi.refreshToken(refreshToken);
      const { data } = response;

      localStorage.setItem('accessToken', data.access_token);
      Cookies.set('accessToken', data.access_token, { expires: 1, path: '/' });
      setToken(data.access_token);
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// USE AUTH HOOK
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
