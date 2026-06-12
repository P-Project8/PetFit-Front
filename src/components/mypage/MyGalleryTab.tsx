import { useState, useEffect } from 'react';
import { Images } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import GalleryCard from '../gallery/GalleryCard';
import ConfirmModal from '../common/ConfirmModal';
import { getMyGallery, deleteGalleryPost } from '../../services/galleryApi';
import type { GalleryItem } from '../../types/gallery';

interface MyGalleryTabProps {
  onBack: () => void;
}

export default function MyGalleryTab({ onBack }: MyGalleryTabProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getMyGallery();
        setItems(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleDeleteConfirm() {
    if (deleteId === null) return;
    try {
      await deleteGalleryPost(deleteId);
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
    } catch {
      toast.error('삭제에 실패했습니다.');
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      <PageHeader title="내 스타일링" onBackClick={onBack} />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-0.5 mt-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Images className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">공유한 스타일링이 없어요</p>
          <p className="text-sm text-gray-400 mt-1">AI 스타일링 결과를 피드에 공유해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-0.5 mt-0.5">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <GalleryCard item={item} onClick={() => navigate(`/gallery/${item.id}`)} />
              <button
                onClick={() => setDeleteId(item.id)}
                className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 hover:bg-black/70 text-white text-[10px] font-semibold rounded-full transition-colors"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="게시물 삭제"
        message="정말 삭제하시겠어요?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
