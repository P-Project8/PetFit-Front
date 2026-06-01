export interface PetResponse {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  neckSize: number;
  chestSize: number;
  backLength: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetRequest {
  name: string;
  breed: string;
  age?: number;
  weight?: number;
  neckSize?: number;
  chestSize?: number;
  backLength?: number;
}

export type UpdatePetRequest = Partial<CreatePetRequest>;

export interface OptionFit {
  size: string;
  fit: string;
  description: string;
}

export interface SizeRecommendationResponse {
  petId: number;
  petName: string;
  productId: number;
  productName: string;
  recommendedSize: string;
  reasoning: string;
  optionFits: OptionFit[];
}

export interface SimilarPetCurationProduct {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  orderCount: number;
  popularityPercent: number;
}

export interface SimilarPetCurationResponse {
  petId: number;
  petName: string;
  chestSize: number;
  similarUserCount: number;
  products: SimilarPetCurationProduct[];
}
