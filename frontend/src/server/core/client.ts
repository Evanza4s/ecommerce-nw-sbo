import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './errors';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Ngrok free tier shows an interstitial page unless this header is present
const isNgrok = API_BASE_URL.includes('ngrok');

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(isNgrok ? { 'ngrok-skip-browser-warning': 'true' } : {}),
  },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token' && originalRequest.url !== '/auth/login') {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = 'Bearer ' + token;
          }
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? (localStorage.getItem('refreshToken') || Cookies.get('refreshToken')) : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(new ApiError('Unauthorized. Session expired.', 401, 'error'));
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refresh_token: refreshToken
        });

        const newToken = data?.data?.access_token;
        if (newToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newToken);
          Cookies.set('accessToken', newToken, { expires: 1, path: '/' });

          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = 'Bearer ' + newToken;
          }

          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token returned from refresh endpoint');
        }
      } catch (err) {
        processQueue(err as Error, null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(new ApiError('Session expired. Please login again.', 401, 'error'));
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const data = error.response.data;

      let errorMessage = data?.message || error.message || 'API request failed';
      if (data?.error_fields && Array.isArray(data.error_fields) && data.error_fields.length > 0) {
        errorMessage = data.error_fields[0].message || errorMessage;
      }

      throw new ApiError(
        errorMessage,
        error.response.status,
        data?.status || 'error',
        data?.data
      );
    } else if (error.request) {
      throw new ApiError('No response received from server', 503, 'timeout');
    } else {
      throw new ApiError(error.message, 500, 'error');
    }
  }
);

export const getApi = <T>(url: string, config?: any): Promise<T> => apiClient.get<any, T>(url, config);
export const postApi = <T>(url: string, data?: any, config?: any): Promise<T> => apiClient.post<any, T>(url, data, config);
export const putApi = <T>(url: string, data?: any, config?: any): Promise<T> => apiClient.put<any, T>(url, data, config);
export const deleteApi = <T>(url: string, config?: any): Promise<T> => apiClient.delete<any, T>(url, config);
