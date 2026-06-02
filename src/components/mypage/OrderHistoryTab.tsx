import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '../layout/PageHeader';
import { getOrders, getProductReviews, cancelOrder } from '../../services/api';
import type { OrderResponse, OrderItem } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

// ─── DEV ONLY: 백엔드 배송 상태 연동 완료 후 아래 두 줄 삭제 ───────────────
// 배송완료로 강제할 주문 ID를 여기에 추가 (예: [12, 34, 56])
const DEV_DELIVERED_ORDER_IDS = new Set<number>([6]);
// ────────────────────────────────────────────────────────────────────────────

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제 완료',
  SHIPPING: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
};
import ReviewWriteModal from '../product/ReviewWriteModal';
import ConfirmModal from '../common/ConfirmModal';

interface StoredReview {
  reviewId: number;
  rating: number;
  content: string;
}

interface OrderHistoryTabProps {
  onBack: () => void;
}

export default function OrderHistoryTab({ onBack }: OrderHistoryTabProps) {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.userId);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // key: productId (string) — 상품 단위로 리뷰 여부 관리
  const [reviewedItems, setReviewedItems] = useState<
    Record<string, StoredReview>
  >({});
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [selectedItemForReview, setSelectedItemForReview] = useState<{
    productId: number;
    orderId: number;
    productName: string;
    reviewId?: number;
    defaultRating?: number;
    defaultContent?: string;
  } | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getOrders({ size: 20, sort: 'id,desc' });
      setOrders(result.content);
      console.log('주문내역:', result.content);
      return result.content;
    } catch {
      setOrders([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 주문 로드 후 각 상품의 내 리뷰 여부를 서버에서 확인
  const fetchMyReviews = useCallback(
    async (loadedOrders: OrderResponse[]) => {
      if (!userId) return;

      const productIds = [
        ...new Set(
          loadedOrders.flatMap((o) => o.items.map((item) => item.productId)),
        ),
      ];

      const results = await Promise.allSettled(
        productIds.map((productId) =>
          getProductReviews(productId, { size: 100 }),
        ),
      );

      const found: Record<string, StoredReview> = {};
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;
        const myReview = result.value.content.find((r) => r.userId === userId);
        if (myReview) {
          found[String(productIds[index])] = {
            reviewId: myReview.id,
            rating: myReview.rating,
            content: myReview.content,
          };
        }
      });

      setReviewedItems(found);
    },
    [userId],
  );

  useEffect(() => {
    fetchOrders().then(fetchMyReviews);
  }, [fetchOrders, fetchMyReviews]);

  function formatDate(createdAt: string | null) {
    if (!createdAt) return '-';
    return createdAt.slice(0, 10).replace(/-/g, '.');
  }

  function handleOpenReviewModal(item: OrderItem, orderId: number) {
    const existing = reviewedItems[String(item.productId)];
    setSelectedItemForReview({
      productId: item.productId,
      orderId,
      productName: item.productName,
      reviewId: existing?.reviewId,
      defaultRating: existing?.rating,
      defaultContent: existing?.content,
    });
  }

  async function confirmCancelOrder() {
    if (cancelTargetId === null) return;
    try {
      await cancelOrder(cancelTargetId);
      setOrders((prev) => prev.filter((o) => o.id !== cancelTargetId));
      toast.success('주문이 취소되었습니다.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '주문 취소에 실패했습니다.';
      toast.error(message);
    } finally {
      setCancelTargetId(null);
    }
  }

  function handleReviewSuccess(
    productId: number,
    reviewId: number,
    rating: number,
    content: string,
  ) {
    setReviewedItems((prev) => ({
      ...prev,
      [String(productId)]: { reviewId, rating, content },
    }));
    setSelectedItemForReview(null);
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
            {orders.map((order) => {
              // DEV ONLY: 실제 연동 후 아래 한 줄 삭제하고 order.status 직접 사용
              const status = DEV_DELIVERED_ORDER_IDS.has(order.id)
                ? 'DELIVERED'
                : order.status;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="text-xs font-medium text-[#14314F]">
                        {ORDER_STATUS_LABEL[status] ?? status}
                      </span>
                    </div>
                    {status === 'PENDING' && (
                      <button
                        onClick={() => setCancelTargetId(order.id)}
                        className="text-xs text-red-500 border border-red-400 rounded px-2 py-0.5 hover:bg-red-50 transition-colors"
                      >
                        주문 취소
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const hasReview = Boolean(
                        reviewedItems[String(item.productId)],
                      );
                      return (
                        <div key={item.id}>
                          <div
                            className="flex gap-3 cursor-pointer"
                            onClick={() =>
                              navigate(`/product/${item.productId}`)
                            }
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

                          {status === 'DELIVERED' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <button
                                onClick={() =>
                                  handleOpenReviewModal(item, order.id)
                                }
                                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                  hasReview
                                    ? 'bg-white text-[#14314F] border border-[#14314F] hover:bg-gray-50'
                                    : 'bg-[#14314F] text-white hover:bg-[#0d1f33]'
                                }`}
                              >
                                {hasReview ? '리뷰 수정하기' : '리뷰 작성하기'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">총 결제금액</span>
                    <span className="text-sm font-bold text-gray-900">
                      {order.totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={cancelTargetId !== null}
        title="주문 취소"
        message="주문을 취소하시겠습니까?"
        confirmText="취소하기"
        cancelText="닫기"
        onConfirm={confirmCancelOrder}
        onCancel={() => setCancelTargetId(null)}
      />

      {selectedItemForReview && (
        <ReviewWriteModal
          productId={selectedItemForReview.productId}
          orderId={selectedItemForReview.orderId}
          productName={selectedItemForReview.productName}
          reviewId={selectedItemForReview.reviewId}
          defaultRating={selectedItemForReview.defaultRating}
          defaultContent={selectedItemForReview.defaultContent}
          onClose={() => setSelectedItemForReview(null)}
          onSuccess={(reviewId, rating, content) =>
            handleReviewSuccess(
              selectedItemForReview.productId,
              reviewId,
              rating,
              content,
            )
          }
        />
      )}
    </div>
  );
}
