import { Upload, X, Plus, Shirt, HelpCircle } from 'lucide-react';

interface ImageUploadStepProps {
  petImage: string | null;
  clothingImage: string | null;
  selectedProduct: { id: number; name: string } | null;
  isProcessing: boolean;
  resultImage: string | null;
  onPetImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClothingImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPetImageRemove: () => void;
  onClothingImageRemove: () => void;
  onShowProductModal: () => void;
  onShowOnboarding: () => void;
  onAIStyling: () => void;
}

export default function ImageUploadStep({
  petImage,
  clothingImage,
  selectedProduct,
  isProcessing,
  resultImage,
  onPetImageChange,
  onClothingImageChange,
  onPetImageRemove,
  onClothingImageRemove,
  onShowProductModal,
  onShowOnboarding,
  onAIStyling,
}: ImageUploadStepProps) {
  return (
    <>
      {/* Help Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onShowOnboarding}
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
                onChange={onPetImageChange}
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
                        onPetImageRemove();
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
                    onClick={onShowProductModal}
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
                        onClothingImageRemove();
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
                      onChange={onClothingImageChange}
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
                    onClick={onShowProductModal}
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
                      onChange={onClothingImageChange}
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
          onClick={onAIStyling}
          disabled={!petImage || !clothingImage || isProcessing}
          className={`w-full py-3 bg-[#14314F] text-white font-bold text-base rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2 ${
            resultImage ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <span>옷 입혀보기</span>
        </button>
      </div>
    </>
  );
}
