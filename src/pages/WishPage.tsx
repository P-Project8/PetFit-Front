import PageHeader from '../components/layout/PageHeader';
import ProductGrid from '@/components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { useNavigate } from 'react-router';
import { useWishlistStore } from '../store/wishlistStore';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/common/Pagination';
import type { ProductListItem } from '../services/api';

// WishlistItem은 productName, price, thumbnailUrl만 포함하므로
// ProductGrid가 요구하는 ProductListItem 형태로 변환
function toProductListItem(item: {
  id: number;
  productId: number;
  productName: string;
  price: number;
  thumbnailUrl: string;
}): ProductListItem {
  return {
    id: item.productId,
    name: item.productName,
    price: item.price,
    thumbnailUrl: item.thumbnailUrl,
    categoryName: '',
    isNew: false,
    isHot: false,
    isSale: false,
    discountRate: 0,
    productUrl: '',
    avgRating: 0,
    reviewCount: 0,
    createdAt: '',
  };
}

export default function WishPage() {
  const navigate = useNavigate();
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const isLoading = useWishlistStore((state) => state.isLoading);

  const baseProducts = wishlistItems.map(toProductListItem);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-12 pb-20 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-20">
      <PageHeader title="찜 목록" showBackButton={false} />
      <ProductListHeader
        itemCount={sortedProducts.length}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />
      {sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-gray-400 text-sm">찜한 상품이 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[#14314F] font-semibold underline underline-offset-2 cursor-pointer"
          >
            쇼핑 계속하기
          </button>
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
    </div>
  );
}
