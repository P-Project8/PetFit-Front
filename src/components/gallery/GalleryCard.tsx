import { Heart, MessageCircle } from 'lucide-react';
import type { GalleryItem } from '../../types/gallery';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <button onClick={onClick} className="relative w-full aspect-square overflow-hidden bg-gray-100 group">
      <img
        src={item.resultImageUrl}
        alt="스타일링"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* 하단 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2">
        <div className="flex items-center gap-2.5 text-white text-xs">
          <span className="flex items-center gap-1">
            <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-red-400 text-red-400' : ''}`} />
            {item.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {item.commentCount}
          </span>
        </div>
      </div>

      {/* 상품 태그 뱃지 */}
      {item.productName && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-white/90 text-[#14314F] text-[10px] font-semibold rounded-full truncate max-w-[100px] block">
            {item.productName}
          </span>
        </div>
      )}
    </button>
  );
}
