import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from '../components/layout/PageHeader';
import GalleryCard from '../components/gallery/GalleryCard';
import { getGalleryFeed, getPopularGallery } from '../services/galleryApi';
import type { GalleryItem } from '../types/gallery';

type FeedTab = 'latest' | 'popular';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<FeedTab>('latest');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = tab === 'latest' ? await getGalleryFeed() : await getPopularGallery();
        setItems(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [tab]);

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      <PageHeader title="피드" onBackClick={() => navigate(-1)} />

      {/* 탭 */}
      <div className="flex border-b border-gray-100 sticky top-12 bg-white/70 backdrop-blur-md z-10">
        {(['latest', 'popular'] as FeedTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === t ? 'text-[#14314F] border-b-2 border-[#14314F]' : 'text-gray-400'
            }`}
          >
            {t === 'latest' ? '최신' : '인기'}
          </button>
        ))}
      </div>

      {/* 피드 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-0.5 mt-0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-400 font-medium">아직 게시물이 없어요</p>
          <p className="text-sm text-gray-300 mt-1">AI 스타일링 후 첫 게시물을 공유해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-0.5 mt-0.5">
          {items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/gallery/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
