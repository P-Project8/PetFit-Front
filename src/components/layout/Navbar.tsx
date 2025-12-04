import { useEffect, useRef, useState } from 'react';
import { Home, Search, Shirt, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart' ||
    location.pathname === '/ai-styling';

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navItems = [
    { id: 'home', icon: Home, label: '홈', location: '/' },
    { id: 'search', icon: Search, label: '검색', location: '/search' },
    { id: 'styling', icon: Shirt, label: '스타일링', location: '/ai-styling' },
    { id: 'wishlist', icon: Heart, label: '찜', location: '/wish' },
    { id: 'mypage', icon: User, label: '마이페이지', location: '/login' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY <= 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (hideNavbar) return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-[env(safe-area-inset-bottom)]
      transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }
    `}
    >
      <div className="grid grid-cols-5 h-12">
        {navItems.map((item) => {
          const Icon = item.icon;

          // 핵심 수정 부분: 현재 경로와 아이템의 경로가 일치하는지 확인
          // location.pathname이 '/' 일 때, item.location이 '/'인 홈 아이콘이 true가 됨
          const isActive = location.pathname === item.location;

          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(`${item.location}`);
              }}
              className="flex items-center justify-center transition-colors"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? `text-[#14314F]` : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
