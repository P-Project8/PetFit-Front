export interface Banner {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export const mockBanners: Banner[] = [
  {
    id: 1,
    name: '양털안감 체크 코트',
    imageUrl: '/images/products/outer_images/001.png',
    description:
      '따뜻한데 퀄리티 좋은 인조양털 안감으로 가볍고 따뜻하고 고급스러워요',
  },
  {
    id: 2,
    name: '더플 코트 하네스',
    imageUrl: '/images/products/outer_images/002.png',
    description:
      '이중잠금 하네스, 들어보셨나요? 겉보기엔 단순해 보여도, 안쪽엔 디테일이 숨어있어요',
  },
  {
    id: 3,
    name: '곰곰이 양면 조끼',
    imageUrl: '/images/products/outer_images/003.png',
    description: '옷하나로 두벌 느낌을 낼수 있는 양면 조끼!',
  },
  {
    id: 4,
    name: '그루비 피그먼트 맨투맨',
    imageUrl: '/images/products/top_images/011.png',
    description:
      '자연스러운 워싱이 들어간 피그먼트 염색 쭈리 소재로 부드럽고 가벼운 터치감이 특징',
  },
  {
    id: 5,
    name: '퍼 패딩 조끼',
    imageUrl: '/images/products/outer_images/005.png',
    description:
      '우아함과 실용성을 모두 갖춘 명품 하네스로, 올겨울 우리 아이와 따뜻한 겨울 보내세요!',
  },
];
