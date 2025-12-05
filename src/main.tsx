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
import ScrollToTop from './components/common/ScrollToTop';

// 마이페이지 관련 import
import MyPageLayout from './pages/MyPage/MyPageLayout';
import ProfilePage from './pages/MyPage/ProfilePage';
import OrdersPage from './pages/MyPage/OrdersPage';
import AiStylingPage from './pages/MyPage/AiStylingPage';
import SettingsPage from './pages/MyPage/SettingsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Auth pages - without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Main app - with layout */}
        <Route element={<RootLayout />}>
          {/* 홈 */}
          <Route index element={<App />} />

          {/* 카테고리 & 상품 */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* 장바구니 / 찜 / 검색 */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wish" element={<WishPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* AI 스타일링 메인 페이지 */}
          <Route path="/ai-styling" element={<AIStylingPage />} />

          {/* 마이페이지 라우트 */}
          <Route path="/my" element={<MyPageLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="ai-styling" element={<AiStylingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
