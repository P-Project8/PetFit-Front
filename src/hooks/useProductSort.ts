import { useState, useMemo } from 'react';
import type { ProductListItem } from '../services/api';
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
  sortedProducts: ProductListItem[];
  sortOptions: SortOption[];
}

export function useProductSort(
  products: ProductListItem[],
  defaultSort: SortOption = '인기순',
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
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

      case '별점순':
        return sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

      case '인기순':
      default:
        // 인기순 = 리뷰 수 기준 (위시리스트 API 연동 전 임시)
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
  }, [products, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedProducts,
    sortOptions: SORT_OPTIONS,
  };
}
