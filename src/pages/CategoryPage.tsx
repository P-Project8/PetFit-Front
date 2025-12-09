import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useMemo } from 'react';
import { mockCategories, categoryLabels } from '../data/mockCategories';
import { mockWishCounts } from '../data/mockWishCounts';
import ProductGrid from '../components/product/ProductGrid';
import PageHeader from '../components/layout/PageHeader';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { useProductStore } from '../store/productStore';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';
import CategoryTabs from '../components/common/CategoryTabs';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useProductStore((state) => state.products);

  const currentCategoryId = categoryId || 'new';
  const categoryName = categoryLabels[currentCategoryId] || '전체 카테고리';

  // Get initial page from URL query params
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = Math.max(1, pageFromUrl);

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (currentCategoryId === 'hot') {
      return [...products]
        .sort(
          (a, b) => (mockWishCounts[b.id] || 0) - (mockWishCounts[a.id] || 0)
        )
        .slice(0, 24);
    }

    if (currentCategoryId === 'new') {
      return [...products]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 24);
    }

    if (currentCategoryId === 'sale') {
      return products.filter((product) => product.discountRate > 0);
    }

    return products.filter((product) => product.category === currentCategoryId);
  }, [currentCategoryId, products]);

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
    initialPage,
  });

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

      {/* Category Tabs */}
      <CategoryTabs
        categories={mockCategories}
        activeCategory={currentCategoryId}
        onCategoryChange={handleCategoryChange}
        className="mt-1"
      />

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
        onPageChange={handlePageChange}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      />
    </div>
  );
}
