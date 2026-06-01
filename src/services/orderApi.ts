import { apiClient } from './client';
import type { ApiResponse, PageResponse, PageableParams } from './client';

// ============================================
// Order Types
// ============================================

// 주문 내 상품 아이템
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

// 주문 (GET /api/orders, GET /api/orders/{id}, POST /api/orders 응답)
export interface OrderResponse {
  id: number;
  totalPrice: number;
  status: string;
  address: string;
  phone: string;
  recipientName: string;
  createdAt: string | null;
  items: OrderItem[];
}

// 주문 생성 요청
export interface CreateOrderRequest {
  address: string;
  phone: string;
  recipientName: string;
}

// 마이페이지 조회 응답
export interface MyPageResponse {
  userId: string;
  name: string;
  email: string;
  orderCount: number;
  reviewCount: number;
  wishlistCount: number;
  recentOrders: OrderResponse[];
}

// ============================================
// Order API
// ============================================

/**
 * 주문 목록 조회
 * GET /api/orders
 */
export async function getOrders(
  params: PageableParams = {},
): Promise<PageResponse<OrderResponse>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<OrderResponse>>>(
    '/api/orders',
    { params: { page: params.page ?? 0, size: params.size ?? 10, sort: params.sort } },
  );
  return data.result;
}

/**
 * 주문 상세 조회
 * GET /api/orders/{id}
 */
export async function getOrderById(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.get<ApiResponse<OrderResponse>>(`/api/orders/${orderId}`);
  return data.result;
}

/**
 * 주문 생성
 * POST /api/orders
 */
export async function createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
  const { data } = await apiClient.post<ApiResponse<OrderResponse>>('/api/orders', request);
  return data.result;
}

/**
 * 주문 취소
 * PATCH /api/orders/{id}/cancel
 */
export async function cancelOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.patch<ApiResponse<OrderResponse>>(
    `/api/orders/${orderId}/cancel`,
  );
  return data.result;
}

// ============================================
// MyPage API
// ============================================

/**
 * 마이페이지 조회 (주문수, 리뷰수, 찜수, 최근 주문)
 * GET /api/mypage
 */
export async function getMyPage(): Promise<MyPageResponse> {
  const { data } = await apiClient.get<ApiResponse<MyPageResponse>>('/api/mypage');
  return data.result;
}
