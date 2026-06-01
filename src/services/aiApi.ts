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

export async function generateAIStyling(
  petImageBase64: string,
  clothImageBase64: string,
  productId?: number,
  petProfileId?: number,
): Promise<AIStylingResult> {
  const { data } = await apiClient.post<ApiResponse<AIStylingResult>>(
    '/api/ai/styling',
    { petImageBase64, clothImageBase64, productId, petProfileId },
  );
  return data.result;
}

export async function getStylingHistory(): Promise<StylingHistoryItem[]> {
  const { data } = await apiClient.get<ApiResponse<StylingHistoryItem[]>>(
    '/api/ai/styling/history',
  );
  return data.result;
}
