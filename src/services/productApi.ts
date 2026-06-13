import { apiClient } from './client';
import type { ApiResponse, PageResponse, PageableParams } from './client';

// ============================================
// Product & Category Types
// ============================================

export interface ProductOption {
  id: number;
  size: string;
  color: string;
  additionalPrice: number;
  stockQuantity: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  imageOrder: number;
}

// 상품 목록 아이템 (GET /api/products, /api/products/search 등)
export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  categoryName: string;
  isNew: boolean;
  isHot: boolean;
  isSale: boolean;
  discountRate: number;
  productUrl: string;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
}

// 상품 상세 (GET /api/products/{id})
export interface ProductDetail extends ProductListItem {
  description: string;
  stockQuantity: number;
  options: ProductOption[];
  images: ProductImage[];
  wishCount?: number;
}

// 카테고리
export interface Category {
  id: number;
  name: string;
  children: Category[];
}

// ============================================
// Product API
// ============================================

/**
 * 전체 상품 목록 (페이지네이션)
 * GET /api/products
 */
export async function getProducts(
  params: PageableParams = {},
): Promise<PageResponse<ProductListItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ProductListItem>>>(
    '/api/products',
    { params: { page: params.page ?? 0, size: params.size ?? 12, sort: params.sort } },
  );
  return data.result;
}

/**
 * 상품 상세 조회
 * GET /api/products/{id}
 */
export async function getProductById(id: number): Promise<ProductDetail> {
  const { data } = await apiClient.get<ApiResponse<ProductDetail>>(`/api/products/${id}`);
  return data.result;
}

/**
 * 키워드 상품 검색
 * GET /api/products/search
 */
export async function searchProducts(
  keyword: string,
  params: PageableParams = {},
): Promise<PageResponse<ProductListItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ProductListItem>>>(
    '/api/products/search',
    { params: { keyword, page: params.page ?? 0, size: params.size ?? 12, sort: params.sort } },
  );
  return data.result;
}

/**
 * 인기 상품 (리뷰 수 기준)
 * GET /api/products/popular
 */
export async function getPopularProducts(
  params: PageableParams = {},
): Promise<PageResponse<ProductListItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ProductListItem>>>(
    '/api/products/popular',
    { params: { page: params.page ?? 0, size: params.size ?? 12, sort: params.sort } },
  );
  return data.result;
}

/**
 * 상품 필터링 (카테고리, 가격 범위)
 * GET /api/products/filter
 */
export async function filterProducts(
  options: { categoryId?: number; minPrice?: number; maxPrice?: number } & PageableParams = {},
): Promise<PageResponse<ProductListItem>> {
  const { categoryId, minPrice, maxPrice, page, size, sort } = options;
  const { data } = await apiClient.get<ApiResponse<PageResponse<ProductListItem>>>(
    '/api/products/filter',
    { params: { categoryId, minPrice, maxPrice, page: page ?? 0, size: size ?? 12, sort } },
  );
  return data.result;
}

/**
 * 큐레이션 추천 상품
 * GET /api/products/curated
 */
export async function getCuratedProducts(): Promise<PageResponse<ProductListItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ProductListItem>>>(
    '/api/products/curated',
  );
  return data.result;
}

// ============================================
// Category API
// ============================================

/**
 * 카테고리 목록 (트리 구조)
 * GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
  return data.result;
}
