import { apiClient } from './client';
import type { ApiResponse, PageResponse, PageableParams } from './client';

// ============================================
// Review Types
// ============================================

// 리뷰 (GET /api/reviews/product/{productId}, POST/PATCH /api/reviews 응답)
export interface ReviewItem {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  content: string;
  imageUrl: string | null;
  createdAt: string | null; // API 미지원, UI에서 미사용
}

// 리뷰 작성 요청
export interface CreateReviewRequest {
  productId: number;
  orderId: number;
  rating: number;
  content: string;
  imageUrl?: string;
}

// 리뷰 수정 요청
export interface UpdateReviewRequest {
  rating: number;
  content: string;
  imageUrl?: string;
}

// ============================================
// Review API
// ============================================

/**
 * 상품 리뷰 목록 조회
 * GET /api/reviews/product/{productId}
 */
export async function getProductReviews(
  productId: number,
  params: PageableParams = {},
): Promise<PageResponse<ReviewItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ReviewItem>>>(
    `/api/reviews/product/${productId}`,
    { params: { page: params.page ?? 0, size: params.size ?? 10, sort: params.sort } },
  );
  return data.result;
}

/**
 * 리뷰 작성
 * POST /api/reviews
 */
export async function createReview(request: CreateReviewRequest): Promise<ReviewItem> {
  const { data } = await apiClient.post<ApiResponse<ReviewItem>>('/api/reviews', request);
  return data.result;
}

/**
 * 리뷰 수정
 * PATCH /api/reviews/{id}
 */
export async function updateReview(
  reviewId: number,
  request: UpdateReviewRequest,
): Promise<ReviewItem> {
  const { data } = await apiClient.patch<ApiResponse<ReviewItem>>(
    `/api/reviews/${reviewId}`,
    request,
  );
  return data.result;
}

/**
 * 리뷰 삭제
 * DELETE /api/reviews/{id}
 */
export async function deleteReview(reviewId: number): Promise<void> {
  await apiClient.delete(`/api/reviews/${reviewId}`);
}
