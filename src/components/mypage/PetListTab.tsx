import { useState } from 'react';
import { Plus, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import PetCard from './PetCard';
import PetFormModal from './PetFormModal';
import SimilarPetCurationSection from './SimilarPetCurationSection';
import ConfirmModal from '../common/ConfirmModal';
import type {
  PetResponse,
  CreatePetRequest,
  UpdatePetRequest,
  SimilarPetCurationResponse,
} from '../../types/pet';

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
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const MOCK_CURATION: SimilarPetCurationResponse = {
  petId: 1,
  petName: '콩이',
  chestSize: 34,
  similarUserCount: 128,
  products: [
    {
      productId: 1,
      name: '강아지 봄 기본 티셔츠',
      price: 18900,
      thumbnailUrl: 'https://placehold.co/200x200/e8f0fe/14314F?text=T-shirt',
      orderCount: 54,
      popularityPercent: 42,
    },
    {
      productId: 2,
      name: '체크 패턴 하네스',
      price: 24900,
      thumbnailUrl: 'https://placehold.co/200x200/e8f0fe/14314F?text=Harness',
      orderCount: 40,
      popularityPercent: 31,
    },
    {
      productId: 3,
      name: '니트 조끼 풀오버',
      price: 29900,
      thumbnailUrl: 'https://placehold.co/200x200/e8f0fe/14314F?text=Knit',
      orderCount: 33,
      popularityPercent: 26,
    },
  ],
};

const MAX_PETS = 5;

interface PetListTabProps {
  onBack: () => void;
}

export default function PetListTab({ onBack }: PetListTabProps) {
  const navigate = useNavigate();
  const [pets, setPets] = useState<PetResponse[]>(MOCK_PETS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingPet, setEditingPet] = useState<PetResponse | null>(null);
  const [openCurationPetId, setOpenCurationPetId] = useState<number | null>(null);
  const [deletePetId, setDeletePetId] = useState<number | null>(null);

  function handleAddClick() {
    if (pets.length >= MAX_PETS) {
      toast.error('최대 5마리까지 등록 가능합니다.');
      return;
    }
    setFormMode('create');
    setEditingPet(null);
    setShowFormModal(true);
  }

  function handleEditClick(pet: PetResponse) {
    setFormMode('edit');
    setEditingPet(pet);
    setShowFormModal(true);
  }

  function handleDeleteClick(petId: number) {
    setDeletePetId(petId);
  }

  function handleDeleteConfirm() {
    if (deletePetId === null) return;
    setPets((prev) => prev.filter((p) => p.id !== deletePetId));
    if (openCurationPetId === deletePetId) setOpenCurationPetId(null);
    setDeletePetId(null);
    toast.success('반려견이 삭제되었습니다.');
  }

  function handleFormSubmit(data: CreatePetRequest | UpdatePetRequest) {
    if (formMode === 'create') {
      const newPet: PetResponse = {
        id: Date.now(),
        name: (data as CreatePetRequest).name,
        breed: (data as CreatePetRequest).breed,
        age: data.age ?? 0,
        weight: data.weight ?? 0,
        neckSize: data.neckSize ?? 0,
        chestSize: data.chestSize ?? 0,
        backLength: data.backLength ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPets((prev) => [...prev, newPet]);
      toast.success('반려견이 등록되었습니다.');
    } else if (editingPet) {
      setPets((prev) =>
        prev.map((p) =>
          p.id === editingPet.id
            ? {
                ...p,
                ...data,
                age: data.age ?? p.age,
                weight: data.weight ?? p.weight,
                neckSize: data.neckSize ?? p.neckSize,
                chestSize: data.chestSize ?? p.chestSize,
                backLength: data.backLength ?? p.backLength,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
      toast.success('반려견 정보가 수정되었습니다.');
    }
    setShowFormModal(false);
  }

  function handleCurationClick(petId: number) {
    setOpenCurationPetId((prev) => (prev === petId ? null : petId));
  }

  function getCurationData(pet: PetResponse): SimilarPetCurationResponse {
    return { ...MOCK_CURATION, petId: pet.id, petName: pet.name, chestSize: pet.chestSize };
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <PageHeader title="내 반려견" onBackClick={onBack} />

      <div className="px-4 pt-4 space-y-3">
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PawPrint className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">아직 등록된 반려견이 없어요</p>
            <p className="text-sm text-gray-400 mt-1">
              반려견을 등록하면 사이즈 추천을 받을 수 있어요
            </p>
          </div>
        ) : (
          pets.map((pet) => (
            <div key={pet.id}>
              <PetCard
                pet={pet}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onCurationClick={handleCurationClick}
                isCurationOpen={openCurationPetId === pet.id}
              />
              {openCurationPetId === pet.id && (
                <SimilarPetCurationSection
                  data={getCurationData(pet)}
                  onProductClick={(productId) => navigate(`/product/${productId}`)}
                />
              )}
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          onClick={handleAddClick}
          className={`w-full py-3.5 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${
            pets.length >= MAX_PETS
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-[#14314F] text-[#14314F] hover:bg-blue-50'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">반려견 추가</span>
        </button>

        {pets.length >= MAX_PETS && (
          <p className="text-xs text-center text-gray-400">
            최대 5마리까지 등록 가능합니다.
          </p>
        )}
      </div>

      <PetFormModal
        isOpen={showFormModal}
        mode={formMode}
        initialData={editingPet ?? undefined}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmModal
        isOpen={deletePetId !== null}
        title="반려견 삭제"
        message="정말 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletePetId(null)}
      />
    </div>
  );
}
