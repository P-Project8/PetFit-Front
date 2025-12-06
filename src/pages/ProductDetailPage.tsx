import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { calculateDiscountedPrice, hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ReviewList from '../components/product/ReviewList';
import PageHeader from '@/components/layout/PageHeader';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { getReviewStats } from '../data/mockReviews';
import { getWishCount } from '../data/mockWishCounts';
import { categoryLabels } from '../data/mockCategories';
import FLogo from '/src/assets/F.svg?react';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const getProductById = useProductStore((state) => state.getProductById);
  const toggleLike = useProductStore((state) => state.toggleLike);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const product = getProductById(Number(productId));
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    toggleLike(productId);
    // wishCount 즉시 업데이트
    setWishCountState(getWishCount(productId));
  }

  function handleBuyClick() {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    setShowOptionModal(true);
  }

  function handleAIStyling() {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    navigate('/ai-styling', { state: { selectedProduct: product } });
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
            onClick={() => window.open(product.productUrl, '_blank')}
          />
        )}
      </div>
      {/* Product Info */}
      <div className="px-4 py-4">
        <p className="mb-2 text-sm text-gray-500">
          {categoryLabels[product.category]}
        </p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mb-8">
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
        <div className="relative">
          <div
            className={`text-sm text-gray-600 leading-7 whitespace-pre-wrap ${
              !isDescriptionExpanded ? 'max-h-32 overflow-hidden' : ''
            }`}
          >
            {product.description.split('. ').join('.\n\n')}
          </div>
          {!isDescriptionExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent" />
          )}
        </div>

        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="w-full flex items-center justify-center gap-1 mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          {isDescriptionExpanded ? (
            <>
              접기 <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              더보기 <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Reviews */}
      <div className="border-t-8 border-gray-100 py-6">
        <ReviewList
          productId={product.id}
          reviewCount={totalReviews}
          rating={averageRating}
        />
      </div>

      {/* Buy Button */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className="
            pointer-events-auto
            w-full max-w-[400px] h-16
            bg-white/50 
            backdrop-blur-md 
            border border-white/40
            rounded-[35px]
            shadow-[0_8px_32px_rgba(31,38,135,0.15)]
            flex items-center justify-between
            pl-6 pr-2 py-2 gap-4
          "
        >
          <div className="flex items-center gap-5">
            <button
              className="flex flex-col items-center justify-center gap-0.5 min-w-8"
              onClick={() => handleWishClick(product.id)}
            >
              {product.isLike ? (
                <Heart className="w-6 h-6 text-red-600 fill-red-600" />
              ) : (
                <Heart className="w-6 h-6 text-[#14314F]" />
              )}
              <span className="text-[10px] font-medium text-[#14314F] leading-none">
                {wishCountState}
              </span>
            </button>

            <div className="w-px h-8 bg-gray-300/50" />

            <button
              onClick={handleAIStyling}
              className="w-16 items-center justify-center"
            >
              <div className="flex items-center justify-center h-6 text-[#14314F]">
                <FLogo className="w-3 h-5 " />
                <span className='font-["Kakamora"] text-base ml-0.5'>it</span>
              </div>
            </button>
          </div>

          <button
            onClick={handleBuyClick}
            className="
              flex-1 h-full
              bg-[#14314F] 
              text-white 
              rounded-[28px] 
              font-bold text-sm 
              shadow-sm
              flex items-center justify-center
            "
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
    </div>
  );
}
