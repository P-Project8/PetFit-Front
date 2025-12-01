import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App';
import RootLayout from './layout';
import CategoryPage from './pages/CategoryPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<App />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
