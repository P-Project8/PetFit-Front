import { Users, TrendingUp } from 'lucide-react';
import type { SimilarPetCurationResponse } from '../../types/pet';

interface SimilarPetCurationSectionProps {
  data: SimilarPetCurationResponse;
  onProductClick: (productId: number) => void;
}

export default function SimilarPetCurationSection({
  data,
  onProductClick,
}: SimilarPetCurationSectionProps) {
  const isFallback = data.similarUserCount === 0;

  return (
    <div className="bg-blue-50 rounded-2xl p-4 mt-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        {isFallback ? (
          <TrendingUp className="w-4 h-4 text-[#14314F]" />
        ) : (
          <Users className="w-4 h-4 text-[#14314F]" />
        )}
        <p className="text-sm font-bold text-[#14314F]">
          {isFallback ? '지금 인기 있는 상품' : `${data.petName}와 비슷한 체형이 선택한 상품`}
        </p>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {isFallback
          ? '아직 체형 데이터가 부족해 인기 상품으로 대신 보여드려요'
          : `가슴 둘레 ${data.chestSize}cm 기준 · ${data.similarUserCount}명 데이터`}
      </p>

      {/* Product Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {data.products.map((product) => (
          <button
            key={product.productId}
            onClick={() => onProductClick(product.productId)}
            className="shrink-0 w-28 text-left"
          >
            <div className="relative w-28 aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!isFallback && product.popularityPercent > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#14314F] text-white text-[10px] font-bold rounded-full">
                  {product.popularityPercent}%
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
              {product.name}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {product.price.toLocaleString()}원
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
