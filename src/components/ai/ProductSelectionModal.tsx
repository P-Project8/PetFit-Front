import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';
import CategoryTabs from '../common/CategoryTabs';
import { productCategoryTabs, CATEGORY_ID_MAP } from '../../constants/categories';
import type { ProductListItem, ProductDetail } from '../../services/api';
import { getProducts, filterProducts, getProductById } from '../../services/api';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '../common/Pagination';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: ProductListItem, color?: string, size?: string) => void;
}

const categoriesWithAll = [{ id: 'all', label: 'All' }, ...productCategoryTabs];

export default function ProductSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: ProductSelectionModalProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [pendingProduct, setPendingProduct] = useState<ProductListItem | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory('all');
      setPendingProduct(null);
      setProductDetail(null);
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [isOpen]);

  const { currentPage, totalPages, paginatedItems, goToPage, canGoNext, canGoPrev } =
    usePagination({ items: products, itemsPerPage: 12 });

  if (!isOpen) return null;

  async function handleProductClick(product: ProductListItem) {
    setPendingProduct(product);
    setSelectedColor(null);
    setSelectedSize(null);
    setIsLoadingDetail(true);
    try {
      const detail = await getProductById(product.id);
      setProductDetail(detail);
    } catch {
      setProductDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }

  function handleBack() {
    setPendingProduct(null);
    setProductDetail(null);
    setSelectedColor(null);
    setSelectedSize(null);
  }

  function handleConfirm() {
    if (!pendingProduct) return;
    onSelect(pendingProduct, selectedColor ?? undefined, selectedSize ?? undefined);
    onClose();
  }

  const options = productDetail?.options ?? [];
  const uniqueColors = [...new Set(options.map((o) => o.color))];
  const sizesForColor = selectedColor
    ? options.filter((o) => o.color === selectedColor).map((o) => o.size)
    : [];

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setSelectedSize(null);
  }

  const canConfirm =
    pendingProduct !== null &&
    (options.length === 0 || (selectedColor !== null && selectedSize !== null));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            {pendingProduct && (
              <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 -ml-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-900">
              {pendingProduct ? '사이즈 / 컬러 선택' : '옷 선택하기'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!pendingProduct ? (
          <>
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
                  <ProductGrid products={paginatedItems} onProductClick={handleProductClick} />
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
          </>
        ) : (
          /* Option Selection Panel */
          <div className="flex-1 overflow-y-auto">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm">옵션을 불러오는 중...</p>
              </div>
            ) : (
              <div className="p-4 space-y-5">
                {/* Product Summary */}
                <div className="flex gap-3 items-center">
                  <img
                    src={pendingProduct.thumbnailUrl}
                    alt={pendingProduct.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {pendingProduct.name}
                    </p>
                    <p className="text-base font-bold text-[#14314F] mt-1">
                      {pendingProduct.price.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {options.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">선택 가능한 옵션이 없습니다.</p>
                ) : (
                  <>
                    {/* Color */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">컬러</p>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              selectedColor === color
                                ? 'border-[#14314F] bg-[#14314F] text-white'
                                : 'border-gray-200 text-gray-700 hover:border-[#14314F]'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size */}
                    {selectedColor && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">사이즈</p>
                        <div className="flex flex-wrap gap-2">
                          {sizesForColor.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                selectedSize === size
                                  ? 'border-[#14314F] bg-[#14314F] text-white'
                                  : 'border-gray-200 text-gray-700 hover:border-[#14314F]'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirm Button */}
        {pendingProduct && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full py-3 bg-[#14314F] text-white font-bold text-base rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              선택 완료
            </button>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
