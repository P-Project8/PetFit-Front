import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductInfoSectionProps {
  category: string;
  name: string;
  price: number;
  discountRate: number;
  discountedPrice: number;
  description: string;
  isDiscounted: boolean;
}

export default function ProductInfoSection({
  category,
  name,
  price,
  discountRate,
  discountedPrice,
  description,
  isDiscounted,
}: ProductInfoSectionProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="px-4 py-4">
      <p className="mb-2 text-sm text-gray-500">{category}</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">{name}</h1>

      {/* Price */}
      <div className="mb-8">
        {isDiscounted ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-600">
                {discountRate}%
              </span>
              <span className="text-xl font-bold text-gray-900">
                {discountedPrice.toLocaleString()}원
              </span>
            </div>
            <p className="text-base text-gray-400 line-through">
              {price.toLocaleString()}원
            </p>
          </div>
        ) : (
          <p className="text-xl font-bold text-gray-900">
            {price.toLocaleString()}원
          </p>
        )}
      </div>

      {/* Description */}
      <div className="relative">
        <div
          className={`text-sm text-gray-600 leading-7 whitespace-pre-wrap ${
            !isDescriptionExpanded ? 'max-h-32 overflow-hidden' : ''
          }`}
        >
          {description.split('. ').join('.\n\n')}
        </div>
        {!isDescriptionExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      <button
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        className="w-full flex items-center justify-center gap-1 mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
      >
        {isDescriptionExpanded ? (
          <>
            접기 <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            더보기 <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
