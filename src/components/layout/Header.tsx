import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCartStore } from '../../store/cartStore';
// import pLogo from '/P.png';
// import fLogo from '/F.png';
import PLogo from '/src/assets/P.svg?react';
import FLogo from '/src/assets/F.svg?react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const isMainPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
        isScrolled ? 'bg-white/60 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="px-5 pt-0.5">
        <div className="flex justify-between items-center h-12">
          {/* items-end로 밑줄 맞춤 */}
          <div
            className="flex items-center select-none text-[#14314F]"
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

          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
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
    </header>
  );
}
