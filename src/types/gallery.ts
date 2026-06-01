export interface GalleryItem {
  id: number;
  userId: string;
  resultImageUrl: string;
  productId?: number;
  productName?: string;
  productThumbnailUrl?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface GalleryComment {
  id: number;
  userId: string;
  content: string;
  createdAt: string;
}

export interface CreateGalleryRequest {
  resultImageUrl: string;
  productId?: number;
}

export interface CreateCommentRequest {
  content: string;
}
