import { Bell, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getUnreadCount } from '../../services/api';
import PLogo from '/src/assets/P.svg?react';
import FLogo from '/src/assets/F.svg?react';

interface HeaderProps {
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}

export function Header({ scrollContainer }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isMainPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainer?.current) {
        setIsScrolled(scrollContainer.current.scrollTop > 50);
      } else {
        setIsScrolled(window.scrollY > 50);
      }
    };

    const target = scrollContainer?.current || window;
    target.addEventListener('scroll', handleScroll);
    return () => target.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  useEffect(function pollUnreadCount() {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    async function fetchCount() {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch {
        // 실패 시 뱃지 유지
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
        isScrolled ? 'bg-white/60 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="px-5 pt-0.5">
        <div className="flex justify-between items-center h-12">
          <div
            className="flex items-center select-none text-[#14314F] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <PLogo className="w-[18px] h-5" />
            <span
              className={`font-['KaKamora'] text-lg overflow-hidden mr-px whitespace-nowrap transition-all duration-300 ease-in-out ${
                isScrolled || !isMainPage
                  ? 'max-w-0 opacity-0 -translate-x-2'
                  : 'max-w-10 opacity-100 translate-x-0'
              }`}
            >
              et
            </span>

            <FLogo className="w-3.5 h-5" />
            <span
              className={`font-['KaKamora'] text-lg overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                isScrolled || !isMainPage
                  ? 'max-w-0 opacity-0 -translate-x-2'
                  : 'max-w-10 opacity-100 translate-x-0'
              }`}
            >
              it
            </span>
          </div>

          <div className="flex items-center gap-1">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          {isAuthenticated && (
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#14314F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}
