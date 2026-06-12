import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { logout as apiLogout } from '../services/api';
import { getSubscription } from '../services/subscriptionApi';
import PageHeader from '../components/layout/PageHeader';
import ProfileSection from '../components/mypage/ProfileSection';
import MenuList from '../components/mypage/MenuList';
import OrderHistoryTab from '../components/mypage/OrderHistoryTab';
import ProfileEditTab from '../components/mypage/ProfileEditTab';
import PetListTab from '../components/mypage/PetListTab';
import MyGalleryTab from '../components/mypage/MyGalleryTab';
import SubscriptionTab from '../components/mypage/SubscriptionTab';

type TabType = 'main' | 'subscription' | 'orders' | 'profile' | 'faq' | 'notices' | 'inquiries' | 'pets' | 'gallery';

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [currentTab, setCurrentTab] = useState<TabType>('main');
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const sub = await getSubscription();
        setIsPremium(sub.isPremium);
      } catch {
        // 비로그인 등 에러 무시
      }
    }
    fetchSubscription();
  }, []);

  async function handleLogout() {
    try {
      await apiLogout();
      useWishlistStore.getState().reset();
      useCartStore.getState().reset();
      useAuthStore.getState().logout();
      navigate('/login');
    } catch {
      useWishlistStore.getState().reset();
      useCartStore.getState().reset();
      useAuthStore.getState().logout();
      navigate('/login');
    }
  }

  // 메인 화면
  if (currentTab === 'main') {
    return (
      <div className="min-h-screen bg-gray-50 pt-12 pb-24">
        <PageHeader title="마이페이지" />

        <ProfileSection
          name={user?.name || '사용자'}
          email={user?.email || ''}
          isPremium={isPremium}
          onEditClick={() => setCurrentTab('profile')}
        />

        <MenuList
          onSubscriptionClick={() => setCurrentTab('subscription')}
          onGalleryClick={() => setCurrentTab('gallery')}
          onPetsClick={() => setCurrentTab('pets')}
          onOrdersClick={() => setCurrentTab('orders')}
          onInquiriesClick={() => setCurrentTab('inquiries')}
          onFaqClick={() => setCurrentTab('faq')}
          onNoticesClick={() => setCurrentTab('notices')}
          onLogoutClick={handleLogout}
        />
      </div>
    );
  }

  // 구독 관리 탭
  if (currentTab === 'subscription') {
    return (
      <SubscriptionTab
        onBack={() => setCurrentTab('main')}
        onPlanChange={(premium) => setIsPremium(premium)}
      />
    );
  }

  // 스타일링 갤러리 탭
  if (currentTab === 'gallery') {
    return <MyGalleryTab onBack={() => setCurrentTab('main')} />;
  }

  // 반려견 탭
  if (currentTab === 'pets') {
    return <PetListTab onBack={() => setCurrentTab('main')} />;
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
