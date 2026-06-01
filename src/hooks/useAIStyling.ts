import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { ProductListItem } from '../services/api';
import { getProducts, filterProducts } from '../services/api';
import { generateStylingImage } from '../services/aiStylingService';

export function useAIStyling() {
  const location = useLocation();
  const navigate = useNavigate();

  const preSelectedProduct = location.state?.selectedProduct as
    | ProductListItem
    | undefined;

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [petImage, setPetImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(
    preSelectedProduct || null
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductListItem[]>([]);

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
    if (preSelectedProduct?.thumbnailUrl) {
      setClothingImage(preSelectedProduct.thumbnailUrl);
      setSelectedProduct(preSelectedProduct);
    }
  }, [preSelectedProduct]);

  // 결과가 생성되면 유사 상품 조회
  useEffect(() => {
    if (!resultImage) return;

    async function fetchSimilarProducts() {
      try {
        let result;
        if (selectedProduct) {
          // 같은 카테고리에서 우선 조회
          const CATEGORY_ID_MAP: Record<string, number> = {
            outer: 1, top: 2, 'one-piece': 3, muffler: 4,
            shoes: 5, accessory: 6, etc: 7,
          };
          const categoryId = CATEGORY_ID_MAP[selectedProduct.categoryName?.toLowerCase() ?? ''];
          result = categoryId
            ? await filterProducts({ categoryId, size: 8 })
            : await getProducts({ size: 8 });
        } else {
          result = await getProducts({ size: 8, sort: 'createdAt,desc' });
        }
        const filtered = result.content
          .filter((p) => p.id !== selectedProduct?.id)
          .slice(0, 4);
        setSimilarProducts(filtered);
      } catch {
        setSimilarProducts([]);
      }
    }

    fetchSimilarProducts();
  }, [resultImage, selectedProduct]);

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

  function handleProductSelect(product: ProductListItem) {
    setSelectedProduct(product);
    setClothingImage(product.thumbnailUrl || null);
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
    setSimilarProducts([]);
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
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `petfit-styling-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('이미지가 저장되었습니다!');
    } catch (error) {
      console.error('Download failed:', error);

      if (navigator.share) {
        try {
          const response = await fetch(resultImage);
          const blob = await response.blob();
          const file = new File([blob], `petfit-styling-${Date.now()}.png`, { type: blob.type });
          await navigator.share({ files: [file], title: 'PetFit 스타일링', text: '우리 아이 AI 스타일링 결과' });
          return;
        } catch {
          // 공유도 실패한 경우
        }
      }

      toast.error('이미지 저장에 실패했습니다. 이미지를 길게 눌러 저장해주세요.');
    }
  }

  function getSimilarProducts() {
    return similarProducts;
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
