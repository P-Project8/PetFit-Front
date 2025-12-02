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
import ScrollToTop from './components/common/ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<App />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wish" element={<WishPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/style" />
          <Route path="/my" />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
