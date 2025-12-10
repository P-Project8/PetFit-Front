import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';

import App from './App';
import RootLayout from './layout';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import WishPage from './pages/WishPage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AIStylingPage from './pages/AIStylingPage';
import MyPage from './pages/MyPage';
import StyleGuidePage from './pages/StyleGuidePage';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from './components/ui';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* Main app - with layout */}
        <Route element={<RootLayout />}>
          {/* 홈 */}
          <Route index element={<App />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 카테고리 & 상품 */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* 장바구니 / 찜 / 검색 */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wish"
            element={
              <ProtectedRoute>
                <WishPage />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />

          {/* AI 스타일링 메인 페이지 */}
          <Route
            path="/ai-styling"
            element={
              <ProtectedRoute>
                <AIStylingPage />
              </ProtectedRoute>
            }
          />

          {/* 마이페이지 */}
          <Route
            path="/my"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/style-guide" element={<StyleGuidePage />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  </StrictMode>
);
