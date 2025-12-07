import {
  Upload,
  HelpCircle,
  Share2,
  RotateCcw,
  Plus,
  ChevronRight,
  X,
  Shirt,
  Download,
} from 'lucide-react';
import OnboardingModal from '../components/ai/OnboardingModal';
import ProductSelectionModal from '../components/ai/ProductSelectionModal';
import PageHeader from '../components/layout/PageHeader';
import ProductGrid from '../components/product/ProductGrid';
import LoadingSplashScreen from '@/components/ai/LoadingSplashScreen';
import { useAIStyling } from '../hooks/useAIStyling';

export default function AIStylingPage() {
  const {
    petImage,
    clothingImage,
    selectedProduct,
    isProcessing,
    resultImage,
    showOnboarding,
    showProductModal,
    setShowOnboarding,
    setShowProductModal,
    setPetImage,
    setClothingImage,
    setSelectedProduct,
    handlePetImageChange,
    handleClothingImageChange,
    handleProductSelect,
    handleAIStyling,
    handleReset,
    handleShare,
    handleDownload,
    getSimilarProducts,
    navigate,
  } = useAIStyling();

  const similarProducts = getSimilarProducts();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col pt-12">
      <PageHeader title="AI 스타일링" onBackClick={() => navigate(-1)} />

      <div className="pt-4 px-4 pb-8 flex-1 flex flex-col justify-center">
        {!resultImage && (
          <>
            {/* Help Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>도움말</span>
              </button>
            </div>

            {/* Steps Container */}
            <div
              className={`space-y-4 mb-6 ${
                resultImage ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              {/* Step Cards Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Step 1: Pet Image Card */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#14314F] text-white flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      반려동물
                    </h3>
                  </div>

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
                      className={`block w-full aspect-3/4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden relative ${
                        petImage
                          ? 'border-none shadow-md'
                          : 'border-dashed border-gray-300 bg-white hover:border-[#14314F] hover:shadow-sm'
                      }`}
                    >
                      {petImage ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={petImage}
                            alt="Pet"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPetImage(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                            aria-label="반려동물 이미지 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <Upload className="w-8 h-8 mb-2" />
                          <p className="text-xs font-medium px-2 text-center">
                            사진 선택
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Step 2: Clothing Card */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#14314F] text-white flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">옷</h3>
                  </div>

                  <div className="relative space-y-2">
                    {clothingImage ? (
                      <>
                        <div
                          onClick={() => setShowProductModal(true)}
                          className="w-full aspect-3/4 rounded-xl overflow-hidden cursor-pointer shadow-md relative group"
                        >
                          <img
                            src={clothingImage}
                            alt="Selected clothing"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setClothingImage(null);
                              setSelectedProduct(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                            aria-label="옷 이미지 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                          {selectedProduct && (
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-2">
                              <p className="text-white text-xs font-medium line-clamp-2">
                                {selectedProduct.name}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleClothingImageChange}
                            className="hidden"
                            id="clothing-image-input-2"
                          />
                          <label
                            htmlFor="clothing-image-input-2"
                            className="flex items-center justify-center gap-1 w-full py-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            <span>다른 옷 업로드</span>
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Product Selection Button */}
                        <button
                          onClick={() => setShowProductModal(true)}
                          className="w-full aspect-3/4 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-[#14314F] hover:shadow-sm transition-all"
                        >
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Shirt className="w-8 h-8 mb-2" />
                            <p className="text-xs font-medium">상품 선택</p>
                          </div>
                        </button>

                        {/* Upload Option */}
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
                            className="flex items-center justify-center gap-1 w-full py-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            <span>직접 업로드</span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 py-2">
                <div
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    petImage ? 'bg-[#14314F]' : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    clothingImage ? 'bg-[#14314F]' : 'bg-gray-200'
                  }`}
                />
              </div>

              {/* AI Styling Button */}
              <button
                onClick={handleAIStyling}
                disabled={!petImage || !clothingImage || isProcessing}
                className={`w-full py-3 bg-[#14314F] text-white font-bold text-base rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2 ${
                  resultImage ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                <span>옷 입혀보기</span>
              </button>
            </div>
          </>
        )}

        {/* Result Section */}
        {resultImage && (
          <div className="mt-4 space-y-8">
            {/* Result Image */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center ml-4">
                스타일링 결과
              </h2>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <img
                  src={resultImage}
                  alt="AI Styling Result"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                * AI가 예측한 스타일링 이미지로, 실제 착용 핏과는 다를 수
                있습니다
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="py-3 bg-white text-[#14314F] border border-gray-300 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                저장하기
              </button>
              <button
                onClick={handleShare}
                className="py-3 bg-white text-[#14314F] border border-gray-300 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
              <button
                onClick={handleReset}
                className="py-3 col-span-2 bg-gray-100 text-gray-700 font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                다시하기
              </button>
            </div>

            {/* Go to Product */}
            {selectedProduct && (
              <button
                onClick={() => navigate(`/product/${selectedProduct.id}`)}
                className="w-full text-[#14314F] font-semibold active:scale-[0.98] transition-all flex items-center justify-end gap-1"
              >
                <span>이 상품 보러가기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Similar Products */}
            <div className="pt-6 mt-6 border-t-4 border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                추천 상품
              </h3>
              <ProductGrid
                products={similarProducts}
                onProductClick={(product) => navigate(`/product/${product.id}`)}
              />
            </div>
          </div>
        )}

        {/* Loading Splash Screen */}
        {isProcessing && <LoadingSplashScreen />}

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
    </div>
  );
}
