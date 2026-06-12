import { apiClient } from './client';
import type { ApiResponse } from './client';

// ============================================
// AI Styling API
// ============================================

export interface AIStylingResult {
  stylingId: number;
  resultImageUrl: string;
  resultImageBase64: string;
}

export interface StylingHistoryItem {
  id: number;
  petImageUrl: string;
  clothImageUrl: string;
  productId: number;
  resultImageUrl: string;
  status: string;
  createdAt: string;
}

export interface StyleDownloadResponse {
  resultImageBase64: string;
}

// AI 이미지 생성은 최대 2분 소요될 수 있으므로 별도 timeout 설정
const AI_TIMEOUT_MS = 120_000;

export async function generateAIStyling(
  petImageBase64: string,
  clothImageBase64: string,
  productId?: number,
  petProfileId?: number,
): Promise<AIStylingResult> {
  const { data } = await apiClient.post<ApiResponse<AIStylingResult>>(
    '/api/ai/styling',
    { petImageBase64, clothImageBase64, productId, petProfileId },
    { timeout: AI_TIMEOUT_MS },
  );
  return data.result;
}

export async function getStylingHistory(): Promise<StylingHistoryItem[]> {
  const { data } = await apiClient.get<ApiResponse<StylingHistoryItem[]>>(
    '/api/ai/styling/history',
  );
  return data.result;
}

// FREE: 512px + 워터마크 / PREMIUM: 원본 해상도 + 워터마크 없음
export async function downloadStyling(stylingId: number): Promise<StyleDownloadResponse> {
  const { data } = await apiClient.get<ApiResponse<StyleDownloadResponse>>(
    `/api/ai/styling/${stylingId}/download`,
  );
  return data.result;
}
