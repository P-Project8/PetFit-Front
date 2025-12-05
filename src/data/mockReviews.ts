export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  date: string;
  content: string;
  imageUrl?: string;
}

// 각 상품별 리뷰 데이터 (최대 10개, 일부 상품은 리뷰 없음)
export const mockReviews: Review[] = [
  // Product 1: 강아지 한복 (8개 리뷰)
  {
    id: 1,
    productId: 1,
    userName: '김**',
    rating: 5,
    date: '2024.12.01',
    content:
      '명절에 입히려고 샀는데 너무 귀여워요! 우리 강아지가 한복 입으니까 진짜 왕자님 같아요.',
  },
  {
    id: 2,
    productId: 1,
    userName: '박**',
    rating: 5,
    date: '2024.11.28',
    content: '품질 좋고 디자인도 예쁘네요. 설날에 또 주문할게요!',
  },
  {
    id: 3,
    productId: 1,
    userName: '이**',
    rating: 4,
    date: '2024.11.25',
    content: '생각보다 사이즈가 작아서 한 치수 크게 주문하는 걸 추천해요.',
  },
  {
    id: 4,
    productId: 1,
    userName: '최**',
    rating: 5,
    date: '2024.11.20',
    content: '배송 빠르고 상품도 만족스러워요. 가족들한테 자랑 많이 했어요 ㅎㅎ',
  },
  {
    id: 5,
    productId: 1,
    userName: '정**',
    rating: 5,
    date: '2024.11.15',
    content: '한복 색감이 정말 예뻐요. 사진보다 실물이 더 좋아요!',
  },
  {
    id: 6,
    productId: 1,
    userName: '강**',
    rating: 4,
    date: '2024.11.10',
    content: '재질이 부드러워서 강아지가 불편해하지 않아요. 좋습니다.',
  },
  {
    id: 7,
    productId: 1,
    userName: '윤**',
    rating: 5,
    date: '2024.11.05',
    content: '명절 때 입히니까 온 가족이 좋아했어요. 재구매 의사 100%!',
  },
  {
    id: 8,
    productId: 1,
    userName: '조**',
    rating: 5,
    date: '2024.11.01',
    content: '디테일이 살아있어요. 가격 대비 퀄리티가 훌륭합니다!',
  },

  // Product 2: 겨자 후드티 (10개 리뷰)
  {
    id: 9,
    productId: 2,
    userName: '김**',
    rating: 5,
    date: '2024.12.03',
    content: '겨자색이 너무 예쁘고 후드 디자인이 귀여워요. 강추!',
  },
  {
    id: 10,
    productId: 2,
    userName: '손**',
    rating: 5,
    date: '2024.12.01',
    content: '따뜻하고 세탁도 잘 돼요. 완전 만족합니다.',
  },
  {
    id: 11,
    productId: 2,
    userName: '박**',
    rating: 5,
    date: '2024.11.29',
    content: '우리 강아지 겨울 옷으로 딱이에요. 품질 최고!',
  },
  {
    id: 12,
    productId: 2,
    userName: '이**',
    rating: 4,
    date: '2024.11.27',
    content: '색상 예쁘고 좋은데 좀 더 두꺼우면 더 좋을 것 같아요.',
  },
  {
    id: 13,
    productId: 2,
    userName: '최**',
    rating: 5,
    date: '2024.11.25',
    content: '산책 나갈 때 입히는데 사람들이 다 귀엽다고 해요 ㅎㅎ',
  },
  {
    id: 14,
    productId: 2,
    userName: '정**',
    rating: 5,
    date: '2024.11.22',
    content: '캐주얼하면서도 세련된 느낌! 다른 색도 구매할게요.',
  },
  {
    id: 15,
    productId: 2,
    userName: '강**',
    rating: 5,
    date: '2024.11.20',
    content: '강아지가 편해하네요. 입고 벗기도 쉬워서 좋아요.',
  },
  {
    id: 16,
    productId: 2,
    userName: '윤**',
    rating: 5,
    date: '2024.11.18',
    content: '가격대비 품질 좋아요. 세탁 후에도 모양 그대로!',
  },
  {
    id: 17,
    productId: 2,
    userName: '조**',
    rating: 4,
    date: '2024.11.15',
    content: '전체적으로 만족하지만 배송이 조금 늦었어요.',
  },
  {
    id: 18,
    productId: 2,
    userName: '장**',
    rating: 5,
    date: '2024.11.12',
    content: '트렌디한 디자인! 주변에 추천하고 다녔어요.',
  },

  // Product 3: 당근 캐릭터 나시 (5개 리뷰)
  {
    id: 19,
    productId: 3,
    userName: '김**',
    rating: 5,
    date: '2024.11.30',
    content: '당근 디자인 너무 귀여워요! 여름용으로 딱이겠어요.',
  },
  {
    id: 20,
    productId: 3,
    userName: '박**',
    rating: 4,
    date: '2024.11.28',
    content: '가볍고 시원해 보여요. 날씨 따뜻해지면 자주 입힐 것 같아요.',
  },
  {
    id: 21,
    productId: 3,
    userName: '이**',
    rating: 5,
    date: '2024.11.25',
    content: '알러지 있는 강아지인데 재질이 부드러워서 좋네요.',
  },
  {
    id: 22,
    productId: 3,
    userName: '최**',
    rating: 4,
    date: '2024.11.22',
    content: '귀엽긴 한데 좀 더 저렴했으면 좋겠어요.',
  },
  {
    id: 23,
    productId: 3,
    userName: '정**',
    rating: 5,
    date: '2024.11.20',
    content: '산뜻한 디자인! SNS 인증샷 찍기 좋아요.',
  },

  // Product 4: 곰돌이 방수복 (10개 리뷰)
  {
    id: 24,
    productId: 4,
    userName: '김**',
    rating: 5,
    date: '2024.12.02',
    content: '비 오는 날 산책하기 완전 좋아요. 방수 기능 확실해요!',
  },
  {
    id: 25,
    productId: 4,
    userName: '박**',
    rating: 5,
    date: '2024.11.30',
    content: '50% 할인해서 샀는데 가격 대비 너무 좋아요.',
  },
  {
    id: 26,
    productId: 4,
    userName: '이**',
    rating: 4,
    date: '2024.11.28',
    content: '방수는 잘 되는데 사이즈 한 치수 크게 주문하세요.',
  },
  {
    id: 27,
    productId: 4,
    userName: '최**',
    rating: 5,
    date: '2024.11.25',
    content: '곰돌이 디자인 너무 귀엽고 실용적이에요!',
  },
  {
    id: 28,
    productId: 4,
    userName: '정**',
    rating: 5,
    date: '2024.11.23',
    content: '장마철에 필수템이에요. 배송도 빨라요.',
  },
  {
    id: 29,
    productId: 4,
    userName: '강**',
    rating: 4,
    date: '2024.11.20',
    content: '물을 잘 튕기네요. 다만 좀 뻣뻣한 느낌은 있어요.',
  },
  {
    id: 30,
    productId: 4,
    userName: '윤**',
    rating: 5,
    date: '2024.11.18',
    content: '비 맞아도 안쪽은 전혀 안 젖어요. 최고!',
  },
  {
    id: 31,
    productId: 4,
    userName: '조**',
    rating: 5,
    date: '2024.11.15',
    content: '후드도 있어서 머리까지 보호돼요. 강추합니다.',
  },
  {
    id: 32,
    productId: 4,
    userName: '장**',
    rating: 5,
    date: '2024.11.12',
    content: '우리 강아지 비 싫어하는데 이거 입히니까 괜찮아해요.',
  },
  {
    id: 33,
    productId: 4,
    userName: '임**',
    rating: 4,
    date: '2024.11.10',
    content: '할인 가격이면 가성비 좋아요. 만족합니다.',
  },

  // Product 5: 알록달록 후드티 (7개 리뷰)
  {
    id: 34,
    productId: 5,
    userName: '김**',
    rating: 5,
    date: '2024.12.01',
    content: '색감이 정말 예쁘고 눈에 확 띄어요. 강아지 찾기 쉬워요 ㅎㅎ',
  },
  {
    id: 35,
    productId: 5,
    userName: '박**',
    rating: 4,
    date: '2024.11.29',
    content: '디자인은 좋은데 세탁 시 색이 조금 빠지는 것 같아요.',
  },
  {
    id: 36,
    productId: 5,
    userName: '이**',
    rating: 5,
    date: '2024.11.27',
    content: '귀여움 그 자체! 친구 강아지 옷으로 선물했어요.',
  },
  {
    id: 37,
    productId: 5,
    userName: '최**',
    rating: 5,
    date: '2024.11.24',
    content: '개성있는 디자인 찾다가 이거 샀는데 대만족이에요.',
  },
  {
    id: 38,
    productId: 5,
    userName: '정**',
    rating: 4,
    date: '2024.11.22',
    content: '좋긴 한데 가격이 조금 비싼 감이 있어요.',
  },
  {
    id: 39,
    productId: 5,
    userName: '강**',
    rating: 5,
    date: '2024.11.19',
    content: '후드 부분이 너무 귀여워요. 재구매 의사 있어요!',
  },
  {
    id: 40,
    productId: 5,
    userName: '윤**',
    rating: 4,
    date: '2024.11.17',
    content: '화려한 디자인 좋아하시면 추천드려요.',
  },

  // Product 6: 체크 머플러 (3개 리뷰)
  {
    id: 41,
    productId: 6,
    userName: '김**',
    rating: 4,
    date: '2024.11.28',
    content: '가볍고 따뜻해요. 할인해서 가성비 좋네요.',
  },
  {
    id: 42,
    productId: 6,
    userName: '박**',
    rating: 4,
    date: '2024.11.25',
    content: '체크 패턴 클래식해서 좋아요.',
  },
  {
    id: 43,
    productId: 6,
    userName: '이**',
    rating: 5,
    date: '2024.11.22',
    content: '겨울 필수템! 가격도 저렴하고 좋아요.',
  },

  // Product 10: 패딩 점퍼 (10개 리뷰)
  {
    id: 44,
    productId: 10,
    userName: '김**',
    rating: 5,
    date: '2024.12.03',
    content: '엄청 따뜻해요! 한파에도 끄떡없어요.',
  },
  {
    id: 45,
    productId: 10,
    userName: '박**',
    rating: 5,
    date: '2024.12.01',
    content: '패딩이 두툼해서 겨울 나기 좋아요. 품질 최고!',
  },
  {
    id: 46,
    productId: 10,
    userName: '이**',
    rating: 5,
    date: '2024.11.29',
    content: '가격은 좀 있지만 그만한 가치 있어요.',
  },
  {
    id: 47,
    productId: 10,
    userName: '최**',
    rating: 4,
    date: '2024.11.27',
    content: '따뜻하긴 한데 좀 무거워요. 그래도 만족합니다.',
  },
  {
    id: 48,
    productId: 10,
    userName: '정**',
    rating: 5,
    date: '2024.11.25',
    content: '디자인도 예쁘고 보온성도 좋아요. 강추!',
  },
  {
    id: 49,
    productId: 10,
    userName: '강**',
    rating: 5,
    date: '2024.11.23',
    content: '겨울 외출 필수템이에요. 재구매 예정입니다.',
  },
  {
    id: 50,
    productId: 10,
    userName: '윤**',
    rating: 5,
    date: '2024.11.20',
    content: '털도 안 빠지고 관리하기 편해요.',
  },
  {
    id: 51,
    productId: 10,
    userName: '조**',
    rating: 4,
    date: '2024.11.18',
    content: '품질 좋은데 사이즈 체크 꼭 하세요!',
  },
  {
    id: 52,
    productId: 10,
    userName: '장**',
    rating: 5,
    date: '2024.11.15',
    content: '프리미엄 느낌 나요. 돈 아깝지 않아요.',
  },
  {
    id: 53,
    productId: 10,
    userName: '임**',
    rating: 5,
    date: '2024.11.12',
    content: '강아지가 추위 많이 타는데 이거 입히니까 딱이에요!',
  },

  // Product 12: 레인코트 (9개 리뷰)
  {
    id: 54,
    productId: 12,
    userName: '김**',
    rating: 5,
    date: '2024.11.30',
    content: '50% 할인해서 득템했어요. 방수 기능 완벽해요!',
  },
  {
    id: 55,
    productId: 12,
    userName: '박**',
    rating: 4,
    date: '2024.11.28',
    content: '비 맞아도 괜찮아요. 다만 후드가 조금 작아요.',
  },
  {
    id: 56,
    productId: 12,
    userName: '이**',
    rating: 5,
    date: '2024.11.26',
    content: '장마철 필수템! 배송도 빠르고 좋아요.',
  },
  {
    id: 57,
    productId: 12,
    userName: '최**',
    rating: 5,
    date: '2024.11.24',
    content: '가성비 최고예요. 친구한테도 추천했어요.',
  },
  {
    id: 58,
    productId: 12,
    userName: '정**',
    rating: 4,
    date: '2024.11.22',
    content: '실용적이고 좋은데 디자인은 평범해요.',
  },
  {
    id: 59,
    productId: 12,
    userName: '강**',
    rating: 5,
    date: '2024.11.19',
    content: '물 튕기는 게 확실해요. 비 올 때 안심이에요.',
  },
  {
    id: 60,
    productId: 12,
    userName: '윤**',
    rating: 4,
    date: '2024.11.17',
    content: '세일 가격이라 만족해요. 원가는 좀 비싼 듯.',
  },
  {
    id: 61,
    productId: 12,
    userName: '조**',
    rating: 5,
    date: '2024.11.14',
    content: '비 오는 날 산책 걱정 없어요. 강추!',
  },
  {
    id: 62,
    productId: 12,
    userName: '장**',
    rating: 5,
    date: '2024.11.11',
    content: '가볍고 방수도 잘 돼요. 아주 만족합니다.',
  },

  // Product 15: 플리스 조끼 (8개 리뷰)
  {
    id: 63,
    productId: 15,
    userName: '김**',
    rating: 5,
    date: '2024.12.02',
    content: '플리스 소재 부드럽고 따뜻해요. 할인 가격 최고!',
  },
  {
    id: 64,
    productId: 15,
    userName: '박**',
    rating: 5,
    date: '2024.11.30',
    content: '실내에서 입히기 딱 좋아요. 너무 두껍지 않아요.',
  },
  {
    id: 65,
    productId: 15,
    userName: '이**',
    rating: 4,
    date: '2024.11.28',
    content: '가볍고 좋은데 정전기가 좀 있어요.',
  },
  {
    id: 66,
    productId: 15,
    userName: '최**',
    rating: 5,
    date: '2024.11.26',
    content: '활동하기 편해서 강아지가 좋아해요.',
  },
  {
    id: 67,
    productId: 15,
    userName: '정**',
    rating: 5,
    date: '2024.11.23',
    content: '세탁도 편하고 관리하기 좋아요.',
  },
  {
    id: 68,
    productId: 15,
    userName: '강**',
    rating: 4,
    date: '2024.11.21',
    content: '50% 할인 가격이면 가성비 좋아요.',
  },
  {
    id: 69,
    productId: 15,
    userName: '윤**',
    rating: 5,
    date: '2024.11.18',
    content: '환절기에 입히기 좋아요. 추천합니다!',
  },
  {
    id: 70,
    productId: 15,
    userName: '조**',
    rating: 5,
    date: '2024.11.15',
    content: '조끼라 입히기 편하고 강아지도 편해해요.',
  },

  // Product 16: 하트 니트 (6개 리뷰)
  {
    id: 71,
    productId: 16,
    userName: '김**',
    rating: 5,
    date: '2024.11.29',
    content: '하트 패턴 너무 사랑스러워요. 여자 강아지한테 딱!',
  },
  {
    id: 72,
    productId: 16,
    userName: '박**',
    rating: 4,
    date: '2024.11.27',
    content: '예쁘긴 한데 털이 좀 빠지는 것 같아요.',
  },
  {
    id: 73,
    productId: 16,
    userName: '이**',
    rating: 5,
    date: '2024.11.25',
    content: '따뜻하고 디자인도 귀여워요. 만족합니다.',
  },
  {
    id: 74,
    productId: 16,
    userName: '최**',
    rating: 5,
    date: '2024.11.22',
    content: '니트 감성 너무 좋아요. 사진 찍기 좋아요!',
  },
  {
    id: 75,
    productId: 16,
    userName: '정**',
    rating: 4,
    date: '2024.11.20',
    content: '품질 좋은데 가격이 조금 있어요.',
  },
  {
    id: 76,
    productId: 16,
    userName: '강**',
    rating: 5,
    date: '2024.11.17',
    content: '로맨틱한 느낌! 데일리로 입히기 좋아요.',
  },

  // Product 21: 패턴 스웨터 (8개 리뷰)
  {
    id: 77,
    productId: 21,
    userName: '김**',
    rating: 5,
    date: '2024.12.01',
    content: '패턴이 독특하고 예쁘네요. 40% 할인 감사합니다!',
  },
  {
    id: 78,
    productId: 21,
    userName: '박**',
    rating: 4,
    date: '2024.11.29',
    content: '따뜻하고 좋은데 세탁 후 약간 늘어났어요.',
  },
  {
    id: 79,
    productId: 21,
    userName: '이**',
    rating: 5,
    date: '2024.11.27',
    content: '가성비 좋아요. 스웨터 찾으시면 추천드려요.',
  },
  {
    id: 80,
    productId: 21,
    userName: '최**',
    rating: 5,
    date: '2024.11.24',
    content: '세일 기간에 득템했어요. 퀄리티 좋아요!',
  },
  {
    id: 81,
    productId: 21,
    userName: '정**',
    rating: 4,
    date: '2024.11.22',
    content: '디자인 마음에 들어요. 색상도 예뻐요.',
  },
  {
    id: 82,
    productId: 21,
    userName: '강**',
    rating: 5,
    date: '2024.11.19',
    content: '겨울 데일리룩으로 최고예요.',
  },
  {
    id: 83,
    productId: 21,
    userName: '윤**',
    rating: 5,
    date: '2024.11.17',
    content: '포근하고 따뜻해요. 강아지가 편해해요.',
  },
  {
    id: 84,
    productId: 21,
    userName: '조**',
    rating: 4,
    date: '2024.11.14',
    content: '할인 가격 고려하면 만족스러워요.',
  },
];

// productId로 리뷰 필터링하는 헬퍼 함수
export function getReviewsByProductId(productId: number): Review[] {
  return mockReviews.filter((review) => review.productId === productId);
}

// 특정 상품의 리뷰 통계 계산
export function getReviewStats(productId: number) {
  const reviews = getReviewsByProductId(productId);
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = parseFloat((totalRating / totalReviews).toFixed(1));

  return { averageRating, totalReviews };
}

// 새 리뷰 추가 (프론트엔드 전용)
export function addReview(
  productId: number,
  rating: number,
  content: string,
  userName: string = '익명'
): Review {
  const newReview: Review = {
    id: mockReviews.length + 1, // 간단한 ID 생성
    productId,
    userName,
    rating,
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'), // YYYY.MM.DD 형식
    content,
  };

  // 배열 맨 앞에 추가 (최신 리뷰가 먼저 보이도록)
  mockReviews.unshift(newReview);

  return newReview;
}
