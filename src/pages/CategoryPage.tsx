import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { mockCategories, categoryLabels } from '../data/mockCategories';
import ProductGrid from '../components/product/ProductGrid';
import PageHeader from '../components/layout/PageHeader';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';
import CategoryTabs from '../components/common/CategoryTabs';
import {
  getProducts,
  getPopularProducts,
  filterProducts,
  type ProductListItem,
} from '../services/api';

// 탭 ID → 백엔드 categoryId 매핑
const CATEGORY_ID_MAP: Record<string, number> = {
  outer: 1,
  top: 2,
  'one-piece': 3,
  muffler: 4,
  shoes: 5,
  accessory: 6,
  etc: 7,
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategoryId = categoryId || 'new';
  const categoryName = categoryLabels[currentCategoryId] || '전체 카테고리';

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = Math.max(1, pageFromUrl);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let result;

      if (currentCategoryId === 'hot') {
        result = await getPopularProducts({ size: 48 });
      } else if (currentCategoryId === 'new') {
        result = await getProducts({ size: 48, sort: 'createdAt,desc' });
      } else if (currentCategoryId === 'sale') {
        // sale 전용 엔드포인트 없음 — 전체 조회 후 isSale로 필터
        const all = await getProducts({ size: 200 });
        setProducts(all.content.filter((p) => p.isSale));
        return;
      } else {
        const backendCategoryId = CATEGORY_ID_MAP[currentCategoryId];
        if (backendCategoryId) {
          result = await filterProducts({ categoryId: backendCategoryId, size: 48 });
        } else {
          result = await getProducts({ size: 48 });
        }
      }

      setProducts(result.content);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const { sortBy, setSortBy, sortedProducts, sortOptions } = useProductSort(products);

  const { currentPage, totalPages, paginatedItems, goToPage, canGoNext, canGoPrev } =
    usePagination({ items: sortedProducts, itemsPerPage: 12, initialPage });

  function handleCategoryChange(id: string) {
    navigate(`/category/${id}`);
  }

  function handlePageChange(page: number) {
    goToPage(page);
    setSearchParams({ page: page.toString() });
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-20">
      <PageHeader title={categoryName} />

      <CategoryTabs
        categories={mockCategories}
        activeCategory={currentCategoryId}
        onCategoryChange={handleCategoryChange}
        className="mt-1"
      />

      <ProductListHeader
        itemCount={sortedProducts.length}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 text-sm">상품을 불러오는 중...</p>
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
            onPageChange={handlePageChange}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
          />
        </>
      )}
    </div>
  );
}
