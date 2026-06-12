import { useState } from 'react';
import { X, Share2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { createGalleryPost } from '../../services/galleryApi';

interface GalleryShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productId?: number;
  stylingId?: number;
  petProfileId?: number;
}

export default function GalleryShareModal({
  isOpen,
  onClose,
  imageUrl,
  productId,
  stylingId,
  petProfileId,
}: GalleryShareModalProps) {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  async function handleShare() {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await createGalleryPost({
        imageUrl,
        caption: caption.trim() || undefined,
        productId,
        stylingId,
        petProfileId,
      });
      toast.success('피드에 공유됐어요!');
      onClose();
      navigate('/gallery');
    } catch {
      toast.error('공유에 실패했습니다.');
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full bg-white rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">피드에 공유</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 이미지 미리보기 */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
              <img src={imageUrl} alt="스타일링 결과" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">AI 스타일링 결과</p>
              <p className="text-xs text-gray-400 mt-0.5">커뮤니티에 공유하면 다른 반려인들이 볼 수 있어요</p>
            </div>
          </div>

          {/* 캡션 입력 */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            placeholder="한마디 남겨보세요 (선택)"
            className="w-full h-20 px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-[#14314F]"
          />

          {/* 상품 태그 */}
          {productId && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 rounded-xl">
              <Tag className="w-4 h-4 text-[#14314F] shrink-0" />
              <p className="text-sm text-[#14314F] font-medium">상품이 자동 태그됩니다</p>
            </div>
          )}

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full py-4 bg-[#14314F] text-white font-bold rounded-2xl disabled:bg-gray-200 disabled:text-gray-400 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSharing ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {isSharing ? '공유 중...' : '공유하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
