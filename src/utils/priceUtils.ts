/**
 * 할인율을 기반으로 할인된 가격을 계산합니다.
 * @param price 원가
 * @param discountRate 할인율 (0-100)
 * @returns 할인된 가격
 */
export function calculateDiscountedPrice(
  price: number,
  discountRate?: number
): number {
  if (!discountRate || discountRate <= 0) {
    return price;
  }
  return Math.round(price * (1 - discountRate / 100));
}

/**
 * 할인된 가격이 있는지 확인합니다.
 * @param discountRate 할인율
 * @returns 할인 여부
 */
export function hasDiscount(discountRate?: number): boolean {
  return !!discountRate && discountRate > 0;
}
