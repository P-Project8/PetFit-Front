import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/mockProducts';
import { mockProducts } from '../data/mockProducts';

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
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, isLike: !product.isLike }
              : product
          ),
        }));
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
