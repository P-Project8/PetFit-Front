import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Upload, HelpCircle, Share2, RotateCcw, Sparkles } from 'lucide-react';
import type { Product } from '../data/mockProducts';
import OnboardingModal from '../components/ai/OnboardingModal';
import ProductSelectionModal from '../components/ai/ProductSelectionModal';
import PageHeader from '../components/layout/PageHeader';
import { toast } from 'sonner';
import ProductGrid from '../components/product/ProductGrid';
import { useProductStore } from '../store/productStore';

export default function AIStylingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);

  const preSelectedProduct = location.state?.selectedProduct as
    | Product
    | undefined;

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [petImage, setPetImage] = useState<string | null>(null);
  const [petImageFile, setPetImageFile] = useState<File | null>(null);

  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    preSelectedProduct || null
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // Check if onboarding has been seen
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(
      'ai-styling-onboarding-seen'
    );
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Set clothing image if product is pre-selected
  useEffect(() => {
    if (preSelectedProduct?.imageUrl) {
      setClothingImage(preSelectedProduct.imageUrl);
      setSelectedProduct(preSelectedProduct);
    }
  }, [preSelectedProduct]);

  function handlePetImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPetImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleClothingImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClothingImage(reader.result as string);
        setSelectedProduct(null);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleProductSelect(product: Product) {
    setSelectedProduct(product);
    setClothingImage(product.imageUrl || null);
  }

  async function handleAIStyling() {
    if (!petImage || !clothingImage) {
      toast('반려동물 사진과 옷을 모두 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setResultImage(null);

    try {
      // TODO: Gemini API 연동
      // const response = await callGeminiAPI(petImageFile, clothingImage);

      // Mock: 2초 후 결과 표시
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result (실제로는 Gemini API 결과)
      setResultImage(petImage); // 임시로 pet image 표시

      toast.success('AI 스타일링이 완성되었습니다!');
    } catch (error) {
      toast.error('AI 스타일링에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleReset() {
    setPetImage(null);
    setPetImageFile(null);
    setClothingImage(null);
    setSelectedProduct(null);
    setResultImage(null);
  }

  function handleShare() {
    if (!resultImage) return;

    // Web Share API
    if (navigator.share) {
      navigator
        .share({
          title: 'PetFit AI 스타일링',
          text: '우리 아이 스타일링 결과를 확인해보세요!',
        })
        .catch(() => {
          toast('공유에 실패했습니다.');
        });
    } else {
      toast('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  }

  // Get similar products (mock)
  const similarProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white py-12">
      <PageHeader title="스타일링" onBackClick={() => navigate(-1)} />

      <div className="pt-6 px-4 space-y-6 relative">
        <button
          onClick={() => setShowOnboarding(true)}
          className="text-gray-600 hover:text-gray-900 absolute top-7 right-7"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        {/* Step 1: Pet Image */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            Step 1. 반려동물 사진
          </h2>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePetImageChange}
              className="hidden"
              id="pet-image-input"
            />
            <label
              htmlFor="pet-image-input"
              className={`block w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
                petImage
                  ? 'border-[#14314F] bg-gray-50'
                  : 'border-gray-300 bg-gray-50 hover:border-[#14314F] hover:bg-gray-100'
              }`}
            >
              {petImage ? (
                <img
                  src={petImage}
                  alt="Pet"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload className="w-12 h-12 mb-2" />
                  <p className="text-sm font-medium">사진을 선택하세요</p>
                  <p className="text-xs">또는 촬영하기</p>
                </div>
              )}
            </label>
          </div>
        </section>

        {/* Step 2: Clothing Selection */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Step 2. 옷 선택</h2>
          <div className="grid grid-cols-2 gap-2">
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleClothingImageChange}
                className="hidden"
                id="clothing-image-input"
              />
              <label
                htmlFor="clothing-image-input"
                className="block w-full aspect-square rounded-xl border-2 border-gray-300 bg-gray-50 hover:border-[#14314F] hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <Upload className="w-8 h-8 mb-1" />
                  <p className="text-xs font-medium">직접 업로드</p>
                </div>
              </label>
            </div>

            {/* Product Selection Button */}
            <button
              onClick={() => setShowProductModal(true)}
              className="w-full aspect-square rounded-xl border-2 border-gray-300 bg-gray-50 hover:border-[#14314F] hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Sparkles className="w-8 h-8 mb-1" />
                <p className="text-xs font-medium">상품 선택</p>
              </div>
            </button>
          </div>

          {/* Selected Clothing Preview */}
          {clothingImage && (
            <div className="mt-4">
              <div className="relative w-full aspect-square rounded-2xl border-2 border-[#14314F] overflow-hidden">
                <img
                  src={clothingImage}
                  alt="Selected clothing"
                  className="w-full h-full object-cover"
                />
                {selectedProduct && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm font-semibold">
                      {selectedProduct.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* AI Styling Button */}
        <button
          onClick={handleAIStyling}
          disabled={!petImage || !clothingImage || isProcessing}
          className="w-full py-4 bg-[#14314F] text-white font-bold text-lg rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed active:bg-[#0d1f33] transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI가 스타일링 중...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />옷 입혀보기
            </>
          )}
        </button>

        {/* Result */}
        {resultImage && (
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-gray-900">
              ✨ 스타일링 결과
            </h2>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#14314F]">
              <img
                src={resultImage}
                alt="AI Styling Result"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-white border-2 border-[#14314F] text-[#14314F] font-semibold rounded-lg active:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg active:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                다시하기
              </button>
            </div>

            {/* Go to Product */}
            {selectedProduct && (
              <button
                onClick={() => navigate(`/product/${selectedProduct.id}`)}
                className="w-full py-3 bg-[#14314F] text-white font-semibold rounded-lg active:bg-[#0d1f33] transition-colors"
              >
                이 상품 보러가기
              </button>
            )}

            {/* Similar Products */}
            <div className="pt-4 border-t-8 border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                비슷한 스타일 상품
              </h3>
              <ProductGrid
                products={similarProducts}
                onProductClick={(product) => navigate(`/product/${product.id}`)}
              />
            </div>
          </section>
        )}
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Product Selection Modal */}
      <ProductSelectionModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={handleProductSelect}
      />
    </div>
  );
}
