import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    title: '반려동물 사진 선택',
    description: '스타일링 하고 싶은 강아지의\n사진을 업로드 해주세요',
    image: '/images/onboarding1.png',
    step: '1/3',
  },
  {
    title: '옷 선택하기',
    description: '입혀볼 옷을 직접 업로드하거나\n상품 목록에서 선택하세요',
    image: '/images/onboarding2.png',
    step: '2/3',
  },
  {
    title: 'AI 스타일링 완성!',
    description:
      'AI가 자동으로 옷을 입혀드려요\n결과를 공유하고 상품도 구매해보세요',
    image: '/images/onboarding3.png',
    step: '3/3',
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  function handleNext() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  }

  function handlePrev() {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }

  function handleClose() {
    localStorage.setItem('ai-styling-onboarding-seen', 'true');
    setCurrentSlide(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mt-12">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl p-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Slide Content */}
        <div className="text-center pt-4 pb-6">
          {/* Step Indicator */}
          <p className="text-xs text-gray-400 mb-2">
            {slides[currentSlide].step}
          </p>

          {/* Emoji */}
          <img
            className="w-48 m-auto rounded-2xl mb-6 aspect-square overflow-hidden object-cover"
            src={slides[currentSlide].image}
            alt="@onboardingImg"
          />

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {slides[currentSlide].title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#14314F] w-6' : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg active:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-[#14314F] text-white font-semibold rounded-lg active:bg-[#0d1f33] transition-colors flex items-center justify-center gap-2"
          >
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
            {currentSlide < slides.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
