export interface SubscriptionResponse {
  id: number;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  isPremium: boolean;
}

export interface CreditResponse {
  plan: string;
  used: number;
  monthlyLimit: number;
  remaining: number;
  unlimited: boolean;
}
