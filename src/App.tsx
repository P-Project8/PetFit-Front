import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
}

interface CategoryItem {
  id: string;
  label: string;
}

const categories: CategoryItem[] = [
  { id: 'new', label: 'New' },
  { id: 'outer', label: 'Outer' },
  { id: 'top', label: 'Top' },
  { id: 'one-piece', label: 'One-piece' },
  { id: 'muffler', label: 'Muffler' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessory', label: 'Acc' },
  { id: 'etc', label: 'Etc' },
];

interface ProductSectionProps {
  title: string;
  sectionId: string;
  items: number[];
}

function ProductSection({ title, sectionId, items }: ProductSectionProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryTitle = title.toLowerCase();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.scrollWidth / items.length;
      const currentIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(currentIndex, 3)); // 최대 3까지만 (4개 구간)
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  const segmentWidth = 25;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h3 className="text-xl font-['Balsamiq'] font-bold text-gray-900 ml-1">
          {title}
        </h3>
        <button onClick={() => navigate(`/category/${queryTitle}`)}>
          <ChevronRight className="text-black" />
        </button>
      </div>
      <div
        ref={containerRef}
        id={sectionId}
        className="flex gap-3 overflow-x-auto pb-2 w-full
    snap-x snap-mandatory scroll-pl-4
    scrollbar-hide
    before:shrink-0 before:w-4 
    after:shrink-0 after:w-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((item) => (
          <div
            key={`${sectionId}-${item}`}
            className="snap-start shrink-0 w-40 group cursor-pointer"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 shadow-sm">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              {title === 'Sale' && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                  50%
                </div>
              )}
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mb-0.5 truncate group-hover:text-indigo-600 transition-colors">
              제품명 {item}
            </h4>
            {title === 'Sale' ? (
              <div className="flex items-center space-x-1.5">
                <p className="text-sm font-bold text-red-600">₩150,000</p>
                <p className="text-xs text-gray-400 line-through">₩300,000</p>
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-900">₩250,000</p>
            )}
          </div>
        ))}
      </div>

      {/* Segmented Progress Bar */}
      <div className="px-4 mt-3">
        <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="absolute h-full bg-[#14314F] transition-all duration-300 ease-out rounded-full"
            style={{
              left: `${activeIndex * segmentWidth}%`,
              width: `${segmentWidth}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    name: '강아지 한복',
    brand: '추석, 설날을 기념해보세요',
    price: '₩450,000',
    image: '/src/assets/images/banner1.jpg',
  },
  {
    id: 2,
    name: '겨자 후드티',
    brand: '캐주얼한 느낌의 후드',
    price: '₩280,000',
    image: '/src/assets/images/banner2.jpg',
  },
  {
    id: 3,
    name: '당근 캐릭터 나시',
    brand: '귀여운 당근이 포인트',
    price: '₩390,000',
    image: '/src/assets/images/banner3.jpg',
  },
  {
    id: 4,
    name: '곰돌이 방수복',
    brand: '비 오는 날 걱정 마세요 :)',
    price: '₩180,000',
    image: '/src/assets/images/banner4.jpg',
  },
  {
    id: 5,
    name: '알록달록 후드티',
    brand: '눈에 띌 수 밖에 없는 귀여움',
    price: '₩520,000',
    image: '/src/assets/images/banner5.jpg',
  },
];

export default function App() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 1. 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  // 2. 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  // 3. 5초 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]); // currentSlide가 바뀔 때마다 타이머 초기화 (터치 충돌 방지)

  // 4. 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // 초기화
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // 50px 이상 움직이면 스와이프로 인정
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      {/* Carousel Banner 

      */}
      <section
        className="relative w-full h-100 overflow-hidden bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slider Track 

        */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="w-full h-full shrink-0 relative">
              <div className="w-full h-full bg-gray-800">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
              </div>

              <div className="absolute bottom-0 left-6 right-0 z-10 pb-16">
                <h2 className="text-white text-3xl font-bold mb-1 drop-shadow-md">
                  {item.name}
                </h2>
                <p className="text-white/90 text-base drop-shadow-md">
                  {item.brand}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6' // 활성 상태: 길어짐
                  : 'bg-white/40 w-1.5 hover:bg-white/60' // 비활성: 점
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="py-6 bg-white">
        <div className="px-4">
          <div className="grid grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => navigate(`/category/${category.id}`)}
                className="
            text-sm text-[#14314F] font-['Balsamiq'] py-3
            border-r border-gray-200
            nth-[4n]:border-r-0
            active:bg-gray-50 active:text-gray-900 transition-colors
          "
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections - Mobile Optimized */}
      <div className="bg-white divide-y-8">
        <ProductSection
          title="New"
          sectionId="new-section"
          items={[1, 2, 3, 4, 5]}
        />
        <ProductSection
          title="Hot"
          sectionId="hot-section"
          items={[1, 2, 3, 4, 5]}
        />
        <ProductSection
          title="Sale"
          sectionId="sale-section"
          items={[1, 2, 3, 4, 5]}
        />
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
