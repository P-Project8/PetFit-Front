import { apiClient } from './client';
import type { ApiResponse, ReissueTokenResponse } from './client';

// ============================================
// Auth Types
// ============================================

export interface VerifyEmailResponse {
  verified: boolean;
  expiresInSec: number;
}

export interface SignupRequest {
  email: string;
  userId: string;
  password: string;
  name: string;
  birth: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  birth: string;
}

export interface UpdateProfileRequest {
  name: string;
  birth: string;
  currentPassword?: string;
  newPassword?: string;
  passwordChangeValid?: boolean;
}

export type { ReissueTokenResponse };

// ============================================
// Email Verification API
// ============================================

/**
 * 이메일 인증 코드 발송
 * POST /api/email/verification/send
 */
export async function sendVerificationCode(email: string): Promise<ApiResponse> {
  const { data } = await apiClient.post('/api/email/verification/send', { email });
  return data;
}

/**
 * 이메일 인증 코드 검증
 * POST /api/email/verification/verify
 */
export async function verifyEmail(
  email: string,
  verificationCode: string,
): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
    '/api/email/verification/verify',
    { email, verificationCode },
  );
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
export async function login(userId: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    { userId, password },
  );
  return data.result;
}

/**
 * 토큰 재발급
 * POST /api/auth/reissue
 */
export async function reissueToken(refreshToken: string): Promise<ReissueTokenResponse> {
  const { data } = await apiClient.post<ApiResponse<ReissueTokenResponse>>(
    '/api/auth/reissue',
    { refreshToken },
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
  const { data } = await apiClient.get<ApiResponse<UserProfile>>('/api/auth/profile');
  return data.result;
}

/**
 * 프로필 수정
 * PATCH /api/auth/profile
 */
export async function updateProfile(requestData: UpdateProfileRequest): Promise<UserProfile> {
  const { data } = await apiClient.patch<ApiResponse<UserProfile>>(
    '/api/auth/profile',
    requestData,
  );
  return data.result;
}
