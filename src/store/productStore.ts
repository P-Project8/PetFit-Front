import { create } from 'zustand';

// Phase 2에서 위시리스트 API로 교체 예정
// 현재는 로컬 UI 상태로만 관리 (앱 재시작 시 초기화됨)
interface ProductStore {
  likedProductIds: number[];
  toggleLike: (productId: number) => void;
  isLiked: (productId: number) => boolean;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  likedProductIds: [],

  toggleLike: (productId) => {
    set((state) => {
      const isLiked = state.likedProductIds.includes(productId);
      return {
        likedProductIds: isLiked
          ? state.likedProductIds.filter((id) => id !== productId)
          : [...state.likedProductIds, productId],
      };
    });
  },

  isLiked: (productId) => {
    return get().likedProductIds.includes(productId);
  },
}));
