import { useParams, useNavigate } from 'react-router';
import { useMemo } from 'react';
import { mockCategories, categoryLabels } from '../data/mockCategories';
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
  const products = useProductStore((state) => state.products);

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

  function handleCategoryChange(id: string) {
    navigate(`/category/${id}`);
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-16">
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
        onPageChange={goToPage}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      />
    </div>
  );
}
