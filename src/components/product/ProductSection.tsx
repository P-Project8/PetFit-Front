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

  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      const maxScroll = container!.scrollWidth - container!.clientWidth;
      const currentScroll = container!.scrollLeft;
      const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
      setScrollProgress(progress);
    }

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [products.length]);

  function handleViewAll() {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    }
  }

  const BAR_WIDTH_PERCENT = 25;

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
          scroll-pl-4 scrollbar-hide
          before:shrink-0 before:w-2
          after:shrink-0 after:w-2"
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-40">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* 부드러운 진행 바 */}
      <div className="px-4 mt-3">
        <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="absolute h-full bg-gray-400 rounded-full"
            style={{
              left: `${scrollProgress * (100 - BAR_WIDTH_PERCENT)}%`,
              width: `${BAR_WIDTH_PERCENT}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
