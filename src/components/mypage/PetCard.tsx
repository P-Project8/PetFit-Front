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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex">
        {/* 왼쪽 이미지 */}
        <div className="w-40 h-40 my-4 ml-4 mr-1 shrink-0 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <PawPrint className="w-10 h-10 text-gray-300" />
          )}
        </div>

        {/* 오른쪽 정보 */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {/* 이름 + 액션 버튼 */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {pet.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{pet.breed}</p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
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

          {/* 나이 / 체중 */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <span>{pet.age}살</span>
            <span className="text-gray-300">·</span>
            <span>{pet.weight}kg</span>
          </div>

          {/* 체형 태그 */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="px-2 py-0.5 bg-[#F0F4F8] text-[#14314F] text-xs rounded-full font-medium">
              목 {pet.neckSize}cm
            </span>
            <span className="px-2 py-0.5 bg-[#F0F4F8] text-[#14314F] text-xs rounded-full font-medium">
              가슴 {pet.chestSize}cm
            </span>
            <span className="px-2 py-0.5 bg-[#F0F4F8] text-[#14314F] text-xs rounded-full font-medium">
              등 {pet.backLength}cm
            </span>
          </div>

          {/* 큐레이션 버튼 */}
          <button
            onClick={() => onCurationClick(pet.id)}
            className="flex items-center gap-1 text-xs font-medium text-[#14314F] hover:opacity-75 transition-opacity mt-3 self-start"
          >
            <span>
              {isCurationOpen ? '체형 맞춤 상품 닫기' : '체형 맞춤 상품 보기'}
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${isCurationOpen ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
