export interface Category {
  id: string;
  label: string;
}

export const mockCategories: Category[] = [
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

// 실제 상품 카테고리 (new, sale, hot 제외)
export const productCategories: Category[] = [
  { id: 'outer', label: 'Outer' },
  { id: 'top', label: 'Top' },
  { id: 'one-piece', label: 'One-piece' },
  { id: 'muffler', label: 'Muffler' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessory', label: 'Acc' },
  { id: 'etc', label: 'Etc' },
];

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
