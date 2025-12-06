import { Outlet } from 'react-router';
import { Header, Navbar } from './components/layout';

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Navbar />
    </div>
  );
}
