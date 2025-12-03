import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/layout/PageHeader';
import { Search } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useDebounce } from '../hooks/useDebounce';
import ProductGrid from '../components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';

export default function SearchPage() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return [];
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase().trim();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [debouncedSearchTerm, products]);

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

  return (
    <div className="min-h-screen bg-white py-12">
      <PageHeader title="검색" showBackButton={false} />

      {/* Search Input */}
      <div className="w-full px-6 mt-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 w-full h-10 rounded-2xl placeholder-gray-400 placeholder:text-sm text-black text-base px-4 focus:outline-none"
          placeholder="검색어를 입력해주세요."
          style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
        />
        <Search className="absolute w-5 h-5 right-10 top-2.5 text-[#14314F]" />
      </div>

      {/* Search Results */}
      {searchTerm.trim() && (
        <div className="mt-4">
          {debouncedSearchTerm.trim() && (
            <>
              <ProductListHeader
                itemCount={sortedProducts.length}
                sortBy={sortBy}
                sortOptions={sortOptions}
                onSortChange={setSortBy}
              />

              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-gray-400 text-sm mb-2">
                    검색 결과가 없습니다
                  </p>
                  <p className="text-gray-300 text-xs">
                    다른 검색어를 입력해주세요
                  </p>
                </div>
              ) : (
                <>
                  <ProductGrid
                    products={paginatedItems}
                    onProductClick={(product) => navigate(`/product/${product.id}`)}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    canGoNext={canGoNext}
                    canGoPrev={canGoPrev}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}

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
