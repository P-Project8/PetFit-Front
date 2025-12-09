import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { calculateDiscountedPrice, hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ProductImageSection from '../components/product/ProductImageSection';
import ProductInfoSection from '../components/product/ProductInfoSection';
import ProductActionBar from '../components/product/ProductActionBar';
import ReviewList from '../components/product/ReviewList';
import PageHeader from '@/components/layout/PageHeader';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { getReviewStats } from '../data/mockReviews';
import { getWishCount } from '../data/mockWishCounts';
import { categoryLabels } from '../data/mockCategories';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const getProductById = useProductStore((state) => state.getProductById);
  const toggleLike = useProductStore((state) => state.toggleLike);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const product = getProductById(Number(productId));
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [wishCountState, setWishCountState] = useState(() =>
    getWishCount(Number(productId))
  );

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
      <ProductImageSection
        imageUrl={product.imageUrl}
        productName={product.name}
        productUrl={product.productUrl}
      />

      {/* Product Info */}
      <ProductInfoSection
        category={categoryLabels[product.category]}
        name={product.name}
        price={product.price}
        discountRate={product.discountRate}
        discountedPrice={discountedPrice}
        description={product.description}
        isDiscounted={isDiscounted}
      />

      {/* Reviews */}
      <div className="border-t-8 border-gray-100 py-6">
        <ReviewList
          productId={product.id}
          reviewCount={totalReviews}
          rating={averageRating}
        />
      </div>

      {/* Product Action Bar */}
      <ProductActionBar
        isLike={product.isLike}
        wishCount={wishCountState}
        onWishClick={() => handleWishClick(product.id)}
        onAIStyling={handleAIStyling}
        onBuyClick={handleBuyClick}
      />

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
