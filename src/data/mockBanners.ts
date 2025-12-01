export interface Banner {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export const mockBanners: Banner[] = [
  {
    id: 1,
    name: '강아지 한복',
    description: '추석, 설날을 기념해보세요',
    price: '₩450,000',
    imageUrl: '/src/assets/images/banner1.jpg',
  },
  {
    id: 2,
    name: '겨자 후드티',
    description: '캐주얼한 느낌의 후드',
    price: '₩280,000',
    imageUrl: '/src/assets/images/banner2.jpg',
  },
  {
    id: 3,
    name: '당근 캐릭터 나시',
    description: '귀여운 당근이 포인트',
    price: '₩390,000',
    imageUrl: '/src/assets/images/banner3.jpg',
  },
  {
    id: 4,
    name: '곰돌이 방수복',
    description: '비 오는 날 걱정 마세요 :)',
    price: '₩180,000',
    imageUrl: '/src/assets/images/banner4.jpg',
  },
  {
    id: 5,
    name: '알록달록 후드티',
    description: '눈에 띌 수 밖에 없는 귀여움',
    price: '₩520,000',
    imageUrl: '/src/assets/images/banner5.jpg',
  },
];
