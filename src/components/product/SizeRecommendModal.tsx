import { useState } from 'react';
import { X, Ruler, ChevronRight } from 'lucide-react';
import type { PetResponse, SizeRecommendationResponse } from '../../types/pet';

const MOCK_PETS: PetResponse[] = [
  {
    id: 1,
    name: '콩이',
    breed: '말티즈',
    age: 3,
    weight: 2.8,
    neckSize: 22,
    chestSize: 34,
    backLength: 28,
    createdAt: '',
    updatedAt: '',
  },
];

function buildMockResult(pet: PetResponse, productId: number, productName: string): SizeRecommendationResponse {
  return {
    petId: pet.id,
    petName: pet.name,
    productId,
    productName,
    recommendedSize: 'S',
    reasoning: `${pet.name}의 가슴 둘레(${pet.chestSize}cm)를 기준으로 분석했을 때, S 사이즈가 가장 편안한 착용감을 제공할 것으로 예측됩니다.`,
    optionFits: [
      { size: 'XS', fit: '타이트', description: '가슴 둘레 기준 약 2cm 작음' },
      { size: 'S', fit: '딱 맞음', description: '가슴 둘레 기준 최적 사이즈' },
      { size: 'M', fit: '여유있음', description: '가슴 둘레 기준 약 3cm 큼' },
    ],
  };
}

const FIT_COLORS: Record<string, string> = {
  '딱 맞음': 'bg-green-100 text-green-700',
  '여유있음': 'bg-blue-100 text-blue-700',
  '타이트': 'bg-orange-100 text-orange-700',
};

interface SizeRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

export default function SizeRecommendModal({
  isOpen,
  onClose,
  productId,
  productName,
}: SizeRecommendModalProps) {
  const [step, setStep] = useState<'select' | 'loading' | 'result'>('select');
  const [selectedPet, setSelectedPet] = useState<PetResponse | null>(null);
  const [result, setResult] = useState<SizeRecommendationResponse | null>(null);

  if (!isOpen) return null;

  function handlePetSelect(pet: PetResponse) {
    setSelectedPet(pet);
    setStep('loading');

    // mock: 로딩 시뮬레이션
    setTimeout(() => {
      setResult(buildMockResult(pet, productId, productName));
      setStep('result');
    }, 1200);
  }

  function handleClose() {
    setStep('select');
    setSelectedPet(null);
    setResult(null);
    onClose();
  }

  function handleRetry() {
    setStep('select');
    setSelectedPet(null);
    setResult(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative w-full bg-white rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#14314F]" />
            <h2 className="text-lg font-bold text-gray-900">우리 아이 사이즈 추천</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Step 1: 반려견 선택 */}
          {step === 'select' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-800">{productName}</span>의 사이즈를 추천받을 반려견을 선택하세요
              </p>

              {MOCK_PETS.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">등록된 반려견이 없어요</p>
                  <p className="text-xs text-gray-400 mt-1">마이페이지에서 반려견을 먼저 등록해주세요</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {MOCK_PETS.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handlePetSelect(pet)}
                      className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-200 rounded-xl hover:border-[#14314F] hover:bg-blue-50 transition-all text-left"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{pet.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {pet.breed} · 가슴 {pet.chestSize}cm
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: 로딩 */}
          {step === 'loading' && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#14314F] rounded-full animate-spin" />
              <p className="text-sm text-gray-500">
                {selectedPet?.name}의 체형을 분석 중...
              </p>
            </div>
          )}

          {/* Step 3: 결과 */}
          {step === 'result' && result && (
            <div>
              {/* 추천 사이즈 강조 */}
              <div className="flex items-center gap-4 bg-[#14314F] text-white rounded-2xl px-5 py-4 mb-5">
                <div>
                  <p className="text-xs opacity-70 mb-0.5">추천 사이즈</p>
                  <p className="text-4xl font-black">{result.recommendedSize}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs opacity-80 leading-relaxed">{result.reasoning}</p>
                </div>
              </div>

              {/* 사이즈별 핏 표 */}
              <div className="rounded-xl border border-gray-100 overflow-hidden mb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">사이즈</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">핏</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.optionFits.map((option) => (
                      <tr
                        key={option.size}
                        className={`border-t border-gray-100 ${option.size === result.recommendedSize ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-3 font-bold text-gray-800">
                          {option.size}
                          {option.size === result.recommendedSize && (
                            <span className="ml-1 text-[10px] text-[#14314F]">추천</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FIT_COLORS[option.fit] ?? 'bg-gray-100 text-gray-600'}`}>
                            {option.fit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{option.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleRetry}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                다른 반려견으로 다시 추천받기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
