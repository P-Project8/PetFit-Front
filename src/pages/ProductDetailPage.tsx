import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, Heart } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ReviewList from '../components/product/ReviewList';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = mockProducts.find((p) => p.id === Number(productId));
  const navigate = useNavigate();
  const [isWished, setIsWished] = useState(product?.isLike);
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
  const originalPrice = isDiscounted
    ? Math.round(product.price / (1 - (product.discountRate || 0) / 100))
    : product.price;

  function handleWishClick() {
    setIsWished(!isWished);
  }

  function handleBuyClick() {
    setShowOptionModal(true);
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
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
        <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>

        {/* Rating & Reviews */}
        {product.rating && product.reviewCount && (
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span className="text-sm text-gray-900 mr-2">{product.rating}</span>
            <span className="text-sm text-gray-400">
              후기 {product.reviewCount}개
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-6">
          {isDiscounted ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">
                  {product.discountRate}%
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {product.price.toLocaleString()}원
                </span>
              </div>
              <p className="text-base text-gray-400 line-through">
                {originalPrice.toLocaleString()}원
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </p>
          )}
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            상품 설명
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            {product.name}은(는) 반려동물을 위한 고품질 의류입니다. 편안한
            착용감과 세련된 디자인으로 일상에서 특별한 날까지 다양하게 활용할 수
            있습니다.
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t-8 border-gray-100 py-6">
        <ReviewList productId={product.id} reviewCount={product.reviewCount} />
      </div>

      {/* Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-2">
        <button
          className="text-[#14314F] text-xs w-12 flex flex-col items-center gap-1 mt-0.5"
          onClick={handleWishClick}
        >
          {isWished ? (
            <Heart className="text-red-600 fill-red-600" />
          ) : (
            <Heart className="text-[#14314F]" />
          )}

          {product.wishCount}
        </button>
        <button
          onClick={handleBuyClick}
          className="flex-1 bg-[#14314F] text-white py-3 rounded-lg font-semibold text-base active:bg-[#0d1f33] transition-colors"
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
