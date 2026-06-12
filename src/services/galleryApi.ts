import { apiClient } from './client';
import type { ApiResponse, PageResponse } from './client';
import type {
  GalleryItem,
  GalleryComment,
  LikeToggleResponse,
  CreateGalleryRequest,
  CreateCommentRequest,
} from '../types/gallery';

// ============================================
// 피드
// ============================================

export async function getGalleryFeed(page = 0, size = 20): Promise<GalleryItem[]> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<GalleryItem>>>(
    '/api/gallery',
    { params: { page, size, sort: 'createdAt,desc' } },
  );
  return data.result.content;
}

export async function getPopularGallery(page = 0, size = 20): Promise<GalleryItem[]> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<GalleryItem>>>(
    '/api/gallery/popular',
    { params: { page, size } },
  );
  return data.result.content;
}

// ============================================
// 내 게시물
// ============================================

export async function getMyGallery(page = 0, size = 20): Promise<GalleryItem[]> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<GalleryItem>>>(
    '/api/gallery/my',
    { params: { page, size } },
  );
  return data.result.content;
}

// ============================================
// 게시물 상세 / 생성 / 삭제
// ============================================

export async function getGalleryDetail(galleryId: number): Promise<GalleryItem> {
  const { data } = await apiClient.get<ApiResponse<GalleryItem>>(
    `/api/gallery/${galleryId}`,
  );
  return data.result;
}

export async function createGalleryPost(req: CreateGalleryRequest): Promise<GalleryItem> {
  const { data } = await apiClient.post<ApiResponse<GalleryItem>>(
    '/api/gallery',
    req,
  );
  return data.result;
}

export async function deleteGalleryPost(galleryId: number): Promise<void> {
  await apiClient.delete(`/api/gallery/${galleryId}`);
}

// ============================================
// 좋아요
// ============================================

// 서버가 토글 후 실제 상태를 반환하므로 currentIsLiked 파라미터 불필요
export async function toggleLike(galleryId: number): Promise<LikeToggleResponse> {
  const { data } = await apiClient.post<ApiResponse<LikeToggleResponse>>(
    `/api/gallery/${galleryId}/like`,
  );
  return data.result;
}

// ============================================
// 댓글
// ============================================

export async function getGalleryComments(galleryId: number, page = 0, size = 50): Promise<GalleryComment[]> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<GalleryComment>>>(
    `/api/gallery/${galleryId}/comments`,
    { params: { page, size } },
  );
  return data.result.content;
}

export async function createComment(galleryId: number, req: CreateCommentRequest): Promise<GalleryComment> {
  const { data } = await apiClient.post<ApiResponse<GalleryComment>>(
    `/api/gallery/${galleryId}/comments`,
    req,
  );
  return data.result;
}

export async function deleteComment(commentId: number): Promise<void> {
  await apiClient.delete(`/api/gallery/comments/${commentId}`);
}
