import { create } from 'zustand';
import { toast } from 'sonner';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
  type CartResponse,
} from '../services/api';

interface CartStore {
  items: CartResponse[];
  isLoading: boolean;
  // 장바구니 목록 불러오기 (로그인 후 초기 로드)
  fetchCart: () => Promise<void>;
  // 장바구니 추가 (productOptionId: 사이즈/색상 조합 ID)
  addItem: (productId: number, productOptionId: number | undefined, quantity: number) => Promise<void>;
  // 수량 변경 (낙관적 업데이트)
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  // 아이템 삭제 (낙관적 업데이트)
  removeItem: (cartItemId: number) => Promise<void>;
  // 전체 수량 합산 (네비게이션 뱃지 등에 사용)
  getTotalItems: () => number;
  // 로그아웃 시 초기화
  reset: () => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await getCart();
      set({ items });
    } catch {
      // 실패 시 조용히 무시
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, productOptionId, quantity) => {
    try {
      const newItem = await addToCart({ productId, productOptionId, quantity });
      // 서버 응답으로 받은 아이템을 items에 추가
      // 같은 옵션이 이미 있는 경우(서버가 수량을 합쳐서 반환) → 기존 항목을 교체
      set((state) => {
        const existingIndex = state.items.findIndex((item) => item.id === newItem.id);
        if (existingIndex !== -1) {
          const updated = [...state.items];
          updated[existingIndex] = newItem;
          return { items: updated };
        }
        return { items: [...state.items, newItem] };
      });
      toast.success('장바구니에 추가되었습니다.');
    } catch {
      toast.error('장바구니 추가에 실패했습니다.');
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    if (quantity < 1 || quantity > 99) return;

    const prevItems = get().items;

    // 낙관적 업데이트: 즉시 UI 반영
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    }));

    try {
      const updated = await updateCartQuantity(cartItemId, quantity);
      // 서버 응답값으로 최종 동기화
      set((state) => ({
        items: state.items.map((item) => (item.id === cartItemId ? updated : item)),
      }));
    } catch {
      // 실패 시 rollback
      set({ items: prevItems });
      toast.error('수량 변경에 실패했습니다.');
    }
  },

  removeItem: async (cartItemId) => {
    const prevItems = get().items;

    // 낙관적 업데이트: 즉시 목록에서 제거
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }));

    try {
      await deleteCartItem(cartItemId);
    } catch {
      // 실패 시 rollback
      set({ items: prevItems });
      toast.error('삭제에 실패했습니다.');
    }
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  reset: () => {
    set({ items: [], isLoading: false });
  },
}));
