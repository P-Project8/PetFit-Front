import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/mockProducts';
import { mockProducts } from '../data/mockProducts';
import { toggleWishCount } from '../data/mockWishCounts';

interface ProductStore {
  products: Product[];
  toggleLike: (productId: number) => void;
  getProductById: (productId: number) => Product | undefined;
  getWishedProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      toggleLike: (productId) => {
        set((state) => {
          const product = state.products.find((p) => p.id === productId);
          if (product) {
            // wishCount도 함께 업데이트
            const isAdding = !product.isLike; // 찜하기면 true, 취소면 false
            toggleWishCount(productId, isAdding);
          }

          return {
            products: state.products.map((product) =>
              product.id === productId
                ? { ...product, isLike: !product.isLike }
                : product
            ),
          };
        });
      },

      getProductById: (productId) => {
        return get().products.find((product) => product.id === productId);
      },

      getWishedProducts: () => {
        return get().products.filter((product) => product.isLike);
      },
    }),
    {
      name: 'product-storage',
    }
  )
);
