import { useParams, useNavigate } from 'react-router';
import { useRef, useEffect, useMemo } from 'react';
import { categoryLabels } from '../data/mockCategories';
import ProductGrid from '../components/product/ProductGrid';
import PageHeader from '../components/layout/PageHeader';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { useProductStore } from '../store/productStore';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';

const categories = [
  { id: 'new', label: 'New' },
  { id: 'outer', label: 'Outer' },
  { id: 'top', label: 'Top' },
  { id: 'one-piece', label: 'One-piece' },
  { id: 'muffler', label: 'Muffler' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessory', label: 'Acc' },
  { id: 'etc', label: 'Etc' },
  { id: 'sale', label: 'Sale' },
  { id: 'hot', label: 'Hot' },
];

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  const currentCategoryId = categoryId || 'new';
  const categoryName = categoryLabels[currentCategoryId] || '전체 카테고리';

  // Filter products based on category
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (currentCategoryId === 'new') return product.isNew;
        if (currentCategoryId === 'hot') return product.isHot;
        if (currentCategoryId === 'sale') return product.isSale;
        return product.category === currentCategoryId;
      }),
    [currentCategoryId, products]
  );

  const { sortBy, setSortBy, sortedProducts, sortOptions } =
    useProductSort(filteredProducts);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    canGoNext,
    canGoPrev,
  } = usePagination({
    items: sortedProducts,
    itemsPerPage: 12,
  });

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
  }, [currentCategoryId]);

  function handleCategoryClick(id: string) {
    navigate(`/category/${id}`);
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-16">
      <PageHeader title={categoryName} />

      {/* Horizontal Scrollable Category Tabs */}
      <div className="bg-white shadow-xs sticky top-12 z-10">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        >
          {categories.map((category) => {
            const isActive = category.id === currentCategoryId;
            return (
              <button
                key={category.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => handleCategoryClick(category.id)}
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

      {/* Product List Header */}
      <ProductListHeader
        itemCount={sortedProducts.length}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />

      {/* Product Grid */}
      <ProductGrid
        products={paginatedItems}
        onProductClick={(product) => navigate(`/product/${product.id}`)}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      />

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
