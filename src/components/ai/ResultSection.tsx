import { useState } from 'react';
import { Download, RotateCcw, ChevronRight, Images } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProductGrid from '../product/ProductGrid';
import SimilarPetCurationSection from '../mypage/SimilarPetCurationSection';
import GalleryShareModal from '../gallery/GalleryShareModal';
import type { ProductListItem } from '../../services/api';
import type { SimilarPetCurationResponse } from '../../types/pet';

interface ResultSectionProps {
  resultImage: string;
  resultImageUrl?: string;
  selectedProduct: { id: number; name: string } | null;
  similarProducts: ProductListItem[];
  curationData?: SimilarPetCurationResponse;
  onDownload: () => void;
  onReset: () => void;
  onProductClick: (product: ProductListItem) => void;
  onGoToProduct: () => void;
}

export default function ResultSection({
  resultImage,
  resultImageUrl,
  selectedProduct,
  similarProducts,
  curationData,
  onDownload,
  onReset,
  onProductClick,
  onGoToProduct,
}: ResultSectionProps) {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="mt-4 space-y-8">
      {/* 결과 이미지 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center ml-4">
          스타일링 결과
        </h2>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
          <img src={resultImage} alt="AI Styling Result" className="w-full h-full object-cover" />
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          * AI가 예측한 스타일링 이미지로, 실제 착용 핏과는 다를 수 있습니다
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDownload}
          className="py-3 bg-white text-[#14314F] border border-gray-300 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          저장하기
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="py-3 bg-white text-[#14314F] border border-gray-300 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Images className="w-4 h-4" />
          갤러리 공유
        </button>
        <button
          onClick={onReset}
          className="py-3 col-span-2 bg-gray-100 text-gray-700 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          다시하기
        </button>
      </div>

      {/* 상품 보러가기 */}
      {selectedProduct && (
        <button
          onClick={onGoToProduct}
          className="w-full text-[#14314F] font-semibold active:scale-[0.98] transition-all flex items-center justify-end gap-1"
        >
          <span>이 상품 보러가기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* 체형 맞춤 큐레이션 */}
      {curationData && (
        <div className="pt-6 mt-6 border-t-4 border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-2">체형 맞춤 추천</h3>
          <SimilarPetCurationSection
            data={curationData}
            onProductClick={(productId) => navigate(`/product/${productId}`)}
          />
        </div>
      )}

      {/* 추천 상품 */}
      <div className="pt-6 mt-6 border-t-4 border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-4">추천 상품</h3>
        <ProductGrid products={similarProducts} onProductClick={onProductClick} />
      </div>

      {/* 갤러리 공유 모달 */}
      <GalleryShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        resultImageUrl={resultImageUrl || resultImage}
        productId={selectedProduct?.id}
        productName={selectedProduct?.name}
      />
    </div>
  );
}
