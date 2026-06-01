import { apiClient } from './client';
import type { ApiResponse } from './client';
import type {
  PetResponse,
  CreatePetRequest,
  UpdatePetRequest,
  SizeRecommendationResponse,
  SimilarPetCurationResponse,
} from '../types/pet';

export async function getMyPets(): Promise<PetResponse[]> {
  const { data } = await apiClient.get<ApiResponse<PetResponse[]>>('/api/pets');
  return data.result;
}

export async function createPet(request: CreatePetRequest): Promise<PetResponse> {
  const { data } = await apiClient.post<ApiResponse<PetResponse>>('/api/pets', request);
  return data.result;
}

export async function getPet(petId: number): Promise<PetResponse> {
  const { data } = await apiClient.get<ApiResponse<PetResponse>>(`/api/pets/${petId}`);
  return data.result;
}

export async function updatePet(petId: number, request: UpdatePetRequest): Promise<PetResponse> {
  const { data } = await apiClient.patch<ApiResponse<PetResponse>>(`/api/pets/${petId}`, request);
  return data.result;
}

export async function deletePet(petId: number): Promise<void> {
  await apiClient.delete(`/api/pets/${petId}`);
}

export async function getSizeRecommendation(
  petId: number,
  productId: number,
): Promise<SizeRecommendationResponse> {
  const { data } = await apiClient.get<ApiResponse<SizeRecommendationResponse>>(
    `/api/pets/${petId}/size-recommendation`,
    { params: { productId } },
  );
  return data.result;
}

export async function getSimilarProducts(petId: number): Promise<SimilarPetCurationResponse> {
  const { data } = await apiClient.get<ApiResponse<SimilarPetCurationResponse>>(
    `/api/pets/${petId}/similar-products`,
  );
  return data.result;
}
