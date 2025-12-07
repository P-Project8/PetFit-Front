import { useRef, useEffect } from 'react';

export interface CategoryTab {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  categories: CategoryTab[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  className = '',
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active category on mount or category change
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const button = activeButtonRef.current;
      const container = scrollContainerRef.current;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Center the active button
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <>
      <div className={`bg-white ${className}`}>
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-['Balsamiq'] whitespace-nowrap
                  transition-all duration-200 shrink-0
                  ${
                    isActive
                      ? 'bg-[#14314F] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>
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
    </>
  );
}
