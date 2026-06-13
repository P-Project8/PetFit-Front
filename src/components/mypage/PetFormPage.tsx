import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import { uploadFile } from '../../services/fileApi';
import type { PetResponse, CreatePetRequest, UpdatePetRequest } from '../../types/pet';

interface PetFormPageProps {
  mode: 'create' | 'edit';
  initialData?: PetResponse;
  onBack: () => void;
  onSubmit: (data: CreatePetRequest | UpdatePetRequest) => Promise<void>;
}

interface FormState {
  name: string;
  breed: string;
  age: string;
  weight: string;
  neckSize: string;
  chestSize: string;
  backLength: string;
  imageUrl: string;
}

const EMPTY_FORM: FormState = {
  name: '', breed: '', age: '', weight: '',
  neckSize: '', chestSize: '', backLength: '', imageUrl: '',
};

function petToFormState(pet: PetResponse): FormState {
  return {
    name: pet.name,
    breed: pet.breed,
    age: pet.age > 0 ? String(pet.age) : '',
    weight: pet.weight > 0 ? String(pet.weight) : '',
    neckSize: pet.neckSize > 0 ? String(pet.neckSize) : '',
    chestSize: pet.chestSize > 0 ? String(pet.chestSize) : '',
    backLength: pet.backLength > 0 ? String(pet.backLength) : '',
    imageUrl: pet.imageUrl ?? '',
  };
}

export default function PetFormPage({ mode, initialData, onBack, onSubmit }: PetFormPageProps) {
  const [form, setForm] = useState<FormState>(initialData ? petToFormState(initialData) : EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData ? petToFormState(initialData) : EMPTY_FORM);
    setImagePreview(initialData?.imageUrl ?? null);
  }, [initialData]);

  const isValid = form.name.trim() !== '' && form.breed.trim() !== '';

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setIsUploading(true);

    try {
      const { fileUrl } = await uploadFile(file, 'pets');
      URL.revokeObjectURL(localPreview);
      setImagePreview(fileUrl);
      setForm((prev) => ({ ...prev, imageUrl: fileUrl }));
    } catch {
      toast.error('사진 업로드에 실패했습니다.');
      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit() {
    if (!isValid || isUploading || isSubmitting) return;

    const data: CreatePetRequest = {
      name: form.name.trim(),
      breed: form.breed.trim(),
      ...(form.age && { age: Number(form.age) }),
      ...(form.weight && { weight: Number(form.weight) }),
      ...(form.neckSize && { neckSize: Number(form.neckSize) }),
      ...(form.chestSize && { chestSize: Number(form.chestSize) }),
      ...(form.backLength && { backLength: Number(form.backLength) }),
      ...(form.imageUrl && { imageUrl: form.imageUrl }),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white pt-12 flex flex-col">
      <PageHeader
        title={mode === 'create' ? '반려견 등록' : '반려견 수정'}
        onBackClick={onBack}
      />

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-32">
        {/* 사진 */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="반려견 사진" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-9 h-9 text-gray-300" />
              )}
            </div>
            {isUploading ? (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#14314F] rounded-full flex items-center justify-center border-2 border-white">
                <Camera className="w-4 h-4 text-white" />
              </div>
            )}
          </label>
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">기본 정보</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="반려견 이름"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              견종 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              placeholder="예: 말티즈, 푸들, 시바이누"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">나이 (살)</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="0"
                min="0" max="30"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">체중 (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="0.0"
                min="0" step="0.1"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 체형 치수 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">체형 치수</h3>
            <p className="text-xs text-gray-400 mt-0.5">사이즈 추천 정확도를 높이려면 입력해주세요</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">목 둘레 (cm)</label>
              <input
                type="number"
                value={form.neckSize}
                onChange={(e) => handleChange('neckSize', e.target.value)}
                placeholder="0.0"
                min="0" step="0.1"
                className="w-full px-3 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">가슴 둘레 (cm)</label>
              <input
                type="number"
                value={form.chestSize}
                onChange={(e) => handleChange('chestSize', e.target.value)}
                placeholder="0.0"
                min="0" step="0.1"
                className="w-full px-3 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">등 길이 (cm)</label>
              <input
                type="number"
                value={form.backLength}
                onChange={(e) => handleChange('backLength', e.target.value)}
                placeholder="0.0"
                min="0" step="0.1"
                className="w-full px-3 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] bg-gray-50 focus:bg-white transition-colors text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-gray-100 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isUploading || isSubmitting}
          className="w-full py-4 bg-[#14314F] text-white font-bold rounded-2xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors active:scale-[0.98] flex items-center justify-center gap-2 text-base"
        >
          {(isUploading || isSubmitting) && <Loader2 className="w-5 h-5 animate-spin" />}
          {isUploading ? '사진 업로드 중...' : isSubmitting ? '저장 중...' : mode === 'create' ? '등록하기' : '수정하기'}
        </button>
      </div>
    </div>
  );
}
