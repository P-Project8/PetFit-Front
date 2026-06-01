import { apiClient } from './client';
import type { ApiResponse } from './client';

// ============================================
// AI Styling API
// ============================================

/**
 * AI 스타일링 이미지 생성
 * POST /api/ai/styling
 * 백엔드가 Gemini를 호출하고 결과 이미지를 base64로 반환
 */
export async function generateAIStyling(
  petImageBase64: string,
  clothImageBase64: string,
): Promise<string> {
  const { data } = await apiClient.post<ApiResponse<{ resultImageBase64: string }>>(
    '/api/ai/styling',
    { petImageBase64, clothImageBase64 },
  );
  return data.result.resultImageBase64;
}
