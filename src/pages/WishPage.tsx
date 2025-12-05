import PageHeader from '../components/layout/PageHeader';
import ProductGrid from '@/components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { useNavigate } from 'react-router';
import { useProductStore } from '../store/productStore';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';

export default function WishPage() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const baseProducts = products.filter((product) => product.isLike);

  const { sortBy, setSortBy, sortedProducts, sortOptions } =
    useProductSort(baseProducts);

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
    <div className="min-h-screen bg-white pt-12 pb-20">
      <PageHeader title="찜 목록" showBackButton={false} />
      <ProductListHeader
        itemCount={sortedProducts.length}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />
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
