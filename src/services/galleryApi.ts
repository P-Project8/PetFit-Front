import type {
  GalleryItem,
  GalleryComment,
  CreateGalleryRequest,
  CreateCommentRequest,
} from '../types/gallery';

// ============================================
// Mock Data
// ============================================

const MOCK_ITEMS: GalleryItem[] = [
  {
    id: 1,
    userId: 'park***',
    resultImageUrl: 'https://placehold.co/400x400/dbeafe/1e40af?text=🐕+Style+A',
    productId: 1,
    productName: '봄 스트라이프 티셔츠',
    productThumbnailUrl: 'https://placehold.co/80x80/dbeafe/1e40af?text=T',
    likeCount: 142,
    commentCount: 18,
    isLiked: false,
    createdAt: '2026-05-31T10:00:00Z',
  },
  {
    id: 2,
    userId: 'kim***',
    resultImageUrl: 'https://placehold.co/400x400/fce7f3/be185d?text=🐩+Style+B',
    productId: 2,
    productName: '플리스 후드 집업',
    productThumbnailUrl: 'https://placehold.co/80x80/fce7f3/be185d?text=H',
    likeCount: 98,
    commentCount: 11,
    isLiked: true,
    createdAt: '2026-05-30T14:30:00Z',
  },
  {
    id: 3,
    userId: 'lee***',
    resultImageUrl: 'https://placehold.co/400x400/d1fae5/065f46?text=🐶+Style+C',
    likeCount: 73,
    commentCount: 6,
    isLiked: false,
    createdAt: '2026-05-29T09:20:00Z',
  },
  {
    id: 4,
    userId: 'choi***',
    resultImageUrl: 'https://placehold.co/400x400/fef9c3/854d0e?text=🦴+Style+D',
    productId: 3,
    productName: '체크 패턴 코트',
    productThumbnailUrl: 'https://placehold.co/80x80/fef9c3/854d0e?text=C',
    likeCount: 211,
    commentCount: 27,
    isLiked: false,
    createdAt: '2026-05-28T18:00:00Z',
  },
  {
    id: 5,
    userId: 'jung***',
    resultImageUrl: 'https://placehold.co/400x400/ede9fe/5b21b6?text=🐾+Style+E',
    likeCount: 55,
    commentCount: 4,
    isLiked: true,
    createdAt: '2026-05-27T11:10:00Z',
  },
  {
    id: 6,
    userId: 'yoon***',
    resultImageUrl: 'https://placehold.co/400x400/ffedd5/9a3412?text=🐕+Style+F',
    productId: 4,
    productName: '니트 스웨터',
    productThumbnailUrl: 'https://placehold.co/80x80/ffedd5/9a3412?text=S',
    likeCount: 180,
    commentCount: 22,
    isLiked: false,
    createdAt: '2026-05-26T16:45:00Z',
  },
];

const MOCK_COMMENTS: GalleryComment[] = [
  { id: 1, userId: 'han***', content: '너무 귀엽다 ㅠㅠ 우리 아이도 입혀보고 싶어요!', createdAt: '2026-05-31T11:00:00Z' },
  { id: 2, userId: 'shin***', content: '어떤 사이즈 선택하셨어요?', createdAt: '2026-05-31T11:30:00Z' },
  { id: 3, userId: 'park***', content: 'S 사이즈 입혔는데 딱 맞았어요 😊', createdAt: '2026-05-31T12:00:00Z' },
];

// ============================================
// API 함수 (mock → 실제 연동 시 내부만 교체)
// ============================================

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function getGalleryFeed(): Promise<GalleryItem[]> {
  return delay([...MOCK_ITEMS].sort((a, b) => b.id - a.id));
}

export async function getPopularGallery(): Promise<GalleryItem[]> {
  return delay([...MOCK_ITEMS].sort((a, b) => b.likeCount - a.likeCount));
}

export async function getMyGallery(): Promise<GalleryItem[]> {
  return delay(MOCK_ITEMS.slice(0, 2));
}

export async function getGalleryDetail(id: number): Promise<GalleryItem> {
  const item = MOCK_ITEMS.find((i) => i.id === id) ?? MOCK_ITEMS[0];
  return delay({ ...item });
}

export async function getGalleryComments(id: number): Promise<GalleryComment[]> {
  void id;
  return delay([...MOCK_COMMENTS]);
}

export async function createGalleryPost(req: CreateGalleryRequest): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    id: Date.now(),
    userId: '나***',
    resultImageUrl: req.resultImageUrl,
    productId: req.productId,
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
  };
  return delay(newItem, 600);
}

export async function toggleLike(id: number, currentIsLiked: boolean): Promise<{ isLiked: boolean; likeCount: number }> {
  const item = MOCK_ITEMS.find((i) => i.id === id);
  const base = item?.likeCount ?? 0;
  return delay({
    isLiked: !currentIsLiked,
    likeCount: currentIsLiked ? base - 1 : base + 1,
  }, 200);
}

export async function createComment(id: number, req: CreateCommentRequest): Promise<GalleryComment> {
  void id;
  return delay({
    id: Date.now(),
    userId: '나***',
    content: req.content,
    createdAt: new Date().toISOString(),
  }, 300);
}

export async function deleteGalleryPost(id: number): Promise<void> {
  void id;
  return delay(undefined as unknown as void, 300);
}

export async function deleteComment(id: number): Promise<void> {
  void id;
  return delay(undefined as unknown as void, 200);
}
