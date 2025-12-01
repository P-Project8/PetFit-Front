import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { Product } from '../../data/mockProducts';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  categoryId?: string;
}

export default function ProductSection({
  title,
  products,
  categoryId,
}: ProductSectionProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      const scrollLeft = container!.scrollLeft;
      const itemWidth = container!.scrollWidth / products.length;
      const currentIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(currentIndex, 3));
    }

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [products.length]);

  const segmentWidth = 25;

  function handleViewAll() {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    }
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h3 className="text-xl font-['Balsamiq'] font-bold text-gray-900 ml-1">
          {title}
        </h3>
        {categoryId && (
          <button onClick={handleViewAll}>
            <ChevronRight className="text-black" />
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-2 w-full
          snap-x snap-mandatory scroll-pl-4
          scrollbar-hide
          before:shrink-0 before:w-4
          after:shrink-0 after:w-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-40"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} />
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
