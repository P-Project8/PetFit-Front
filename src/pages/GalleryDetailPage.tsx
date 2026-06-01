import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/layout/PageHeader';
import GalleryCommentSection from '../components/gallery/GalleryCommentSection';
import { getGalleryDetail, toggleLike } from '../services/galleryApi';
import type { GalleryItem } from '../types/gallery';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function GalleryDetailPage() {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function load() {
      if (!galleryId) return;
      setIsLoading(true);
      try {
        const data = await getGalleryDetail(Number(galleryId));
        setItem(data);
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      } catch {
        toast.error('게시물을 불러오지 못했습니다.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [galleryId, navigate]);

  async function handleLike() {
    if (!item || isLiking) return;
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);
    try {
      const result = await toggleLike(item.id, isLiked);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch {
      setIsLiked(isLiked);
      setLikeCount(item.likeCount);
      toast.error('좋아요 처리에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-12">
        <PageHeader title="" onBackClick={() => navigate(-1)} />
        <div className="w-full aspect-square bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      <PageHeader title="" onBackClick={() => navigate(-1)} />

      {/* 이미지 */}
      <div className="w-full aspect-square bg-gray-100">
        <img src={item.resultImageUrl} alt="스타일링 결과" className="w-full h-full object-cover" />
      </div>

      {/* 작성자 + 좋아요 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
            {item.userId[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.userId}</p>
            <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 transition-transform active:scale-90"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
          <span className="text-sm font-semibold text-gray-700">{likeCount}</span>
        </button>
      </div>

      {/* 상품 태그 */}
      {item.productId && item.productName && (
        <div className="mx-4 my-3 flex items-center gap-3 p-3 border border-gray-200 rounded-2xl">
          {item.productThumbnailUrl && (
            <img
              src={item.productThumbnailUrl}
              alt={item.productName}
              className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">착용 상품</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
          </div>
          <button
            onClick={() => navigate(`/product/${item.productId}`)}
            className="shrink-0 flex items-center gap-1 px-3 py-2 bg-[#14314F] text-white text-xs font-bold rounded-xl"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            구매하기
          </button>
        </div>
      )}

      {/* 댓글 */}
      <GalleryCommentSection galleryId={item.id} />
    </div>
  );
}
