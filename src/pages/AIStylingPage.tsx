import OnboardingModal from '../components/ai/OnboardingModal';
import ProductSelectionModal from '../components/ai/ProductSelectionModal';
import PageHeader from '../components/layout/PageHeader';
import LoadingSplashScreen from '@/components/ai/LoadingSplashScreen';
import ImageUploadStep from '../components/ai/ImageUploadStep';
import ResultSection from '../components/ai/ResultSection';
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
          <ImageUploadStep
            petImage={petImage}
            clothingImage={clothingImage}
            selectedProduct={selectedProduct}
            isProcessing={isProcessing}
            resultImage={resultImage}
            onPetImageChange={handlePetImageChange}
            onClothingImageChange={handleClothingImageChange}
            onPetImageRemove={() => setPetImage(null)}
            onClothingImageRemove={() => {
              setClothingImage(null);
              setSelectedProduct(null);
            }}
            onShowProductModal={() => setShowProductModal(true)}
            onShowOnboarding={() => setShowOnboarding(true)}
            onAIStyling={handleAIStyling}
          />
        )}

        {resultImage && (
          <ResultSection
            resultImage={resultImage}
            selectedProduct={selectedProduct}
            similarProducts={similarProducts}
            onDownload={handleDownload}
            onShare={handleShare}
            onReset={handleReset}
            onProductClick={(product) => navigate(`/product/${product.id}`)}
            onGoToProduct={() => navigate(`/product/${selectedProduct?.id}`)}
          />
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
