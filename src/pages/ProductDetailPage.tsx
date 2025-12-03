import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { calculateDiscountedPrice, hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ReviewList from '../components/product/ReviewList';
import PageHeader from '@/components/layout/PageHeader';
import { useProductStore } from '../store/productStore';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const getProductById = useProductStore((state) => state.getProductById);
  const toggleLike = useProductStore((state) => state.toggleLike);
  const product = getProductById(Number(productId));
  const [showOptionModal, setShowOptionModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">상품을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#14314F] font-semibold"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isDiscounted = hasDiscount(product.discountRate);
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountRate
  );

  function handleWishClick() {
    toggleLike(product.id);
  }

  function handleBuyClick() {
    setShowOptionModal(true);
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      <PageHeader title="상품 정보" onBackClick={() => navigate(-1)} />
      {/* Product Image */}
      <div className="aspect-square bg-gray-200">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mb-4">
          {isDiscounted ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">
                  {product.discountRate}%
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {discountedPrice.toLocaleString()}원
                </span>
              </div>
              <p className="text-base text-gray-400 line-through">
                {product.price.toLocaleString()}원
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </p>
          )}
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.name}은(는) 반려동물을 위한 고품질 의류입니다. 편안한
          착용감과 세련된 디자인으로 일상에서 특별한 날까지 다양하게 활용할 수
          있습니다.
        </p>
      </div>

      {/* Reviews */}
      <div className="border-t-8 border-gray-100 py-6">
        <ReviewList
          productId={product.id}
          reviewCount={product.reviewCount}
          rating={product.rating}
        />
      </div>

      {/* Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-4">
        <button
          className="text-[#14314F] text-xs w-12 flex flex-col items-center gap-1 mt-0.5"
          onClick={handleWishClick}
        >
          {product.isLike ? (
            <Heart className="text-red-600 fill-red-600" />
          ) : (
            <Heart className="text-[#14314F]" />
          )}

          {product.wishCount}
        </button>
        <button
          onClick={handleBuyClick}
          className="flex-1 bg-[#14314F] text-white py-2 rounded-lg font-semibold text-base active:bg-[#0d1f33] transition-colors"
        >
          구매하기
        </button>
      </div>

      {/* Option Modal */}
      {showOptionModal && (
        <ProductOptionModal
          product={product}
          onClose={() => setShowOptionModal(false)}
        />
      )}
    </div>
  );
}
