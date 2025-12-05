import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { mockCategories } from './data/mockCategories';
import ProductSection from './components/product/ProductSection';
import { useProductStore } from './store/productStore';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import AiStylingBanner from './components/banner/AiStylingBanner';

export default function App() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const textContainerVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55, // 처음 등장 조금 빠르게
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  // 1. 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselProducts.length);
  };

  // 2. 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselProducts.length - 1 : prev - 1
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

  const carouselProducts = products.filter((p) => p.isCarousel).slice(0, 5);
  const newProducts = products.filter((p) => p.isNew).slice(0, 5);
  const hotProducts = products.filter((p) => p.isHot).slice(0, 5);
  const saleProducts = products.filter((p) => p.isSale).slice(0, 5);

  return (
    <div className="min-h-screen bg-white pt-12 pb-20">
      {/* Carousel Banner */}
      <section
        className="relative w-full h-100 overflow-hidden bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slider Track */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselProducts.map((item, index) => (
            <div
              key={item.id}
              className="w-full h-full shrink-0 relative"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div className="w-full h-full bg-gray-800">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
              </div>

              <motion.div
                className="absolute bottom-0 left-6 right-0 z-10 pb-16"
                variants={textContainerVariants}
                initial="hidden"
                animate={index === currentSlide ? 'visible' : 'hidden'}
              >
                <motion.h2
                  variants={textItemVariants}
                  className="text-white text-3xl font-bold mb-1 drop-shadow-md"
                >
                  {item.name}
                </motion.h2>
                <motion.p
                  variants={textItemVariants}
                  className="text-white/90 text-base drop-shadow-md"
                >
                  {item.description}
                </motion.p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {carouselProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/40 w-1.5 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="pt-6 bg-white">
        <div className="px-4">
          <div className="grid grid-cols-4">
            {mockCategories.map((category) => (
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

      {/* AI Styling Banner */}
      <AiStylingBanner />

      {/* Product Sections - Mobile Optimized */}
      <div className="bg-white space-y-8">
        <ProductSection title="New" products={newProducts} categoryId="new" />
        <ProductSection title="Hot" products={hotProducts} categoryId="hot" />
        <ProductSection
          title="Sale"
          products={saleProducts}
          categoryId="sale"
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
