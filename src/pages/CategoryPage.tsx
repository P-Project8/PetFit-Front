import { useParams, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
}

interface CategoryItem {
  id: string;
  label: string;
}

const categories: CategoryItem[] = [
  { id: 'new', label: 'New' },
  { id: 'outer', label: 'Outer' },
  { id: 'top', label: 'Top' },
  { id: 'one-piece', label: 'One-piece' },
  { id: 'muffler', label: 'Muffler' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessory', label: 'Acc' },
  { id: 'etc', label: 'Etc' },
  { id: 'sale', label: 'Sale' },
  { id: 'hot', label: 'Hot' },
];

// Mock product data
const products: Product[] = [
  {
    id: 1,
    name: '강아지 한복',
    price: 450000,
    category: 'one-piece',
    isNew: true,
  },
  { id: 2, name: '겨자 후드티', price: 280000, category: 'outer', isHot: true },
  { id: 3, name: '당근 캐릭터 나시', price: 390000, category: 'top' },
  {
    id: 4,
    name: '곰돌이 방수복',
    price: 180000,
    salePrice: 90000,
    category: 'outer',
    isSale: true,
  },
  {
    id: 5,
    name: '알록달록 후드티',
    price: 520000,
    category: 'top',
    isHot: true,
  },
  { id: 6, name: '체크 머플러', price: 85000, category: 'muffler' },
  { id: 7, name: '방한 부츠', price: 120000, category: 'shoes' },
  { id: 8, name: '리본 목걸이', price: 45000, category: 'accessory' },
  {
    id: 9,
    name: '원피스 드레스',
    price: 350000,
    category: 'one-piece',
    isNew: true,
  },
  { id: 10, name: '패딩 점퍼', price: 480000, category: 'outer', isHot: true },
  { id: 11, name: '니트 스웨터', price: 220000, category: 'top' },
  {
    id: 12,
    name: '레인코트',
    price: 150000,
    salePrice: 75000,
    category: 'outer',
    isSale: true,
  },
  {
    id: 13,
    name: '스트라이프 티셔츠',
    price: 180000,
    category: 'top',
    isNew: true,
  },
  { id: 14, name: '데님 재킷', price: 420000, category: 'outer' },
  {
    id: 15,
    name: '플리스 조끼',
    price: 250000,
    salePrice: 125000,
    category: 'outer',
    isSale: true,
  },
  { id: 16, name: '하트 니트', price: 290000, category: 'top', isHot: true },
  { id: 17, name: '캐시미어 목도리', price: 95000, category: 'muffler' },
  { id: 18, name: '운동화', price: 140000, category: 'shoes' },
  { id: 19, name: '벨벳 리본', price: 38000, category: 'accessory' },
  { id: 20, name: '튤 원피스', price: 380000, category: 'one-piece' },
  {
    id: 21,
    name: '패턴 스웨터',
    price: 300000,
    salePrice: 180000,
    category: 'top',
    isSale: true,
  },
  { id: 22, name: '베이직 후드', price: 260000, category: 'top', isNew: true },
  { id: 23, name: '양털 조끼', price: 340000, category: 'outer', isNew: true },
  { id: 24, name: '레인부츠', price: 110000, category: 'shoes' },
  { id: 25, name: '모자', price: 55000, category: 'etc' },
  { id: 26, name: '양말 세트', price: 28000, category: 'etc' },
  { id: 27, name: '배낭', price: 75000, category: 'etc' },
];

const categoryLabels: Record<string, string> = {
  new: '신상품',
  outer: '아우터',
  top: '상의',
  'one-piece': '원피스',
  muffler: '머플러',
  shoes: '신발',
  accessory: '액세서리',
  sale: '할인 상품',
  hot: '인기 상품',
  etc: '기타',
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  const currentCategoryId = categoryId || 'new';
  const categoryName = categoryLabels[currentCategoryId] || '전체 카테고리';

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    if (currentCategoryId === 'new') return product.isNew;
    if (currentCategoryId === 'hot') return product.isHot;
    if (currentCategoryId === 'sale') return product.isSale;
    return product.category === currentCategoryId;
  });

  // Auto-scroll to active category on mount or category change
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const button = activeButtonRef.current;
      const container = scrollContainerRef.current;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Center the active button
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentCategoryId]);

  function handleCategoryClick(id: string) {
    navigate(`/category/${id}`);
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-16">
      {/* Custom Header for Category Page */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4">
          <div className="flex items-center h-12">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="flex-1 text-center text-base font-semibold text-gray-900 pr-10">
              {categoryName}
            </h1>
          </div>
        </div>
      </header>

      {/* Horizontal Scrollable Category Tabs */}
      <div className="bg-white shadow-xs sticky top-12 z-10">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        >
          {categories.map((category) => {
            const isActive = category.id === currentCategoryId;
            return (
              <button
                key={category.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-['Balsamiq'] whitespace-nowrap
                  transition-all duration-200 shrink-0
                  ${
                    isActive
                      ? 'bg-[#14314F] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 shadow-sm">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                {product.salePrice && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                    {Math.round(
                      ((product.price - product.salePrice) / product.price) *
                        100
                    )}
                    %
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-0.5 truncate group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h4>
              {product.salePrice ? (
                <div className="flex items-center space-x-1.5">
                  <p className="text-sm font-bold text-red-600">
                    ₩{product.salePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 line-through">
                    ₩{product.price.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-900">
                  ₩{product.price.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-sm">
              해당 카테고리에 상품이 없습니다
            </p>
          </div>
        )}
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
