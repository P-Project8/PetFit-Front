import { Outlet } from 'react-router';
import { Header, Navbar } from './components/layout';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Navbar />
      <Toaster position="top-center" />
    </div>
  );
}
