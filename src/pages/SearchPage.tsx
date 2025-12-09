import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/layout/PageHeader';
import SearchInput from '../components/search/SearchInput';
import RecentSearches from '../components/search/RecentSearches';
import PopularSearches from '../components/search/PopularSearches';
import ProductGrid from '../components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import Pagination from '../components/common/Pagination';
import { useProductStore } from '../store/productStore';
import { useDebounce } from '../hooks/useDebounce';
import { useProductSort } from '../hooks/useProductSort';
import { usePagination } from '../hooks/usePagination';
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
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onKeyDown={handleKeyDown}
      />

      {/* Recent & Popular Searches (shown when no search term) */}
      {!searchTerm.trim() && (
        <div className="mt-6 px-6">
          <RecentSearches
            searches={recentSearches}
            onSearchClick={handleSearchClick}
            onRemove={handleRemoveRecent}
            onClearAll={handleClearAll}
          />
          <PopularSearches
            searches={popularSearches}
            onSearchClick={handleSearchClick}
          />
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
