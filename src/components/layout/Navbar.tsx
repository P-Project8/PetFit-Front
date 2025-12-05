import { Home, Search, Shirt, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart' ||
    location.pathname === '/ai-styling';

  const navItems = [
    { id: 'home', icon: Home, label: '홈', location: '/' },
    { id: 'search', icon: Search, label: '검색', location: '/search' },
    { id: 'styling', icon: Shirt, label: '스타일링', location: '/ai-styling' },
    { id: 'wishlist', icon: Heart, label: '찜', location: '/wish' },
    { id: 'mypage', icon: User, label: '마이페이지', location: '/login' },
  ];

  if (hideNavbar) return null;

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div
          className="
           pointer-events-auto
          w-full max-w-[400px] h-14
          bg-white/50 
          backdrop-blur-lg 
           border border-white/40
           rounded-[35px]
          shadow-[0_8px_32px_rgba(31,38,135,0.15)]
    
          flex items-center justify-between
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.location;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.location)}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute w-16 h-12 bg-gray-200/80 rounded-full -z-10"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <motion.div
                  animate={
                    isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? 'text-[#14314F]' : 'text-gray-500'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {/* 라벨: 선택 안되었을 때도 은은하게 보이거나, 선택시에만 진하게 */}
                </motion.div>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
