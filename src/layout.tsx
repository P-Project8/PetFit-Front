import { Outlet, useLocation } from 'react-router';
import { useRef, useEffect } from 'react';
import { Header, Navbar } from './components/layout';
import { useMediaQuery } from './hooks/useMediaQuery';
import ServiceDescription from './components/layout/ServiceDescription';

export default function RootLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // 경로가 변경될 때마다 스크롤을 맨 위로 이동
  useEffect(() => {
    if (isDesktop && mobileWrapperRef.current) {
      mobileWrapperRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, isDesktop]);

  if (isDesktop) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] items-center justify-center">
        {/* Main Content Container */}
        <div className="flex w-full max-w-[1200px] h-[90vh] items-center justify-center gap-10 lg:gap-40">
          {/* Left Side: Service Description */}
          <div className="flex-1 max-w-[280px]">
            <ServiceDescription />
          </div>

          {/* Right Side: Mobile Frame */}
          <div className="flex-none w-[390px] h-full flex flex-col pt-5 pb-5">
            <div
              className="w-full h-full relative bg-white shadow-2xl overflow-hidden rounded-[40px] border-8 border-white ring-1 ring-gray-900/5"
              style={{ transform: 'translate3d(0, 0, 0)' }} // Fix for fixed positioning context
            >
              {/* Scrollable Content Area */}
              <div
                ref={mobileWrapperRef}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col"
              >
                {!['/login', '/signup'].includes(pathname) && (
                  <Header scrollContainer={mobileWrapperRef} />
                )}
                <div className="flex-1 flex flex-col">
                  <Outlet />
                </div>
                <Navbar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!['/login', '/signup'].includes(pathname) && <Header />}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
