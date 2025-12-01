import type { Product } from '../../data/mockProducts';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 text-sm">
            해당 카테고리에 상품이 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
