import { Plus, Minus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}: QuantityControlProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
      <button
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        className="disabled:opacity-30"
      >
        <Minus className="w-3 h-3 text-gray-700" />
      </button>
      <span className="text-xs text-gray-900 mx-3 min-w-[20px] text-center">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className="disabled:opacity-30"
      >
        <Plus className="w-3 h-3 text-gray-700" />
      </button>
    </div>
  );
}
