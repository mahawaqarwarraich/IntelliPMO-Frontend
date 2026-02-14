import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const LG_BREAKPOINT = 1024;

function useIsLg() {
  const [isLg, setIsLg] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const handler = () => setIsLg(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isLg;
}

/**
 * Layout: Navbar on top, then Sidebar + main content.
 * On mobile/tablet (< lg): sidebar overlays the outlet (drawer). On desktop (lg+): sidebar beside outlet.
 */
export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isLg = useIsLg();

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);

  return (
    <div className="flex flex-col h-screen min-h-0 bg-gray-50 overflow-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Backdrop: mobile/tablet only, when sidebar open */}
        {!isLg && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className={`fixed inset-0 top-14 sm:top-16 z-20 bg-black/40 transition-opacity duration-200 lg:hidden ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}
        {/* Sidebar: overlay on mobile/tablet, in-flow on desktop */}
        <div
          className={
            isLg
              ? 'flex-shrink-0 flex transition-[width] duration-200 ease-out'
              : `fixed left-0 top-14 sm:top-16 bottom-0 z-30 w-64 transform transition-transform duration-200 ease-out lg:static lg:!translate-x-0 ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
          }
        >
          <Sidebar isOpen={isSidebarOpen} isOverlay={!isLg} onOverlayClose={!isLg ? toggleSidebar : undefined} />
        </div>
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
