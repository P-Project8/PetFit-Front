import { mockProducts } from '@/data/mockProducts';
import PageHeader from '../components/layout/PageHeader';
import ProductGrid from '@/components/product/ProductGrid';
import ProductListHeader from '../components/product/ProductListHeader';
import { useProductSort } from '../hooks/useProductSort';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

export default function WishPage() {
  const navigate = useNavigate();
  const baseProducts = useMemo(
    () => mockProducts.filter((product) => product.isLike),
    []
  );

  const { sortBy, setSortBy, sortedProducts, sortOptions } =
    useProductSort(baseProducts);

  return (
    <div className="min-h-screen bg-white pt-12 pb-16">
      <PageHeader title="찜 목록" showBackButton={false} />
      <ProductListHeader
        itemCount={sortedProducts.length}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />
      <ProductGrid
        products={sortedProducts}
        onProductClick={(product) => navigate(`/product/${product.id}`)}
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
