import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '../../data/mockProducts';
import { useNavigate } from 'react-router';

interface ProductOptionModalProps {
  product: Product;
  onClose: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = [
  { name: '블랙', hex: '#000000' },
  { name: '화이트', hex: '#FFFFFF' },
  { name: '베이지', hex: '#F5F5DC' },
  { name: '네이비', hex: '#14314F' },
];

export default function ProductOptionModal({
  product,
  onClose,
}: ProductOptionModalProps) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  function handleQuantityChange(delta: number) {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  }

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      alert('사이즈와 색상을 선택해주세요.');
      return;
    }

    // TODO: 장바구니에 추가하는 로직
    alert('장바구니에 추가되었습니다.');
    onClose();
    navigate('/cart');
  }

  const totalPrice = product.price * quantity;
  const isFormValid = selectedSize && selectedColor;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">옵션 선택</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Product Info */}
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">사이즈</h3>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${
                    selectedSize === size
                      ? 'border-[#14314F] bg-[#14314F] text-white'
                      : 'border-gray-300 text-gray-700 active:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">색상</h3>
            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-colors flex items-center gap-2 ${
                    selectedColor === color.name
                      ? 'border-[#14314F] bg-[#14314F] text-white'
                      : 'border-gray-300 text-gray-700 active:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">수량</h3>
            <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1 disabled:opacity-30"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-base font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="p-1 disabled:opacity-30"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 rounded-lg px-4 py-4 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              총 금액
            </span>
            <span className="text-xl font-bold text-[#14314F]">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleAddToCart}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-lg font-semibold text-base transition-colors ${
              isFormValid
                ? 'bg-[#14314F] text-white active:bg-[#0d1f33]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
}
