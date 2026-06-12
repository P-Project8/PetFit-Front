import { useState } from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import GalleryCommentSection from './GalleryCommentSection';
import { toggleLike } from '../../services/galleryApi';
import type { GalleryItem } from '../../types/gallery';

interface GalleryDetailModalProps {
  item: GalleryItem;
  onClose: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function GalleryDetailModal({ item, onClose }: GalleryDetailModalProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(item.liked);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike() {
    if (isLiking) return;
    // 낙관적 업데이트
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);
    try {
      const result = await toggleLike(item.id);
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      // 롤백
      setIsLiked(item.liked);
      setLikeCount(item.likeCount);
      toast.error('좋아요 처리에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full bg-white rounded-t-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {item.userId[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.userId}</p>
              <p className="text-[10px] text-gray-400">{formatDate(item.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto flex-1">
          {/* 이미지 */}
          <div className="w-full aspect-square bg-gray-100">
            <img
              src={item.imageUrl}
              alt="스타일링 결과"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 좋아요 */}
          <div className="flex items-center gap-3 px-4 py-3">
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
          {item.productId && (
            <div className="mx-4 mb-3 flex items-center justify-between p-3 border border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-500">착용 상품이 있어요</p>
              <button
                onClick={() => { onClose(); navigate(`/product/${item.productId}`); }}
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
      </div>
    </div>
  );
}
