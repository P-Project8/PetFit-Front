import { useState, useEffect } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PetResponse, CreatePetRequest, UpdatePetRequest } from '../../types/pet';
import { uploadFile } from '../../services/fileApi';

interface PetFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: PetResponse;
  onClose: () => void;
  onSubmit: (data: CreatePetRequest | UpdatePetRequest) => void;
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
  name: '',
  breed: '',
  age: '',
  weight: '',
  neckSize: '',
  chestSize: '',
  backLength: '',
  imageUrl: '',
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

export default function PetFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: PetFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const next = initialData ? petToFormState(initialData) : EMPTY_FORM;
      setForm(next);
      setImagePreview(initialData?.imageUrl ?? null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isValid = form.name.trim() !== '' && form.breed.trim() !== '';

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 즉시 로컬 미리보기
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setIsUploading(true);

    try {
      const { fileUrl } = await uploadFile(file, 'pets');
      setForm((prev) => ({ ...prev, imageUrl: fileUrl }));
      URL.revokeObjectURL(localPreview);
      setImagePreview(fileUrl);
    } catch {
      toast.error('사진 업로드에 실패했습니다.');
      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    } finally {
      setIsUploading(false);
      // 같은 파일 재선택 허용
      e.target.value = '';
    }
  }

  function handleSubmit() {
    if (!isValid || isUploading) return;

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

    onSubmit(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full bg-white rounded-t-2xl pb-[env(safe-area-inset-bottom)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? '반려견 등록' : '반려견 수정'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* 사진 업로드 */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="반려견 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {/* 업로드 로딩 오버레이 */}
              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              {/* 카메라 뱃지 */}
              {!isUploading && (
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#14314F] rounded-full flex items-center justify-center border-2 border-white">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </label>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="반려견 이름"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
            />
          </div>

          {/* 견종 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              견종 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              placeholder="예: 말티즈, 푸들, 시바이누"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
            />
          </div>

          {/* 나이 / 체중 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                나이 (살)
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="0"
                min="0"
                max="30"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                체중 (kg)
              </label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="0.0"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
              />
            </div>
          </div>

          {/* 체형 치수 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">체형 치수 (cm)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">목 둘레</label>
                <input
                  type="number"
                  value={form.neckSize}
                  onChange={(e) => handleChange('neckSize', e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">가슴 둘레</label>
                <input
                  type="number"
                  value={form.chestSize}
                  onChange={(e) => handleChange('chestSize', e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">등 길이</label>
                <input
                  type="number"
                  value={form.backLength}
                  onChange={(e) => handleChange('backLength', e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#14314F] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
            className="w-full py-3.5 bg-[#14314F] text-white font-bold rounded-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? '사진 업로드 중...' : mode === 'create' ? '등록하기' : '수정하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
