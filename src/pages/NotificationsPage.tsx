import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Heart, MessageCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/api';
import type { NotificationItem, NotificationType } from '../services/api';
import type { PageResponse } from '../services/client';

const GALLERY_TYPES: NotificationType[] = ['GALLERY_LIKED', 'GALLERY_COMMENTED'];

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return new Date(createdAt).toLocaleDateString('ko-KR');
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const cls = 'w-5 h-5';
  switch (type) {
    case 'GALLERY_LIKED':
      return <Heart className={`${cls} text-red-400`} />;
    case 'GALLERY_COMMENTED':
      return <MessageCircle className={`${cls} text-blue-400`} />;
    case 'CREDIT_WARNING':
      return <AlertTriangle className={`${cls} text-yellow-400`} />;
    case 'CREDIT_EXHAUSTED':
      return <XCircle className={`${cls} text-red-500`} />;
    case 'SUBSCRIPTION_EXPIRED':
      return <Clock className={`${cls} text-gray-400`} />;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState<PageResponse<NotificationItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const load = useCallback(async function loadNotifications(targetPage: number) {
    setIsLoading(true);
    try {
      const result = await getNotifications(targetPage, 20);
      setPageData(result);
      setPage(targetPage);
    } catch {
      // 실패 시 현재 상태 유지
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  async function handleMarkRead(notification: NotificationItem) {
    if (notification.read) {
      if (GALLERY_TYPES.includes(notification.type)) {
        navigate(`/gallery/${notification.targetId}`);
      }
      return;
    }

    try {
      await markNotificationRead(notification.id);
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n,
          ),
        };
      });
    } catch {
      // 실패해도 UI 낙관적 업데이트 없이 유지
    }

    if (GALLERY_TYPES.includes(notification.type)) {
      navigate(`/gallery/${notification.targetId}`);
    }
  }

  async function handleMarkAll() {
    setIsMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((n) => ({ ...n, read: true })),
        };
      });
    } catch {
      // 실패 시 유지
    } finally {
      setIsMarkingAll(false);
    }
  }

  const hasUnread = pageData?.content.some((n) => !n.read) ?? false;

  return (
    <div className="min-h-screen bg-white pt-12 pb-20">
      <PageHeader title="알림" showBackButton={false} />

      <div className="flex justify-end px-4 py-2 border-b border-gray-100">
        <button
          onClick={handleMarkAll}
          disabled={!hasUnread || isMarkingAll}
          className="text-sm text-[#14314F] font-medium disabled:text-gray-300 cursor-pointer disabled:cursor-default"
        >
          전체 읽음
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        </div>
      ) : !pageData || pageData.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Bell className="w-10 h-10 text-gray-200" />
          <p className="text-gray-400 text-sm">알림이 없습니다.</p>
        </div>
      ) : (
        <>
          <ul>
            {pageData.content.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleMarkRead(notification)}
                  className={`w-full flex items-start gap-3 px-4 py-4 border-b border-gray-100 text-left transition-colors cursor-pointer ${
                    notification.read ? 'bg-white' : 'bg-blue-50/50'
                  } active:bg-gray-50`}
                >
                  <div className="mt-0.5 shrink-0">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-4 py-6">
            {!pageData.first && (
              <button
                onClick={() => load(page - 1)}
                className="text-sm text-[#14314F] font-medium cursor-pointer"
              >
                이전
              </button>
            )}
            {!pageData.last && (
              <button
                onClick={() => load(page + 1)}
                className="text-sm text-[#14314F] font-medium cursor-pointer"
              >
                다음
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
