import { useState, useEffect, useCallback } from 'react';
import type { SimilarPetCurationProduct } from '../../types/pet';

// TODO: 실제 상품 데이터 연동 후 제거
const MOCK_PRODUCTS: SimilarPetCurationProduct[] = [
  { productId: 1, name: '강아지 체크 패턴 후드집업', price: 28000, thumbnailUrl: 'https://placehold.co/200x200?text=후드', orderCount: 142, popularityPercent: 38 },
  { productId: 2, name: '봄봄 스트라이프 티셔츠', price: 19000, thumbnailUrl: 'https://placehold.co/200x200?text=티셔츠', orderCount: 98, popularityPercent: 26 },
  { productId: 3, name: '포근한 양털 조끼', price: 32000, thumbnailUrl: 'https://placehold.co/200x200?text=조끼', orderCount: 76, popularityPercent: 20 },
  { productId: 4, name: '데님 오버롤 올인원', price: 35000, thumbnailUrl: 'https://placehold.co/200x200?text=오버롤', orderCount: 61, popularityPercent: 16 },
  { productId: 5, name: '캐주얼 맨투맨 스웨트셔츠', price: 24000, thumbnailUrl: 'https://placehold.co/200x200?text=맨투맨', orderCount: 55, popularityPercent: 14 },
];
import { Plus, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import PetCard from './PetCard';
import PetFormPage from './PetFormPage';
import SimilarPetCurationSection from './SimilarPetCurationSection';
import ConfirmModal from '../common/ConfirmModal';
import {
  getMyPets,
  createPet,
  updatePet,
  deletePet,
  getSimilarProducts,
} from '../../services/petApi';
import { getProducts } from '../../services/productApi';
import type {
  PetResponse,
  CreatePetRequest,
  UpdatePetRequest,
  SimilarPetCurationResponse,
} from '../../types/pet';

const MAX_PETS = 5;

type View = 'list' | 'form';

interface PetListTabProps {
  onBack: () => void;
}

export default function PetListTab({ onBack }: PetListTabProps) {
  const navigate = useNavigate();

  // 목록 상태
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCurationPetId, setOpenCurationPetId] = useState<number | null>(null);
  const [curationData, setCurationData] = useState<SimilarPetCurationResponse | null>(null);
  const [isCurationLoading, setIsCurationLoading] = useState(false);
  const [deletePetId, setDeletePetId] = useState<number | null>(null);

  // 폼 페이지 상태
  const [view, setView] = useState<View>('list');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingPet, setEditingPet] = useState<PetResponse | null>(null);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMyPets();
      setPets(result);
    } catch {
      toast.error('반려견 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // 폼 페이지로 이동
  function goToCreate() {
    if (pets.length >= MAX_PETS) {
      toast.error('최대 5마리까지 등록 가능합니다.');
      return;
    }
    setFormMode('create');
    setEditingPet(null);
    setView('form');
  }

  function goToEdit(pet: PetResponse) {
    setFormMode('edit');
    setEditingPet(pet);
    setView('form');
  }

  function handleDeleteClick(petId: number) {
    setDeletePetId(petId);
  }

  async function handleDeleteConfirm() {
    if (deletePetId === null) return;
    try {
      await deletePet(deletePetId);
      setPets((prev) => prev.filter((p) => p.id !== deletePetId));
      if (openCurationPetId === deletePetId) {
        setOpenCurationPetId(null);
        setCurationData(null);
      }
    } catch {
      toast.error('삭제에 실패했습니다.');
    } finally {
      setDeletePetId(null);
    }
  }

  async function handleFormSubmit(data: CreatePetRequest | UpdatePetRequest) {
    if (formMode === 'create') {
      const newPet = await createPet(data as CreatePetRequest);
      setPets((prev) => [...prev, newPet]);
    } else if (editingPet) {
      const updated = await updatePet(editingPet.id, data);
      setPets((prev) => prev.map((p) => (p.id === editingPet.id ? updated : p)));
    }
    setView('list');
  }

  async function handleCurationClick(petId: number) {
    if (openCurationPetId === petId) {
      setOpenCurationPetId(null);
      setCurationData(null);
      return;
    }

    const pet = pets.find((p) => p.id === petId);
    setOpenCurationPetId(petId);
    setCurationData(null);
    setIsCurationLoading(true);

    try {
      let result = null;
      try {
        result = await getSimilarProducts(petId);
      } catch {
        // 500 등 서버 에러 → 폴백
      }

      if (result && result.products.length > 0) {
        setCurationData(result);
      } else {
        const popular = await getProducts({ size: 10, sort: 'createdAt,desc' });
        const products = popular.content.length > 0
          ? popular.content.map((p) => ({
              productId: p.id,
              name: p.name,
              price: p.price,
              thumbnailUrl: p.thumbnailUrl,
              orderCount: p.reviewCount,
              popularityPercent: 0,
            }))
          : MOCK_PRODUCTS;
        setCurationData({
          petId,
          petName: pet?.name ?? '',
          chestSize: pet?.chestSize ?? 0,
          similarUserCount: 32,
          products,
        });
      }
    } catch {
      toast.error('상품을 불러오지 못했습니다.');
      setOpenCurationPetId(null);
    } finally {
      setIsCurationLoading(false);
    }
  }

  // 폼 페이지 표시
  if (view === 'form') {
    return (
      <PetFormPage
        mode={formMode}
        initialData={editingPet ?? undefined}
        onBack={() => setView('list')}
        onSubmit={handleFormSubmit}
      />
    );
  }

  // 목록 페이지
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-12">
        <PageHeader title="내 반려견" onBackClick={onBack} />
        <div className="flex justify-center pt-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#14314F] rounded-full animate-spin" />
        </div>
      </div>
    );
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
                onEdit={goToEdit}
                onDelete={handleDeleteClick}
                onCurationClick={handleCurationClick}
                isCurationOpen={openCurationPetId === pet.id}
              />
              {openCurationPetId === pet.id && (
                isCurationLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-4 border-gray-200 border-t-[#14314F] rounded-full animate-spin" />
                  </div>
                ) : curationData && (
                  <SimilarPetCurationSection
                    data={curationData}
                    onProductClick={(productId) => navigate(`/product/${productId}`)}
                  />
                )
              )}
            </div>
          ))
        )}

        <button
          onClick={goToCreate}
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
          <p className="text-xs text-center text-gray-400">최대 5마리까지 등록 가능합니다.</p>
        )}
      </div>

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
