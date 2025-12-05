// 주문 내역 목 데이터
// 실제로는 백엔드에서 관리되어야 하는 데이터

export interface Order {
  orderId: number;
  productId: number;
  userId: string;
  purchaseDate: string;
  hasReviewed: boolean;
}

// 현재 로그인한 사용자 (임시)
const CURRENT_USER_ID = 'current-user';

// 주문 내역 데이터
export const mockOrders: Order[] = [
  // 구매했고, 아직 리뷰 작성 안 함
  {
    orderId: 1,
    productId: 1, // 강아지 한복
    userId: CURRENT_USER_ID,
    purchaseDate: '2024-11-15',
    hasReviewed: false,
  },
  {
    orderId: 2,
    productId: 10, // 패딩 점퍼
    userId: CURRENT_USER_ID,
    purchaseDate: '2024-11-20',
    hasReviewed: false,
  },
  {
    orderId: 3,
    productId: 15, // 플리스 조끼
    userId: CURRENT_USER_ID,
    purchaseDate: '2024-11-25',
    hasReviewed: false,
  },

  // 구매했고, 이미 리뷰 작성함
  {
    orderId: 4,
    productId: 2, // 겨자 후드티
    userId: CURRENT_USER_ID,
    purchaseDate: '2024-10-01',
    hasReviewed: true,
  },
  {
    orderId: 5,
    productId: 4, // 곰돌이 방수복
    userId: CURRENT_USER_ID,
    purchaseDate: '2024-10-15',
    hasReviewed: true,
  },

  // 다른 사용자의 주문 (현재 사용자가 아님)
  {
    orderId: 6,
    productId: 5,
    userId: 'other-user',
    purchaseDate: '2024-11-01',
    hasReviewed: false,
  },
];

// 구매 여부 확인
export function hasPurchased(productId: number, userId: string = CURRENT_USER_ID): boolean {
  return mockOrders.some(
    (order) => order.productId === productId && order.userId === userId
  );
}

// 리뷰 작성 가능 여부 확인
export function canWriteReview(
  productId: number,
  userId: string = CURRENT_USER_ID
): {
  canReview: boolean;
  reason: 'ok' | 'not_purchased' | 'already_reviewed';
  message: string;
} {
  const purchase = mockOrders.find(
    (order) => order.productId === productId && order.userId === userId
  );

  if (!purchase) {
    return {
      canReview: false,
      reason: 'not_purchased',
      message: '구매한 상품만 리뷰를 작성할 수 있습니다.',
    };
  }

  if (purchase.hasReviewed) {
    return {
      canReview: false,
      reason: 'already_reviewed',
      message: '이미 리뷰를 작성한 상품입니다.',
    };
  }

  return {
    canReview: true,
    reason: 'ok',
    message: '',
  };
}

// 리뷰 작성 후 상태 업데이트
export function markAsReviewed(productId: number, userId: string = CURRENT_USER_ID): void {
  const purchase = mockOrders.find(
    (order) => order.productId === productId && order.userId === userId
  );

  if (purchase) {
    purchase.hasReviewed = true;
  }
}

// 사용자의 구매 내역 조회
export function getUserOrders(userId: string = CURRENT_USER_ID): Order[] {
  return mockOrders.filter((order) => order.userId === userId);
}

// 리뷰 작성 가능한 상품 목록
export function getReviewableProducts(userId: string = CURRENT_USER_ID): Order[] {
  return mockOrders.filter(
    (order) => order.userId === userId && !order.hasReviewed
  );
}
