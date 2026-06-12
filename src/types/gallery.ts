export interface GalleryItem {
  id: number;
  userId: string;
  petProfileId?: number;
  productId?: number;
  stylingId?: number;
  imageUrl: string;
  caption?: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  createdAt: string;
}

export interface GalleryComment {
  id: number;
  galleryId: number;
  userId: string;
  content: string;
  createdAt: string;
}

export interface CreateGalleryRequest {
  imageUrl: string;
  caption?: string;
  petProfileId?: number;
  productId?: number;
  stylingId?: number;
}

export interface CreateCommentRequest {
  content: string;
}

export interface LikeToggleResponse {
  galleryId: number;
  liked: boolean;
  likeCount: number;
}
