import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '../layout/PageHeader';
import { getUserOrders } from '../../data/mockOrders';
import { useProductStore } from '../../store/productStore';
import { calculateDiscountedPrice, hasDiscount } from '../../utils/priceUtils';
import ReviewWriteModal from '../product/ReviewWriteModal';

interface OrderHistoryTabProps {
  onBack: () => void;
}

export default function OrderHistoryTab({ onBack }: OrderHistoryTabProps) {
  const navigate = useNavigate();
  const getProductById = useProductStore((state) => state.getProductById);
  const orders = getUserOrders();
  const [selectedProductForReview, setSelectedProductForReview] = useState<{
    productId: number;
    productName: string;
  } | null>(null);

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  function handleWriteReview(productId: number, productName: string) {
    setSelectedProductForReview({ productId, productName });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <PageHeader title="주문내역" onBackClick={onBack} />

      <div className="px-4 py-4">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-2">주문내역이 없습니다</p>
            <p className="text-gray-300 text-xs">상품을 구매해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => {
              const product = getProductById(order.productId);
              if (!product) return null;

              const isDiscounted = hasDiscount(product.discountRate);
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discountRate
              );

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  {/* 주문 정보 헤더 */}
                  <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                    <div className="text-xs text-gray-500">
                      {order.purchaseDate}
                    </div>
                  </div>

                  {/* 상품 정보 */}
                  <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* 상품 이미지 */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* 상품 상세 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isDiscounted ? (
                          <>
                            <span className="text-xs font-bold text-red-600">
                              {product.discountRate}%
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {discountedPrice.toLocaleString()}원
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {product.price.toLocaleString()}원
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">
                            {product.price.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 리뷰 작성 버튼 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {order.hasReviewed ? (
                      <div className="text-center py-2 text-xs text-gray-400">
                        리뷰 작성 완료
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleWriteReview(product.id, product.name)
                        }
                        className="w-full py-2.5 bg-[#14314F] text-white text-sm font-medium rounded-lg hover:bg-[#0d1f33] transition-colors"
                      >
                        리뷰 작성하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 */}
      {selectedProductForReview && (
        <ReviewWriteModal
          productId={selectedProductForReview.productId}
          productName={selectedProductForReview.productName}
          onClose={() => setSelectedProductForReview(null)}
          onSubmit={() => {
            setSelectedProductForReview(null);
            // 리뷰 작성 후 주문 목록 새로고침 (상태 업데이트는 markAsReviewed에서 처리됨)
          }}
        />
      )}
    </div>
  );
}
