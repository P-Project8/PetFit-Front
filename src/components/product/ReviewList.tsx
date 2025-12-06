import { Star } from 'lucide-react';
import { getReviewsByProductId } from '../../data/mockReviews';
import { usePagination } from '@/hooks/usePagination';
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
  // Filter reviews by productId
  const reviews = getReviewsByProductId(productId);

  function renderStars(rating: number) {
    return (
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-3 h-3 ${
              index < rating
                ? 'fill-yellow-300 text-yellow-300'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  }

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    canGoNext,
    canGoPrev,
  } = usePagination({ items: reviews, itemsPerPage: 6 });

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

      {reviewCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">아직 리뷰가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">
            첫 번째 리뷰를 작성해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedItems.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              {/* Review Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.userName}
                  </span>
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>

              {/* Review Content */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.content}
              </p>

              {/* Review Image (optional) */}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
          />
        </div>
      )}
    </div>
  );
}
