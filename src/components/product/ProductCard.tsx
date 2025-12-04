import type { Product } from '../../data/mockProducts';
import { Star, Heart } from 'lucide-react';
import { calculateDiscountedPrice, hasDiscount } from '../../utils/priceUtils';
import { useProductStore } from '../../store/productStore';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const toggleLike = useProductStore((state) => state.toggleLike);
  const isDiscounted = hasDiscount(product.discountRate);

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountRate
  );

  function handleWishClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleLike(product.id);
  }

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 shadow-sm">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        <button
          onClick={handleWishClick}
          className="absolute right-2 bottom-2 text-white"
        >
          <Heart
            className={`w-4.5 h-4.5 ${
              product.isLike ? 'fill-red-600 text-red-600' : 'fill-white/50'
            }`}
          />
        </button>
      </div>
      <div className="px-1">
        <h4 className="font-semibold text-sm text-gray-900 mb-0.5 truncate group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h4>
        {isDiscounted ? (
          <div className="flex items-center space-x-1.5">
            <p className="text-sm font-bold text-red-600">
              {product.discountRate}%
            </p>
            <p className="text-sm font-bold text-gray-900">
              {discountedPrice.toLocaleString()}원
            </p>
          </div>
        ) : (
          <p className="text-sm font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </p>
        )}

        {/* Rating and Wish Count */}
        <div className="flex items-center gap-2 mt-1 mb-1">
          {product.rating && product.reviewCount && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span className="text-xs text-gray-400">
                {product.rating}({product.reviewCount})
              </span>
            </div>
          )}
          {product.wishCount && (
            <div className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-red-300 text-red-300" />
              <span className="text-xs text-gray-400">{product.wishCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
