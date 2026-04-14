import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';
import CategoryTabs from '../common/CategoryTabs';
import { productCategories } from '../../data/mockCategories';
import type { ProductListItem } from '../../services/api';
import { getProducts, filterProducts } from '../../services/api';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '../common/Pagination';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: ProductListItem) => void;
}

// 탭 ID → 백엔드 categoryId 매핑 (CategoryPage와 동일)
const CATEGORY_ID_MAP: Record<string, number> = {
  outer: 1,
  top: 2,
  'one-piece': 3,
  muffler: 4,
  shoes: 5,
  accessory: 6,
  etc: 7,
};

// 전체 카테고리 추가
const categoriesWithAll = [{ id: 'all', label: 'All' }, ...productCategories];

export default function ProductSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: ProductSelectionModalProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 모달이 열리거나 카테고리가 바뀔 때 상품 조회
  useEffect(() => {
    if (!isOpen) return;

    async function fetchProducts() {
      setIsLoading(true);
      try {
        let result;
        if (selectedCategory === 'all') {
          result = await getProducts({ size: 48 });
        } else {
          const categoryId = CATEGORY_ID_MAP[selectedCategory];
          result = categoryId
            ? await filterProducts({ categoryId, size: 48 })
            : await getProducts({ size: 48 });
        }
        setProducts(result.content);
      } catch (error) {
        console.error('상품 로드 실패:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [isOpen, selectedCategory]);

  // 모달 닫힐 때 카테고리 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    canGoNext,
    canGoPrev,
  } = usePagination({
    items: products,
    itemsPerPage: 12,
  });

  if (!isOpen) return null;

  function handleProductClick(product: ProductListItem) {
    onSelect(product);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 flex items-center justify-between z-20">
          <h2 className="text-lg font-bold text-gray-900">옷 선택하기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="sticky z-10">
          <CategoryTabs
            categories={categoriesWithAll}
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="shadow-xs"
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-sm">상품을 불러오는 중...</p>
            </div>
          ) : (
            <>
              <ProductGrid
                products={paginatedItems}
                onProductClick={handleProductClick}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                canGoNext={canGoNext}
                canGoPrev={canGoPrev}
              />
            </>
          )}
        </div>
      </div>
      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
