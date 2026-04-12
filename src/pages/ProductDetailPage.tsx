import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { calculateDiscountedPrice, hasDiscount } from '../utils/priceUtils';
import ProductOptionModal from '../components/product/ProductOptionModal';
import ProductImageSection from '../components/product/ProductImageSection';
import ProductInfoSection from '../components/product/ProductInfoSection';
import ProductActionBar from '../components/product/ProductActionBar';
import ReviewList from '../components/product/ReviewList';
import PageHeader from '@/components/layout/PageHeader';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { getProductById, type ProductDetail } from '../services/api';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishedProductIds = useWishlistStore((state) => state.wishedProductIds);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptionModal, setShowOptionModal] = useState(false);

  useEffect(function fetchProduct() {
    async function load() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const result = await getProductById(Number(productId));
        setProduct(result);
      } catch {
        toast.error('상품 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

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
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountRate);
  const liked = wishedProductIds.includes(product.id);

  function handleWishClick(id: number) {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    toggleWishlist(id);
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

      <ProductImageSection
        imageUrl={product.thumbnailUrl}
        productName={product.name}
        productUrl={product.productUrl}
      />

      <ProductInfoSection
        category={product.categoryName}
        name={product.name}
        price={product.price}
        discountRate={product.discountRate}
        discountedPrice={discountedPrice}
        description={product.description}
        isDiscounted={isDiscounted}
      />

      <div className="border-t-8 border-gray-100 py-6">
        <ReviewList
          productId={product.id}
          reviewCount={product.reviewCount}
          rating={product.avgRating}
        />
      </div>

      <ProductActionBar
        isLike={liked}
        wishCount={0}
        onWishClick={() => handleWishClick(product.id)}
        onAIStyling={handleAIStyling}
        onBuyClick={handleBuyClick}
      />

      {showOptionModal && (
        <ProductOptionModal
          product={product}
          onClose={() => setShowOptionModal(false)}
        />
      )}
    </div>
  );
}
