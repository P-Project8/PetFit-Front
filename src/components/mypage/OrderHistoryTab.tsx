import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '../layout/PageHeader';
import { getOrders } from '../../services/api';
import type { OrderResponse, OrderItem } from '../../services/api';
import ReviewWriteModal from '../product/ReviewWriteModal';

interface OrderHistoryTabProps {
  onBack: () => void;
}

export default function OrderHistoryTab({ onBack }: OrderHistoryTabProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<{
    productId: number;
    orderId: number;
    productName: string;
  } | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getOrders({ size: 20 });
      setOrders(result.content);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // "2024-11-01T12:00:00" → "2024.11.01"
  function formatDate(createdAt: string | null) {
    if (!createdAt) return '-';
    return createdAt.slice(0, 10).replace(/-/g, '.');
  }

  function handleWriteReview(item: OrderItem, orderId: number) {
    setSelectedItemForReview({
      productId: item.productId,
      orderId,
      productName: item.productName,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <PageHeader title="주문내역" onBackClick={onBack} />

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">주문내역을 불러오는 중...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-2">주문내역이 없습니다</p>
            <p className="text-gray-300 text-xs">상품을 구매해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                {/* 주문 헤더 */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="text-xs font-medium text-[#14314F]">
                    {order.status}
                  </span>
                </div>

                {/* 주문 내 상품 목록 */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {/* 상품 정보 */}
                      <div
                        className="flex gap-3 cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          {item.thumbnailUrl && (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-gray-400 mb-1">
                            {item.size} / {item.color} / {item.quantity}개
                          </p>
                          <span className="text-sm font-bold text-gray-900">
                            {item.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      {/* 리뷰 작성 버튼 */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleWriteReview(item, order.id)}
                          className="w-full py-2.5 bg-[#14314F] text-white text-sm font-medium rounded-lg hover:bg-[#0d1f33] transition-colors"
                        >
                          리뷰 작성하기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 주문 합계 */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">총 결제금액</span>
                  <span className="text-sm font-bold text-gray-900">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItemForReview && (
        <ReviewWriteModal
          productId={selectedItemForReview.productId}
          orderId={selectedItemForReview.orderId}
          productName={selectedItemForReview.productName}
          onClose={() => setSelectedItemForReview(null)}
          onSuccess={() => setSelectedItemForReview(null)}
        />
      )}
    </div>
  );
}
