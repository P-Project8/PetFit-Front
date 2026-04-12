import type { ProductListItem } from '../../services/api';
import { Star, Heart } from 'lucide-react';
import { calculateDiscountedPrice, hasDiscount } from '../../utils/priceUtils';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
  product: ProductListItem;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  // wishedProductIds를 직접 구독해야 값 변경 시 즉시 리렌더됨
  // isWishlisted 함수를 구독하면 함수 레퍼런스는 불변이라 리렌더가 안 됨
  const wishedProductIds = useWishlistStore((state) => state.wishedProductIds);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isDiscounted = hasDiscount(product.discountRate);
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountRate);
  const liked = wishedProductIds.includes(product.id);

  function handleWishClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    toggleWishlist(product.id);
  }

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 shadow-sm">
        {product.thumbnailUrl && (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        <button
          onClick={handleWishClick}
          className="absolute right-2 bottom-2 text-white cursor-pointer"
        >
          <Heart
            className={`w-4.5 h-4.5 ${liked ? 'fill-red-600 text-red-600' : 'fill-white/50'}`}
          />
        </button>
      </div>
      <div className="px-1">
        <h4 className="font-semibold text-sm text-gray-900 mb-0.5 truncate transition-colors">
          {product.name}
        </h4>
        {isDiscounted ? (
          <div className="flex items-center space-x-1.5">
            <p className="text-sm font-bold text-red-600">{product.discountRate}%</p>
            <p className="text-sm font-bold text-gray-900">
              {discountedPrice.toLocaleString()}원
            </p>
          </div>
        ) : (
          <p className="text-sm font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </p>
        )}

        <div className="flex items-center gap-2 mt-1 mb-1">
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span className="text-xs text-gray-400">
                {product.avgRating.toFixed(1)}({product.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
