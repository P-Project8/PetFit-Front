import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { Product } from '../data/products';
import { useProductStore } from '../store/productStore';
import { generateStylingImage } from '../services/aiStylingService';

export function useAIStyling() {
  const location = useLocation();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);

  const preSelectedProduct = location.state?.selectedProduct as
    | Product
    | undefined;

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [petImage, setPetImage] = useState<string | null>(null);
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
      const result = await generateStylingImage(petImage, clothingImage);
      setResultImage(result);
      toast.success('스타일링 이미지가 생성되었습니다!');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '';
      const errorStatus =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as { status: number }).status
          : null;

      if (errorMessage === '강아지나 옷 사진이 아닌 것 같습니다. 다시 확인해주세요.') {
          toast.error(errorMessage);
      } else if (errorMessage.includes('429') || errorStatus === 429) {
        toast.error(
          '이용 한도가 초과되었습니다. 유료 결제(Billing)가 필요합니다.'
        );
      } else if (errorMessage.includes('404')) {
        toast.error('모델을 찾을 수 없습니다. (지원되지 않는 모델)');
      } else {
        toast.error('스타일링 중 오류가 발생했습니다. (콘솔 확인)');
      }
    } finally {
      setIsProcessing(false);
    }
  }

  function handleReset() {
    setPetImage(null);
    setClothingImage(null);
    setSelectedProduct(null);
    setResultImage(null);
  }

  function handleShare() {
    if (!resultImage) return;

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

  async function handleDownload() {
    if (!resultImage) return;

    try {
      // 1. Fetch the image and convert to Blob
      // resultImage can be a base64 string or a remote URL
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 2. Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `petfit-styling-${Date.now()}.png`;
      document.body.appendChild(link);
      
      // 3. Trigger download
      link.click();
      
      // 4. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('이미지가 저장되었습니다!');
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: Try to share if download fails (common in social browsers)
      if (navigator.share) {
        try {
            // Need to create a file object for sharing
             const response = await fetch(resultImage); // Re-fetch or reuse blob? Better clean
             const blob = await response.blob();
             const file = new File([blob], `petfit-styling-${Date.now()}.png`, { type: blob.type });

            await navigator.share({
                files: [file],
                title: 'PetFit 스타일링',
                text: '우리 아이 AI 스타일링 결과'
            });
            return;
        } catch (shareError) {
             // Share also failed or user cancelled
        }
      }

      toast.error('이미지 저장에 실패했습니다. 이미지를 길게 눌러 저장해주세요.');
    }
  }

  function getSimilarProducts() {
    if (!selectedProduct) {
      return products
        .sort((a, b) => (b.wishCount || 0) - (a.wishCount || 0))
        .slice(0, 4);
    }

    const sameCategoryProducts = products.filter(
      (p) =>
        p.category === selectedProduct.category && p.id !== selectedProduct.id
    );

    const priceMin = selectedProduct.price * 0.6;
    const priceMax = selectedProduct.price * 1.4;

    const similarPriceProducts = sameCategoryProducts.filter(
      (p) => p.price >= priceMin && p.price <= priceMax
    );

    const candidateProducts =
      similarPriceProducts.length >= 4
        ? similarPriceProducts
        : sameCategoryProducts;

    const sorted = candidateProducts.sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.5 + (a.wishCount || 0) * 0.001;
      const scoreB = (b.rating || 0) * 0.5 + (b.wishCount || 0) * 0.001;
      return scoreB - scoreA;
    });

    const result = sorted.slice(0, 4);
    if (result.length < 4) {
      const remainingCount = 4 - result.length;
      const remainingProducts = products
        .filter(
          (p) =>
            p.id !== selectedProduct.id && !result.some((r) => r.id === p.id)
        )
        .sort((a, b) => (b.wishCount || 0) - (a.wishCount || 0))
        .slice(0, remainingCount);
      result.push(...remainingProducts);
    }

    return result;
  }

  return {
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
  };
}
