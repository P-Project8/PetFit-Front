import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { logout as apiLogout } from '../services/api';
import { toast } from 'sonner';
import PageHeader from '../components/layout/PageHeader';
import {
  ChevronRight,
  Package,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import OrderHistoryTab from '../components/mypage/OrderHistoryTab';
import ProfileEditTab from '../components/mypage/ProfileEditTab';

type TabType = 'main' | 'orders' | 'profile' | 'faq' | 'notices' | 'inquiries';

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [currentTab, setCurrentTab] = useState<TabType>('main');

  async function handleLogout() {
    try {
      await apiLogout();
      useAuthStore.getState().logout();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch {
      useAuthStore.getState().logout();
      navigate('/login');
    }
  }

  // 메인 화면
  if (currentTab === 'main') {
    return (
      <div className="min-h-screen bg-gray-50 pt-12 pb-24">
        <PageHeader title="마이페이지" showBackButton={false} />

        <div className="bg-white">
          {/* 프로필 섹션 */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.name || '사용자'}
                </h2>
                <p className="text-sm text-gray-500">{user?.email || ''}</p>
              </div>
              <button
                onClick={() => setCurrentTab('profile')}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                프로필 수정
              </button>
            </div>
          </div>
        </div>
        {/* 메뉴 그리드 */}
        <div className="mt-2 bg-white">
          <div className="px-6 py-4">
            <div className="space-y-1">
              <button
                className="w-full flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentTab('orders')}
              >
                <Package className="w-4 h-4 text-[#14314F]" />
                <span className="text-base">주문내역</span>
              </button>
              <button
                className="w-full flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentTab('inquiries')}
              >
                <MessageSquare className="w-4 h-4 text-[#14314F]" />
                <span className="text-base">문의내역</span>
              </button>
              <button
                className="w-full flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentTab('faq')}
              >
                <HelpCircle className="w-4 h-4 text-[#14314F]" />
                <span className="text-base">FAQ</span>
              </button>
              <button
                className="w-full flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentTab('notices')}
              >
                <Bell className="w-4 h-4 text-[#14314F]" />
                <span className="text-base">공지사항</span>
              </button>
            </div>
          </div>
        </div>

        {/* 기타 메뉴 */}
        <div className="mt-2 bg-white">
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              서비스 정보
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-gray-900">
                <span className="text-sm">이용약관</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-gray-900">
                <span className="text-sm">개인정보처리방침</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-2 bg-white px-6 py-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 flex items-center gap-3 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <LogOut className="w-4 h-4 text-[#14314F]" />
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // 주문내역 탭
  if (currentTab === 'orders') {
    return <OrderHistoryTab onBack={() => setCurrentTab('main')} />;
  }

  // 프로필 수정 탭
  if (currentTab === 'profile') {
    return <ProfileEditTab onBack={() => setCurrentTab('main')} />;
  }

  // FAQ 탭
  if (currentTab === 'faq') {
    return (
      <div className="min-h-screen bg-white pt-12 pb-20">
        <PageHeader title="FAQ" onBackClick={() => setCurrentTab('main')} />
        <div className="px-6 py-6">
          <p className="text-gray-500 text-center py-20">
            FAQ 컨텐츠 준비 중입니다.
          </p>
        </div>
      </div>
    );
  }

  // 공지사항 탭
  if (currentTab === 'notices') {
    return (
      <div className="min-h-screen bg-white pt-12 pb-20">
        <PageHeader
          title="공지사항"
          onBackClick={() => setCurrentTab('main')}
        />
        <div className="px-6 py-6">
          <p className="text-gray-500 text-center py-20">
            공지사항 컨텐츠 준비 중입니다.
          </p>
        </div>
      </div>
    );
  }

  // 문의내역 탭
  if (currentTab === 'inquiries') {
    return (
      <div className="min-h-screen bg-white pt-12 pb-20">
        <PageHeader
          title="문의내역"
          onBackClick={() => setCurrentTab('main')}
        />
        <div className="px-6 py-6">
          <p className="text-gray-500 text-center py-20">
            문의내역 컨텐츠 준비 중입니다.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
