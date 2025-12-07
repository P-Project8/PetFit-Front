import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

// API Base URL
// API Base URL
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://43.200.89.199:8080';

// ============================================
// Type Definitions
// ============================================

// 공통 API 응답 형식
export interface ApiResponse<T = unknown> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

// 에러 응답
export interface ApiError {
  timestamp: string;
  code: string;
  message: string;
  result: string;
}

// 이메일 인증 코드 검증 응답
export interface VerifyEmailResponse {
  verified: boolean;
  expiresInSec: number;
}

// 회원가입 요청
export interface SignupRequest {
  email: string;
  userId: string;
  password: string;
  name: string;
  birth: string;
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 토큰 재발급 응답
export interface ReissueTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 사용자 프로필
export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  birth: string;
}

// 프로필 수정 요청
export interface UpdateProfileRequest {
  name?: string;
  birth?: string;
  currentPassword?: string;
  newPassword?: string;
  passwordChangeValid?: boolean;
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
  result?: string
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
    // authStore에서 토큰 가져오기 (동적으로)
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
  }
);

// Response Interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    // 401 에러이고, refresh 시도를 안했다면
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;

      try {
        // refreshToken으로 재발급 시도
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const refreshToken = state?.refreshToken;

          if (refreshToken) {
            console.log('토큰 재발급 시도...');

            const { data } = await axios.post<
              ApiResponse<ReissueTokenResponse>
            >(`${BASE_URL}/api/auth/reissue`, { refreshToken });

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = data.result;

            console.log('토큰 재발급 성공');

            // authStore의 setTokens 사용하여 업데이트
            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // refresh 실패 → 로그아웃
        console.error('❌ 토큰 재발급 실패, 로그아웃 처리:', refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // API 에러를 ApiException으로 변환
    if (error.response?.data) {
      const apiError = error.response.data;
      throw createApiException(
        apiError.code || 'UNKNOWN_ERROR',
        apiError.message || '요청에 실패했습니다.',
        apiError.timestamp || new Date().toISOString(),
        apiError.result
      );
    }

    throw error;
  }
);

// ============================================
// Email Verification API
// ============================================

/**
 * 이메일 인증 코드 발송
 * POST /api/email/verification/send
 */
export async function sendVerificationCode(
  email: string
): Promise<ApiResponse> {
  const { data } = await apiClient.post('/api/email/verification/send', {
    email,
  });
  return data;
}

/**
 * 이메일 인증 코드 검증
 * POST /api/email/verification/verify
 */
export async function verifyEmail(
  email: string,
  verificationCode: string
): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.post('/api/email/verification/verify', {
    email,
    verificationCode,
  });
  return data.result;
}

// ============================================
// Auth API
// ============================================

/**
 * 회원가입
 * POST /api/auth/signup
 */
export async function signup(requestData: SignupRequest): Promise<ApiResponse> {
  const { data } = await apiClient.post('/api/auth/signup', requestData);
  return data;
}

/**
 * 로그인
 * POST /api/auth/login
 */
export async function login(
  userId: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    { userId, password }
  );
  return data.result;
}

/**
 * 토큰 재발급
 * POST /api/auth/reissue
 */
export async function reissueToken(
  refreshToken: string
): Promise<ReissueTokenResponse> {
  const { data } = await apiClient.post<ApiResponse<ReissueTokenResponse>>(
    '/api/auth/reissue',
    { refreshToken }
  );
  return data.result;
}

/**
 * 로그아웃
 * DELETE /api/auth/logout
 */
export async function logout(): Promise<ApiResponse> {
  const { data } = await apiClient.delete('/api/auth/logout');
  return data;
}

/**
 * 인증 확인
 * POST /api/auth/verify
 */
export async function verifyAuth(): Promise<ApiResponse> {
  const { data } = await apiClient.post('/api/auth/verify');
  return data;
}

// ============================================
// Profile API
// ============================================

/**
 * 프로필 조회
 * GET /api/auth/profile
 */
export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiResponse<UserProfile>>(
    '/api/auth/profile'
  );
  return data.result;
}

/**
 * 프로필 수정
 * PATCH /api/auth/profile
 */
export async function updateProfile(
  requestData: UpdateProfileRequest
): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>(
    '/api/auth/profile',
    requestData
  );
  return data;
}

// ============================================
// Export axios instance (필요시 사용)
// ============================================

export { apiClient };
