import { useEffect, useRef, useState } from 'react';
import { Home, Search, Shirt, Heart, User } from 'lucide-react';

export function Navbar() {
  const [activeTab, setActiveTab] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navItems = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'search', icon: Search, label: '검색' },
    { id: 'styling', icon: Shirt, label: '스타일링' },
    { id: 'wishlist', icon: Heart, label: '찜' },
    { id: 'mypage', icon: User, label: '마이페이지' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 맨 위쪽(0)이거나, 스크롤을 위로 올릴 때 -> 보여줌
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

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50
      transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }
    `}
    >
      <div className="grid grid-cols-5 h-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
