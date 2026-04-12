import { create } from 'zustand';
import { toast } from 'sonner';
import {
  getWishlist,
  addWishlist,
  removeWishlist,
  type WishlistItem,
} from '../services/api';

interface WishlistStore {
  wishlistItems: WishlistItem[];
  // productId 기준으로 찜 여부를 빠르게 확인하기 위한 배열
  wishedProductIds: number[];
  isLoading: boolean;
  // 찜 목록 전체 불러오기 (로그인 후 초기 로드)
  fetchWishlist: () => Promise<void>;
  // 찜 추가/해제 토글 (낙관적 업데이트)
  toggleWishlist: (productId: number) => Promise<void>;
  // 특정 상품이 찜 상태인지 확인
  isWishlisted: (productId: number) => boolean;
  // 로그아웃 시 상태 초기화
  reset: () => void;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  wishlistItems: [],
  wishedProductIds: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      set({
        wishlistItems: items,
        wishedProductIds: items.map((item) => item.productId),
      });
    } catch {
      // 실패 시 조용히 무시 (로그인 상태에서만 호출되므로 심각한 에러는 아님)
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const { wishedProductIds, wishlistItems } = get();
    const wasWishlisted = wishedProductIds.includes(productId);

    // --- 낙관적 업데이트: API 응답 전에 UI 먼저 반영 ---
    // 사용자가 하트를 눌렀을 때 즉각 반응하도록 함
    set({
      wishedProductIds: wasWishlisted
        ? wishedProductIds.filter((id) => id !== productId)
        : [...wishedProductIds, productId],
    });

    try {
      if (wasWishlisted) {
        // 찜 해제
        await removeWishlist(productId);
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) => item.productId !== productId,
          ),
        }));
        toast.success('찜 목록에서 제거했습니다.');
      } else {
        // 찜 추가 → 서버에서 반환한 WishlistItem으로 wishlistItems 업데이트
        const newItem = await addWishlist(productId);
        set((state) => ({
          wishlistItems: [...state.wishlistItems, newItem],
        }));
        toast.success('찜 목록에 추가했습니다.');
      }
    } catch {
      // API 실패 시 낙관적 업데이트 rollback
      set({ wishedProductIds, wishlistItems });
      toast.error('요청에 실패했습니다. 다시 시도해주세요.');
    }
  },

  isWishlisted: (productId) => {
    return get().wishedProductIds.includes(productId);
  },

  reset: () => {
    set({ wishlistItems: [], wishedProductIds: [], isLoading: false });
  },
}));
