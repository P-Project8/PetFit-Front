import { useState, useRef } from 'react';
import { X, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '../../data/products';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';

interface ProductOptionModalProps {
  product: Product;
  onClose: () => void;
}

interface SelectedOption {
  id: string;
  size: string;
  color: string;
  quantity: number;
}

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['블랙', '화이트', '베이지', '네이비'];

export default function ProductOptionModal({
  product,
  onClose,
}: ProductOptionModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [options, setOptions] = useState<SelectedOption[]>([]);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const optionIdCounter = useRef(0);

  const totalQuantity = options.reduce((sum, opt) => sum + opt.quantity, 0);

  function tryAddOption(size: string, color: string) {
    if (!size || !color) {
      return;
    }

    // Check if same option already exists
    const exists = options.find(
      (opt) => opt.size === size && opt.color === color
    );

    if (exists) {
      alert('이미 추가된 옵션입니다.');
      setSelectedSize('');
      setSelectedColor('');
      return;
    }

    // Add new option
    optionIdCounter.current += 1;
    const newOption: SelectedOption = {
      id: `${size}-${color}-${optionIdCounter.current}`,
      size,
      color,
      quantity: 1,
    };

    setOptions((prev) => [...prev, newOption]);
    setSelectedSize('');
    setSelectedColor('');
  }

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    setIsSizeOpen(false);
    if (size && selectedColor) {
      tryAddOption(size, selectedColor);
    }
  }

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setIsColorOpen(false);
    if (selectedSize && color) {
      tryAddOption(selectedSize, color);
    }
  }

  function handleQuantityChange(id: string, delta: number) {
    setOptions(
      options.map((opt) => {
        if (opt.id === id) {
          const newQuantity = opt.quantity + delta;
          if (newQuantity >= 1 && newQuantity <= 99) {
            return { ...opt, quantity: newQuantity };
          }
        }
        return opt;
      })
    );
  }

  function handleRemoveOption(id: string) {
    setOptions(options.filter((opt) => opt.id !== id));
  }

  function handleAddToCart() {
    if (options.length === 0) {
      toast('옵션을 선택해주세요.');
      return;
    }

    // 선택한 모든 옵션을 장바구니에 추가
    options.forEach((option) => {
      addItem(product, option.size, option.color, option.quantity);
    });

    toast.success('장바구니에 추가되었습니다.');
    onClose();
  }

  function handlePurchase() {
    if (options.length === 0) {
      toast('옵션을 선택해주세요.');
      return;
    }

    // TODO: 구매하기 로직
    alert('구매하기 기능은 준비 중입니다.');
    onClose();
  }

  const totalPrice = options.reduce(
    (sum, opt) => sum + product.price * opt.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto">
        {/* Content */}
        <div className="px-4 py-6 space-y-4">
          {/* Size Dropdown */}
          <div>
            <button
              onClick={() => setIsSizeOpen(!isSizeOpen)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-500 flex items-center justify-between"
            >
              <span>{selectedSize || '사이즈'}</span>
              {isSizeOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {isSizeOpen && (
              <div className="mt-2 border border-gray-300 rounded-lg bg-white overflow-hidden">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div>
            <button
              onClick={() => setIsColorOpen(!isColorOpen)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-500 flex items-center justify-between"
            >
              <span>{selectedColor || '색상'}</span>
              {isColorOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {isColorOpen && (
              <div className="mt-2 border border-gray-300 rounded-lg bg-white overflow-hidden">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Options */}
          {options.length > 0 && (
            <div className="py-2 space-y-3">
              {options.map((option) => (
                <div key={option.id} className="rounded-lg p-4 bg-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-xs text-gray-900 font-bold">
                      {option.size} / {option.color}
                    </p>

                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between w-28 border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
                      <button
                        onClick={() => handleQuantityChange(option.id, -1)}
                        disabled={option.quantity <= 1}
                        className="disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3 text-gray-700" />
                      </button>
                      <span className="text-xs text-gray-900">
                        {option.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(option.id, 1)}
                        disabled={option.quantity >= 99}
                        className="disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3 text-gray-700" />
                      </button>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {(product.price * option.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom) + 16px]">
          {/* Total Price */}
          {options.length > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">
                총 {totalQuantity}개
              </span>
              <span className="text-sm font-bold text-[#14314F]">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          )}
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={options.length === 0}
              className={`flex-1 py-3 rounded-lg font-semibold text-base transition-colors ${
                options.length > 0
                  ? 'bg-gray-100 text-[#14314F] active:bg-gray-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              장바구니
            </button>
            <button
              onClick={handlePurchase}
              disabled={options.length === 0}
              className={`flex-1 py-3 rounded-lg font-semibold text-base transition-colors ${
                options.length > 0
                  ? 'bg-[#14314F] text-white active:bg-[#0d1f33]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
