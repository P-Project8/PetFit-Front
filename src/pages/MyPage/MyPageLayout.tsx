// src/pages/MyPage/MyPageLayout.tsx
import { Link, Outlet, useLocation } from 'react-router';

const menuItems = [
  { path: 'profile', label: '내 프로필' },
  { path: 'orders', label: '주문 내역' },
  { path: 'ai-styling', label: 'AI 스타일링 히스토리' },
  { path: 'settings', label: '설정' },
];

export default function MyPageLayout() {
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-gray-100">
      {/* 왼쪽 사이드바 */}
      <aside className="w-56 border-r bg-white px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">마이페이지</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-3 py-2 text-sm font-medium
                ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 오른쪽 컨텐츠 영역 */}
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
