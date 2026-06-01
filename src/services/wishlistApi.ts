import { apiClient } from './client';
import type { ApiResponse } from './client';

// ============================================
// Wishlist Types
// ============================================

// 찜 목록 아이템 (GET /api/wishlist, POST /api/wishlist 응답)
export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  thumbnailUrl: string;
}

// ============================================
// Wishlist API
// ============================================

/**
 * 찜 목록 조회
 * GET /api/wishlist
 */
export async function getWishlist(): Promise<WishlistItem[]> {
  const { data } = await apiClient.get<ApiResponse<WishlistItem[]>>('/api/wishlist');
  return data.result;
}

/**
 * 찜 추가
 * POST /api/wishlist
 */
export async function addWishlist(productId: number): Promise<WishlistItem> {
  const { data } = await apiClient.post<ApiResponse<WishlistItem>>('/api/wishlist', {
    productId,
  });
  return data.result;
}

/**
 * 찜 해제
 * DELETE /api/wishlist/{productId}
 */
export async function removeWishlist(productId: number): Promise<void> {
  await apiClient.delete(`/api/wishlist/${productId}`);
}

/**
 * 상품별 찜 수 조회
 * GET /api/wishlist/counts
 * 반환 예시: { "1": 5, "2": 12 } (key: productId 문자열, value: 찜 수)
 */
export async function getWishlistCounts(): Promise<Record<string, number>> {
  const { data } = await apiClient.get<ApiResponse<Record<string, number>>>(
    '/api/wishlist/counts',
  );
  return data.result;
}
