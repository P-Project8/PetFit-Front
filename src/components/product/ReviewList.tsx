import { Star } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  content: string;
  imageUrl?: string;
}

interface ReviewListProps {
  productId: number;
  reviewCount?: number;
}

// Mock review data
const mockReviews: Review[] = [
  {
    id: 1,
    userName: '김**',
    rating: 5,
    date: '2024.11.28',
    content: '정말 귀여워요! 우리 강아지한테 잘 어울려요. 품질도 좋고 따뜻해 보입니다.',
  },
  {
    id: 2,
    userName: '박**',
    rating: 4,
    date: '2024.11.25',
    content: '생각보다 더 마음에 들어요. 사이즈는 조금 작은 편이니 한 치수 크게 주문하시는 게 좋을 것 같아요.',
  },
  {
    id: 3,
    userName: '이**',
    rating: 5,
    date: '2024.11.22',
    content: '배송도 빠르고 상품도 만족스러워요. 다른 색상도 구매할 예정입니다!',
  },
];

export default function ReviewList({ productId, reviewCount = 0 }: ReviewListProps) {
  // Filter reviews by productId (in real app)
  const reviews = mockReviews;

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
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
        <h2 className="text-lg font-semibold text-gray-900">
          리뷰 ({reviewCount})
        </h2>
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
          {reviews.map((review) => (
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
        </div>
      )}
    </div>
  );
}
