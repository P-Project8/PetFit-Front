import { create } from 'zustand';

// Phase 2에서 위시리스트 기능을 wishlistStore로 분리함
// 향후 상품 관련 전역 상태가 필요할 경우 여기에 추가
interface ProductStore {
  _placeholder: null;
}

export const useProductStore = create<ProductStore>()(() => ({
  _placeholder: null,
}));
