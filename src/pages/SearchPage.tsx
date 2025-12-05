import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/layout/PageHeader';
import { Search, X } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useDebounce } from '../hooks/useDebounce';
import ProductGrid from '../components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../utils/recentSearches';
import { getPopularSearches } from '../data/mockPopularSearches';

export default function SearchPage() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const popularSearches = getPopularSearches();

  // 최근 검색어 로드
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // 검색어 클릭 핸들러
  function handleSearchClick(term: string) {
    setSearchTerm(term);
    addRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }

  // 최근 검색어 삭제
  function handleRemoveRecent(term: string) {
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }

  // 전체 삭제
  function handleClearAll() {
    clearRecentSearches();
    setRecentSearches([]);
  }

  // Enter 키 눌렀을 때 검색 실행 & 최근 검색어에 추가
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && searchTerm.trim()) {
      addRecentSearch(searchTerm.trim()); // 최근 검색어 추가
      setRecentSearches(getRecentSearches());
      e.currentTarget.blur();
    }
  }

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
          onKeyDown={handleKeyDown}
          className="bg-gray-100 w-full h-10 rounded-2xl placeholder-gray-400 placeholder:text-sm text-black text-base px-4 focus:outline-none"
          placeholder="검색어를 입력해주세요."
          style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
        />
        <Search className="absolute w-5 h-5 right-10 top-2.5 text-[#14314F]" />
      </div>

      {/* Recent & Popular Searches (shown when no search term) */}
      {!searchTerm.trim() && (
        <div className="mt-6 px-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    최근 검색어
                  </h3>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(term)}
                    className="group flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    <span>{term}</span>
                    <X
                      className="w-3 h-3 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecent(term);
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                인기 검색어
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchClick(term)}
                  className="px-3 py-2 bg-[#14314F]/5 hover:bg-[#14314F]/10 rounded-full text-sm text-[#14314F] font-medium transition-colors"
                >
                  <span className="text-[#14314F] font-bold mr-1">
                    {index + 1}
                  </span>
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    onProductClick={(product) =>
                      navigate(`/product/${product.id}`)
                    }
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
