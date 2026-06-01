import { apiClient } from './client';
import type { ApiResponse } from './client';

// ============================================
// Cart Types
// ============================================

// 장바구니 아이템 (GET /api/cart, POST /api/cart 응답)
export interface CartResponse {
  id: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  productOptionId: number;
  size: string;
  color: string;
  price: number;
  additionalPrice: number;
  quantity: number;
}

// 장바구니 추가 요청
export interface AddToCartRequest {
  productId: number;
  productOptionId?: number;
  quantity: number;
}

// ============================================
// Cart API
// ============================================

/**
 * 장바구니 조회
 * GET /api/cart
 */
export async function getCart(): Promise<CartResponse[]> {
  const { data } = await apiClient.get<ApiResponse<CartResponse[]>>('/api/cart');
  return data.result;
}

/**
 * 장바구니 추가
 * POST /api/cart
 */
export async function addToCart(request: AddToCartRequest): Promise<CartResponse> {
  const { data } = await apiClient.post<ApiResponse<CartResponse>>('/api/cart', request);
  return data.result;
}

/**
 * 장바구니 수량 변경
 * PATCH /api/cart/{id}
 */
export async function updateCartQuantity(
  cartItemId: number,
  quantity: number,
): Promise<CartResponse> {
  const { data } = await apiClient.patch<ApiResponse<CartResponse>>(
    `/api/cart/${cartItemId}`,
    { quantity },
  );
  return data.result;
}

/**
 * 장바구니 아이템 삭제
 * DELETE /api/cart/{id}
 */
export async function deleteCartItem(cartItemId: number): Promise<void> {
  await apiClient.delete(`/api/cart/${cartItemId}`);
}
