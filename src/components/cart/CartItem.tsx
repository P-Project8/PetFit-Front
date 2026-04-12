import { X } from 'lucide-react';
import QuantityControl from './QuantityControl';
import type { CartResponse } from '../../services/api';

interface CartItemProps {
  item: CartResponse;
  onQuantityChange: (cartItemId: number, delta: number) => void;
  onRemove: (cartItemId: number) => void;
  onProductClick: (productId: number) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onProductClick,
}: CartItemProps) {
  // 실제 단가 = 기본가격 + 옵션추가가격
  const unitPrice = item.price + item.additionalPrice;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex gap-4">
        {/* 상품 이미지 */}
        <div
          className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden cursor-pointer"
          onClick={() => onProductClick(item.productId)}
        >
          {item.thumbnailUrl && (
            <img
              src={item.thumbnailUrl}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
              {item.productName}
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {item.size} / {item.color}
          </p>

          <div className="flex items-center justify-between">
            <QuantityControl
              quantity={item.quantity}
              onIncrease={() => onQuantityChange(item.id, 1)}
              onDecrease={() => onQuantityChange(item.id, -1)}
            />

            <p className="text-sm font-bold text-gray-900">
              {(unitPrice * item.quantity).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
