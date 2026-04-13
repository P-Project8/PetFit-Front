import { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { getProductReviews } from '../../services/api';
import type { ReviewItem } from '../../services/api';
import Pagination from '../common/Pagination';

interface ReviewListProps {
  productId: number;
  reviewCount?: number;
  rating?: number;
  onWriteReview?: () => void;
}

export default function ReviewList({
  productId,
  reviewCount = 0,
  rating = 0,
  onWriteReview,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const result = await getProductReviews(productId, { page, size: 6 });
        setReviews(result.content);
        setTotalPages(result.totalPages);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    },
    [productId],
  );

  useEffect(() => {
    fetchReviews(0);
  }, [fetchReviews]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchReviews(page);
  }

  // userId를 마스킹: 앞 1자 + * 반복
  function maskUserId(userId: string) {
    if (userId.length <= 1) return userId;
    return userId[0] + '*'.repeat(userId.length - 1);
  }

  // "2024-11-01T12:00:00" → "2024.11.01"
  function formatDate(createdAt: string) {
    return createdAt.slice(0, 10).replace(/-/g, '.');
  }

  function renderStars(starRating: number) {
    return (
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-3 h-3 ${
              index < starRating
                ? 'fill-yellow-300 text-yellow-300'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
          <span className="text-lg text-gray-900">{rating}</span>
          <span className="text-base text-gray-400">({reviewCount})</span>
        </div>
        {onWriteReview && (
          <button
            onClick={onWriteReview}
            className="px-4 py-1.5 text-sm text-[#14314F] border border-[#14314F] rounded-lg hover:bg-[#14314F] hover:text-white transition-colors"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">리뷰를 불러오는 중...</p>
        </div>
      ) : reviewCount === 0 || reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">아직 리뷰가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {maskUserId(review.userId)}
                  </span>
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>

              {review.imageUrl && (
                <div className="mt-3">
                  <img
                    src={review.imageUrl}
                    alt="리뷰 이미지"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              canGoNext={currentPage < totalPages - 1}
              canGoPrev={currentPage > 0}
            />
          )}
        </div>
      )}
    </div>
  );
}
