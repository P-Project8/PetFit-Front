import { X } from 'lucide-react';
import QuantityControl from './QuantityControl';
import type { CartItem as CartItemType } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (cartItemId: string, delta: number) => void;
  onRemove: (cartItemId: string) => void;
  onProductClick: (productId: number) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onProductClick,
}: CartItemProps) {
  const discountedPrice = item.product.discountRate
    ? item.product.price * (1 - item.product.discountRate / 100)
    : item.product.price;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div
          className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden cursor-pointer"
          onClick={() => onProductClick(item.product.id)}
        >
          {item.product.imageUrl && (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
              {item.product.name}
            </h3>
            <button
              onClick={() => onRemove(item.cartItemId)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {item.size} / {item.color}
          </p>

          <div className="flex items-center justify-between">
            {/* Quantity Control */}
            <QuantityControl
              quantity={item.quantity}
              onIncrease={() => onQuantityChange(item.cartItemId, 1)}
              onDecrease={() => onQuantityChange(item.cartItemId, -1)}
            />

            {/* Price */}
            <div className="text-right">
              {item.product.discountRate ? (
                <>
                  <p className="text-xs text-gray-400 line-through">
                    {(item.product.price * item.quantity).toLocaleString()}원
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {(discountedPrice * item.quantity).toLocaleString()}원
                  </p>
                </>
              ) : (
                <p className="text-sm font-bold text-gray-900">
                  {(discountedPrice * item.quantity).toLocaleString()}원
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
