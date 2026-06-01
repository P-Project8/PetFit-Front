import { Pencil, Trash2, ChevronRight, PawPrint } from 'lucide-react';
import type { PetResponse } from '../../types/pet';

interface PetCardProps {
  pet: PetResponse;
  onEdit: (pet: PetResponse) => void;
  onDelete: (petId: number) => void;
  onCurationClick: (petId: number) => void;
  isCurationOpen: boolean;
}

export default function PetCard({
  pet,
  onEdit,
  onDelete,
  onCurationClick,
  isCurationOpen,
}: PetCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* 사진 */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            {pet.imageUrl ? (
              <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{pet.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{pet.breed}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(pet)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="수정"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(pet.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
            aria-label="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        <span>{pet.age}살</span>
        <span className="text-gray-300">|</span>
        <span>{pet.weight}kg</span>
      </div>

      {/* Body Metrics */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
          목 {pet.neckSize}cm
        </span>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
          가슴 {pet.chestSize}cm
        </span>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
          등 {pet.backLength}cm
        </span>
      </div>

      {/* Curation Button */}
      <button
        onClick={() => onCurationClick(pet.id)}
        className="flex items-center gap-1 text-sm font-medium text-[#14314F] hover:opacity-75 transition-opacity"
      >
        <span>{isCurationOpen ? '체형 맞춤 상품 닫기' : '체형 맞춤 상품 보기'}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${isCurationOpen ? 'rotate-90' : ''}`}
        />
      </button>
    </div>
  );
}
