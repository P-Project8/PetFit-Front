import { useEffect, useState } from 'react';
import { getProfile, verifyAuth } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface AuthBootstrapProps {
  children: React.ReactNode;
}

export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const resetWishlist = useWishlistStore((state) => state.reset);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.reset);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(
    function validatePersistedAuth() {
      if (!hasHydrated) {
        setIsCheckingAuth(true);
        return;
      }

      if (!isAuthenticated || !accessToken || !refreshToken) {
        if (isAuthenticated || accessToken || refreshToken) {
          logout();
        }

        setIsCheckingAuth(false);
        return;
      }

      let isMounted = true;
      const currentAccessToken = accessToken;
      const currentRefreshToken = refreshToken;

      async function checkAuth() {
        try {
          await verifyAuth();
          const profile = await getProfile();

          if (!isMounted) {
            return;
          }

          login(currentAccessToken, currentRefreshToken, profile);
          // 로그인 확인 후 위시리스트 + 장바구니 초기 로드
          fetchWishlist();
          fetchCart();
        } catch {
          if (!isMounted) {
            return;
          }

          resetWishlist();
          resetCart();
          logout();
        } finally {
          if (isMounted) {
            setIsCheckingAuth(false);
          }
        }
      }

      checkAuth();

      return function cleanup() {
        isMounted = false;
      };
    },
    [
      accessToken,
      fetchCart,
      fetchWishlist,
      hasHydrated,
      isAuthenticated,
      login,
      logout,
      refreshToken,
      resetCart,
      resetWishlist,
    ]
  );

  if (!hasHydrated || isCheckingAuth) {
    return null;
  }

  return <>{children}</>;
}
