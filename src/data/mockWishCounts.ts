// 상품별 위시 카운트 데이터
// 실제로는 서버에서 관리되어야 하는 데이터
export const mockWishCounts: Record<number, number> = {
  1: 7,
  2: 9,
  3: 4,
  4: 10,
  5: 6,
  6: 3,
  7: 8,
  8: 5,
  9: 2,
  10: 9,
  11: 6,
  12: 8,
  13: 3,
  14: 7,
  15: 10,
  16: 8,
  17: 4,
  18: 6,
  19: 5,
  20: 4,
  21: 9,
  22: 7,
  23: 3,
  24: 5,
  25: 2,
  26: 4,
  27: 6,
};

// productId로 wishCount 가져오기
export function getWishCount(productId: number): number {
  return mockWishCounts[productId] || 0;
}

// wishCount 증가/감소 (실제로는 API 호출)
export function toggleWishCount(productId: number, isAdding: boolean): number {
  const currentCount = mockWishCounts[productId] || 0;
  mockWishCounts[productId] = isAdding ? currentCount + 1 : Math.max(0, currentCount - 1);
  return mockWishCounts[productId];
}
