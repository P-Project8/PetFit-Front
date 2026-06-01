import type { CategoryTab } from '../components/common/CategoryTabs';

// 홈/카테고리 페이지 탭 전체 (new, sale, hot 포함)
export const allCategoryTabs: CategoryTab[] = [
  { id: 'new', label: 'New' },
  { id: 'sale', label: 'Sale' },
  { id: 'hot', label: 'Hot' },
  { id: 'outer', label: 'Outer' },
  { id: 'top', label: 'Top' },
  { id: 'one-piece', label: 'One-piece' },
  { id: 'muffler', label: 'Muffler' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessory', label: 'Acc' },
  { id: 'etc', label: 'Etc' },
];

// 실제 상품 카테고리 탭 (new, sale, hot 제외)
export const productCategoryTabs: CategoryTab[] = allCategoryTabs.filter(
  (c) => !['new', 'sale', 'hot'].includes(c.id),
);

// 카테고리 ID → 한국어 레이블 매핑
export const categoryLabels: Record<string, string> = {
  new: '신상품',
  outer: '아우터',
  top: '상의',
  'one-piece': '원피스',
  muffler: '머플러',
  shoes: '신발',
  accessory: '액세서리',
  sale: '할인 상품',
  hot: '인기 상품',
  etc: '기타',
};

// 탭 ID → 백엔드 categoryId 매핑
export const CATEGORY_ID_MAP: Record<string, number> = {
  outer: 1,
  top: 2,
  'one-piece': 3,
  muffler: 4,
  shoes: 5,
  accessory: 6,
  etc: 7,
};
