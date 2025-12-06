import { useState, useMemo } from 'react';
import type { Product } from '../data/products';
import { calculateDiscountedPrice } from '../utils/priceUtils';

export type SortOption =
  | '인기순'
  | '낮은 가격순'
  | '높은 가격순'
  | '후기순'
  | '별점순';

export const SORT_OPTIONS: SortOption[] = [
  '인기순',
  '낮은 가격순',
  '높은 가격순',
  '후기순',
  '별점순',
];

interface UseProductSortReturn {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  sortedProducts: Product[];
  sortOptions: SortOption[];
}

/**
 * 제품 목록 정렬을 관리하는 커스텀 훅
 * @param products 정렬할 제품 목록
 * @param defaultSort 기본 정렬 옵션 (기본값: '인기순')
 * @returns 정렬 상태와 정렬된 제품 목록
 */
export function useProductSort(
  products: Product[],
  defaultSort: SortOption = '인기순'
): UseProductSortReturn {
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case '낮은 가격순':
        return sorted.sort((a, b) => {
          const priceA = calculateDiscountedPrice(a.price, a.discountRate);
          const priceB = calculateDiscountedPrice(b.price, b.discountRate);
          return priceA - priceB;
        });

      case '높은 가격순':
        return sorted.sort((a, b) => {
          const priceA = calculateDiscountedPrice(a.price, a.discountRate);
          const priceB = calculateDiscountedPrice(b.price, b.discountRate);
          return priceB - priceA;
        });

      case '후기순':
        return sorted.sort(
          (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
        );

      case '별점순':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case '인기순':
      default:
        return sorted.sort(
          (a, b) => (b.wishCount || 0) - (a.wishCount || 0)
        );
    }
  }, [products, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedProducts,
    sortOptions: SORT_OPTIONS,
  };
}
