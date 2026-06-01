import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ============================================
// 공통 타입
// ============================================

export interface ApiResponse<T = unknown> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

export interface ApiError {
  timestamp: string;
  code: string;
  message: string;
  result: string;
}

// 페이지네이션 응답 공통 구조
export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  last: boolean;
  empty: boolean;
}

// 페이지네이션 요청 파라미터
export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
}

// 토큰 재발급 응답 (인터셉터 내부에서 사용)
export interface ReissueTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ============================================
// Custom Error Type
// ============================================

export interface ApiException extends Error {
  code: string;
  timestamp: string;
  result?: string;
}

export function createApiException(
  code: string,
  message: string,
  timestamp: string,
  result?: string,
): ApiException {
  const error = new Error(message) as ApiException;
  error.name = 'ApiException';
  error.code = code;
  error.timestamp = timestamp;
  error.result = result;
  return error;
}

// ============================================
// Axios Instance
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - accessToken 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      const accessToken = state?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - 에러 처리 및 토큰 자동 재발급
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;

      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const refreshToken = state?.refreshToken;

          if (refreshToken) {
            console.log('토큰 재발급 시도...');

            const { data } = await axios.post<ApiResponse<ReissueTokenResponse>>(
              `${BASE_URL}/api/auth/reissue`,
              { refreshToken },
            );

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
              data.result;

            console.log('토큰 재발급 성공');

            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('❌ 토큰 재발급 실패, 로그아웃 처리:', refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data) {
      const apiError = error.response.data;
      throw createApiException(
        apiError.code || 'UNKNOWN_ERROR',
        apiError.message || '요청에 실패했습니다.',
        apiError.timestamp || new Date().toISOString(),
        apiError.result,
      );
    }

    throw error;
  },
);

export { apiClient };
