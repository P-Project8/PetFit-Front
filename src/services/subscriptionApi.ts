import { apiClient } from './client';
import type { ApiResponse } from './client';
import type { SubscriptionResponse, CreditResponse } from '../types/subscription';

export async function getSubscription(): Promise<SubscriptionResponse> {
  const { data } = await apiClient.get<ApiResponse<SubscriptionResponse>>('/api/subscription');
  return data.result;
}

export async function upgradeSubscription(): Promise<SubscriptionResponse> {
  const { data } = await apiClient.post<ApiResponse<SubscriptionResponse>>('/api/subscription/upgrade');
  return data.result;
}

export async function cancelSubscription(): Promise<SubscriptionResponse> {
  const { data } = await apiClient.delete<ApiResponse<SubscriptionResponse>>('/api/subscription');
  return data.result;
}

export async function getCredits(): Promise<CreditResponse> {
  const { data } = await apiClient.get<ApiResponse<CreditResponse>>('/api/subscription/credits');
  return data.result;
}
