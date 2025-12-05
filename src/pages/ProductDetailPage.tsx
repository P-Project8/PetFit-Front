import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { calculateDiscountedPrice, hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ReviewList from '../components/product/ReviewList';
import ReviewWriteModal from '../components/product/ReviewWriteModal';
import PageHeader from '@/components/layout/PageHeader';
import { useProductStore } from '../store/productStore';
import { getReviewStats } from '../data/mockReviews';
import { getWishCount } from '../data/mockWishCounts';
import { canWriteReview } from '../data/mockOrders';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const getProductById = useProductStore((state) => state.getProductById);
  const toggleLike = useProductStore((state) => state.toggleLike);
  const product = getProductById(Number(productId));
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewUpdateKey, setReviewUpdateKey] = useState(0); // 리뷰 업데이트 트리거용
  const [wishCountState, setWishCountState] = useState(() =>
    getWishCount(Number(productId))
  ); // wishCount를 state로 관리

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

  // 리뷰 통계 계산
  const { averageRating, totalReviews } = getReviewStats(product.id);

  function handleWishClick(productId: number) {
    toggleLike(productId);
    // wishCount 즉시 업데이트
    setWishCountState(getWishCount(productId));
  }

  function handleBuyClick() {
    setShowOptionModal(true);
  }

  function handleAIStyling() {
    navigate('/ai-styling', { state: { selectedProduct: product } });
  }

  function handleWriteReview() {
    const { canReview, message } = canWriteReview(product.id);

    if (!canReview) {
      toast.error(message);
      return;
    }

    setShowReviewModal(true);
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
          reviewCount={totalReviews}
          rating={averageRating}
          onWriteReview={handleWriteReview}
        />
      </div>

      {/* Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-3">
          <button
            className="text-[#14314F] text-xs w-12 flex flex-col items-center gap-1"
            onClick={() => handleWishClick(product.id)}
          >
            {product.isLike ? (
              <Heart className="text-red-600 fill-red-600" />
            ) : (
              <Heart className="text-[#14314F]" />
            )}
            {wishCountState}
          </button>
          <button
            onClick={handleAIStyling}
            className="w-28 text-[#14314F] py-2.5 rounded-lg border-gray-200 border font-semibold text-sm active:opacity-90 transition-opacity flex items-center justify-center"
          >
            <img src="/F.png" alt="@F" className="h-4" />
            <span className='font-["Kakamora"] text-sm'>it</span>
          </button>
          <button
            onClick={handleBuyClick}
            className="flex-1 bg-[#14314F] text-white py-2.5 rounded-lg font-semibold text-sm active:bg-[#0d1f33] transition-colors"
          >
            구매하기
          </button>
        </div>
      </div>

      {/* Option Modal */}
      {showOptionModal && (
        <ProductOptionModal
          product={product}
          onClose={() => setShowOptionModal(false)}
        />
      )}

      {/* Review Write Modal */}
      {showReviewModal && (
        <ReviewWriteModal
          productId={product.id}
          productName={product.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={() => {
            // 리뷰 작성 후 통계 업데이트
            setReviewUpdateKey((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
