import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/products';

export interface CartItem {
  cartItemId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity) => {
        set((state) => {
          // 같은 상품, 같은 옵션이 이미 있는지 확인
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
          );

          // 이미 존재하면 수량만 증가
          if (existingItemIndex !== -1) {
            const newItems = [...state.items];
            const newQuantity = newItems[existingItemIndex].quantity + quantity;
            // 최대 수량 99개 제한
            newItems[existingItemIndex].quantity = Math.min(newQuantity, 99);
            return { items: newItems };
          }

          // 없으면 새로운 아이템 추가
          const cartItemId = `${product.id}-${size}-${color}-${Date.now()}`;
          const newItem: CartItem = {
            cartItemId,
            product,
            size,
            color,
            quantity,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
