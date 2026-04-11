import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/layout/PageHeader';
import SearchInput from '../components/search/SearchInput';
import RecentSearches from '../components/search/RecentSearches';
import PopularSearches from '../components/search/PopularSearches';
import ProductGrid from '../components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import Pagination from '../components/common/Pagination';
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
import { searchProducts, type ProductListItem } from '../services/api';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const popularSearches = getPopularSearches();

  useEffect(function loadRecentSearches() {
    setRecentSearches(getRecentSearches());
  }, []);

  const fetchSearchResults = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchProducts(keyword.trim(), { size: 100 });
      setSearchResults(result.content);
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(function onSearchTermChange() {
    fetchSearchResults(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSearchResults]);

  function handleSearchClick(term: string) {
    setSearchTerm(term);
    addRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }

  function handleRemoveRecent(term: string) {
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }

  function handleClearAll() {
    clearRecentSearches();
    setRecentSearches([]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
      setRecentSearches(getRecentSearches());
      e.currentTarget.blur();
    }
  }

  const { sortBy, setSortBy, sortedProducts, sortOptions } = useProductSort(searchResults);

  const { currentPage, totalPages, paginatedItems, goToPage, canGoNext, canGoPrev } =
    usePagination({ items: sortedProducts, itemsPerPage: 12 });

  return (
    <div className="min-h-screen bg-white py-12">
      <PageHeader title="검색" showBackButton={false} />

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onKeyDown={handleKeyDown}
      />

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

      {searchTerm.trim() && (
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-400 text-sm">검색 중...</p>
            </div>
          ) : (
            <>
              <ProductListHeader
                itemCount={sortedProducts.length}
                sortBy={sortBy}
                sortOptions={sortOptions}
                onSortChange={setSortBy}
              />
              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-gray-400 text-sm mb-2">검색 결과가 없습니다</p>
                  <p className="text-gray-300 text-xs">다른 검색어를 입력해주세요</p>
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
