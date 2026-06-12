import { apiClient } from './client';
import type { ApiResponse, PageResponse } from './client';

export type NotificationType =
  | 'GALLERY_LIKED'
  | 'GALLERY_COMMENTED'
  | 'CREDIT_WARNING'
  | 'CREDIT_EXHAUSTED'
  | 'SUBSCRIPTION_EXPIRED';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  targetType: string;
  targetId: number;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(
  page = 0,
  size = 20,
): Promise<PageResponse<NotificationItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<NotificationItem>>>(
    '/api/notifications',
    { params: { page, size, sort: 'createdAt,desc' } },
  );
  return data.result;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<ApiResponse<{ unreadCount: number }>>(
    '/api/notifications/unread-count',
  );
  return data.result.unreadCount;
}

export async function markNotificationRead(notificationId: number): Promise<NotificationItem> {
  const { data } = await apiClient.patch<ApiResponse<NotificationItem>>(
    `/api/notifications/${notificationId}/read`,
  );
  return data.result;
}

export async function markAllNotificationsRead(): Promise<number> {
  const { data } = await apiClient.patch<ApiResponse<number>>(
    '/api/notifications/read-all',
  );
  return data.result;
}
