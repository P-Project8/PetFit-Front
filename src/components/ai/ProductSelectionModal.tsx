import { X } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import ProductGrid from '../product/ProductGrid';
import type { Product } from '../../data/mockProducts';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export default function ProductSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: ProductSelectionModalProps) {
  const products = useProductStore((state) => state.products);

  if (!isOpen) return null;

  function handleProductClick(product: Product) {
    onSelect(product);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">옷 선택하기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <ProductGrid products={products} onProductClick={handleProductClick} />
        </div>
      </div>
    </div>
  );
}
